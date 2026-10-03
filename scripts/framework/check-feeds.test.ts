/* eslint-disable test/no-import-node-test -- Use Node's built-in runner without adding a test framework. */
import type { Server } from 'node:http'
import type { TestContext } from 'node:test'
import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { displayName, getLinkInfo, toCsv } from './utils'

const run = promisify(execFile)

async function listen(t: TestContext, server: Server | net.Server): Promise<number> {
	const sockets = new Set<net.Socket>()
	server.on('connection', (socket) => {
		sockets.add(socket)
		socket.once('close', () => sockets.delete(socket))
	})
	t.after(async () => {
		for (const socket of sockets)
			socket.destroy()
		await new Promise<void>((done, reject) => server.close(error => error ? reject(error) : done()))
	})
	await new Promise<void>((done, reject) => {
		server.once('error', reject)
		server.listen(0, '127.0.0.1', () => {
			server.off('error', reject)
			done()
		})
	})
	return (server.address() as net.AddressInfo).port
}

test('display names trim each fallback; CSV quotes headers and every cell', () => {
	assert.equal(displayName({ link: '', title: ' ', sitenick: ' Site ', author: 'Author' }), 'Site')
	assert.equal(displayName({ link: 'http://localhost/' }), 'http://localhost/')
	assert.equal(toCsv([
		{ name: 'A,"B"\nC', tags: ['one', 'two"'], missing: null },
		{ name: '', tags: [], missing: undefined },
	], ['name', 'tags', 'missing']), '"name","tags","missing"\n"A,""B""\nC","one; two""",""\n"","",""')
	assert.equal(toCsv([], ['name']), '"name"')
})

test('invalid URLs and unsupported protocols return errors without aborting valid checks', { timeout: 3000 }, async (t) => {
	const port = await listen(t, http.createServer((_req, res) => {
		res.setHeader('Server', 'local-fixture')
		res.end()
	}))
	const [bad, unsupported, good] = await Promise.all([
		getLinkInfo({ link: 'not a URL' }),
		getLinkInfo({ link: 'ftp://127.0.0.1/file' }),
		getLinkInfo({ link: `http://127.0.0.1:${port}/`, author: 'Local' }),
	])
	assert.ok(bad.error)
	assert.ok(unsupported.error)
	assert.equal(good.error, '')
	assert.equal(good.code, 200)
	assert.equal(good.method, 'HEAD')
	assert.equal(good.server, 'local-fixture')
	assert.equal(good.ip, '127.0.0.1')
})

test('HEAD 405 and 501 fall back to GET and close unfinished response bodies', { timeout: 4000 }, async (t) => {
	const methods: string[] = []
	let onBodyClose: () => void = () => {}
	const port = await listen(t, http.createServer((req, res) => {
		methods.push(req.method!)
		if (req.method === 'HEAD') {
			res.writeHead(Number(req.url!.slice(1)))
			res.end()
			return
		}
		res.once('close', () => onBodyClose())
		res.writeHead(200)
		res.flushHeaders()
		// Leave the body open: a headers-only check must close its connection.
	}))
	for (const code of [405, 501]) {
		const closed = new Promise<void>((done) => {
			onBodyClose = done
		})
		const result = await getLinkInfo({ link: `http://127.0.0.1:${port}/${code}` }, { timeout: 1000 })
		assert.equal(result.error, '')
		assert.equal(result.code, 200)
		assert.equal(result.method, 'GET')
		await closed
	}
	assert.deepEqual(methods, ['HEAD', 'GET', 'HEAD', 'GET'])
})

test('relative redirects reach the final URL; redirect loops stop at the configured limit', { timeout: 3000 }, async (t) => {
	let loopRequests = 0
	const port = await listen(t, http.createServer((req, res) => {
		if (req.url === '/final') {
			res.writeHead(204)
		}
		else {
			if (req.url === '/loop')
				loopRequests++
			res.writeHead(302, { Location: req.url === '/loop' ? '/loop' : '/final' })
		}
		res.end()
	}))
	const origin = `http://127.0.0.1:${port}`
	const result = await getLinkInfo({ link: `${origin}/start` })
	assert.equal(result.error, '')
	assert.equal(result.code, 204)
	assert.equal(result.url, `${origin}/start`)
	assert.equal(result.finalUrl, `${origin}/final`)
	assert.equal(result.redirects.length, 1)
	const loop = await getLinkInfo({ link: `${origin}/loop` }, { maxRedirects: 2 })
	assert.ok(loop.error)
	assert.ok(loopRequests <= 3, `redirect limit made ${loopRequests} requests`)
})

test('one deadline bounds HTTP and stalled TLS handshakes and releases sockets', { timeout: 4000 }, async (t) => {
	for (const protocol of ['http', 'https']) {
		let onClose: () => void = () => {}
		const closed = new Promise<void>((done) => {
			onClose = done
		})
		const server = net.createServer((socket) => {
			socket.once('close', onClose)
			socket.resume()
		})
		const port = await listen(t, server)
		const start = Date.now()
		const result = await getLinkInfo({ link: `${protocol}://127.0.0.1:${port}/` }, { timeout: 100 })
		assert.ok(result.error)
		assert.ok(Date.now() - start < 1500, `${protocol} exceeded its deadline`)
		await closed
	}
})

test('trusted HTTPS reuses its certificate and probes the same nonstandard port without SNI', { timeout: 15000 }, async (t) => {
	const dir = await mkdtemp(resolve(tmpdir(), 'feed-check-tls-'))
	t.after(() => rm(dir, { recursive: true, force: true }))
	const key = resolve(dir, 'key.pem')
	const cert = resolve(dir, 'cert.pem')
	await run('openssl', [
		'req',
		'-x509',
		'-newkey',
		'rsa:2048',
		'-nodes',
		'-days',
		'1',
		'-subj',
		'/CN=localhost',
		'-addext',
		'subjectAltName=DNS:localhost,IP:127.0.0.1',
		'-keyout',
		key,
		'-out',
		cert,
	], { timeout: 5000 })
	let connections = 0
	let ipProbeMode: 'normal' | 'reject' | 'stall' = 'normal'
	let onProbeClose: () => void = () => {}
	const server = https.createServer({ key: await readFile(key), cert: await readFile(cert) }, (_req, res) => res.end())
	const acceptTls = server.listeners('connection')[0]!
	server.off('connection', acceptTls)
	server.on('connection', (socket) => {
		connections++
		if (ipProbeMode !== 'normal' && connections % 2 === 0) {
			if (ipProbeMode === 'reject') {
				socket.destroy()
			}
			else {
				// Accept TCP data, but withhold the IP probe's TLS handshake.
				socket.once('close', onProbeClose)
				socket.resume()
			}
			return
		}
		acceptTls.call(server, socket)
	})
	const port = await listen(t, server)
	const url = `https://localhost:${port}/`
	const child = resolve(dir, 'probe.ts')
	await writeFile(child, `import { getLinkInfo } from ${JSON.stringify(resolve(import.meta.dirname, 'utils.ts'))}\nconsole.log(JSON.stringify(await getLinkInfo({ link: ${JSON.stringify(url)} }, { timeout: 500 })))\n`)
	const probe = () => run(resolve(import.meta.dirname, '../../node_modules/.bin/unrun'), [child], {
		cwd: resolve(import.meta.dirname, '../..'),
		env: { ...process.env, NODE_EXTRA_CA_CERTS: cert },
		timeout: 10000,
	})
	const { stdout } = await probe()
	const result = JSON.parse(stdout.trim())
	assert.equal(result.error, '')
	assert.equal(result.code, 200)
	assert.ok(result.certDomains.includes('localhost'))
	assert.ok(result.ipCertDomains.includes('localhost'))
	assert.equal(result.ipCertError, '')
	assert.equal(new Date(result.certExpires).toISOString(), result.certExpires)
	assert.ok(result.certDaysLeft >= 0 && result.certDaysLeft <= 1)
	assert.equal(connections, 2, 'one HTTPS connection plus one IP certificate probe')
	ipProbeMode = 'reject'
	const failedProbe = JSON.parse((await probe()).stdout.trim())
	assert.equal(failedProbe.code, 200)
	assert.equal(failedProbe.error, '')
	assert.ok(failedProbe.ipCertError, 'an IP probe failure must preserve the successful HTTP result')
	ipProbeMode = 'stall'
	const closed = new Promise<void>((done) => {
		onProbeClose = done
	})
	const started = Date.now()
	const stalledProbe = JSON.parse((await probe()).stdout.trim())
	assert.equal(stalledProbe.code, 200)
	assert.equal(stalledProbe.error, '')
	assert.match(stalledProbe.ipCertError, /超时/)
	assert.ok(Date.now() - started < 3000, 'the IP handshake must obey the overall deadline')
	await closed
	const untrusted = await getLinkInfo({ link: url }, { timeout: 1000 })
	assert.ok(untrusted.error, 'a certificate absent from the trust store must fail')
})
