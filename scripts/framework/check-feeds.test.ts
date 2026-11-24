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
import { gzipSync } from 'node:zlib'
import {
	displayName,
	extractHtmlMeta,
	getLinkInfo,
	hasArchMismatch,
	inferArchs,
	normalizeUrl,
	resolveFeedQuery,
	toCsv,
} from './utils'

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

test('displayName, normalizeUrl, and toCsv handle trimming, trailing slashes, and objects', () => {
	assert.equal(displayName({ link: '', title: ' ', sitenick: ' Site ', author: 'Author' }), 'Site')
	assert.equal(displayName({ link: 'http://localhost/' }), 'http://localhost/')

	assert.equal(normalizeUrl('https://Example.COM'), 'https://example.com/')
	assert.equal(normalizeUrl('https://example.com/blog/'), 'https://example.com/blog')
	assert.equal(normalizeUrl('https://example.com/blog/?a=1'), 'https://example.com/blog?a=1')

	assert.equal(toCsv([
		{ name: 'A,"B"\nC', tags: ['one', 'two"'], headers: { 'server': 'nginx', 'cf-ray': '123' }, missing: null },
		{ name: '', tags: [], headers: {}, missing: undefined },
	], ['name', 'tags', 'headers', 'missing']), '"name","tags","headers","missing"\n"A,""B""\nC","one; two""","server=nginx; cf-ray=123",""\n"","","",""')
	assert.equal(toCsv([], ['name']), '"name"')
})

test('resolveFeedQuery prioritizes friend search for dotted keywords and normalizes URL matches', () => {
	const sampleEntries = [
		{ author: 'Alice', link: 'https://hongliu.icu', archs: ['Next.js', 'Vercel'] },
		{ author: 'Bob', link: 'https://bob.github.io/', archs: ['Hexo', 'GitHub Pages'] },
		{ author: 'Carol', link: 'https://wiki.cooo.site/blog', archs: ['VitePress', 'Cloudflare'] },
	]

	const nextMatches = resolveFeedQuery('Next.js', sampleEntries)
	assert.equal(nextMatches.isDirectAddress, false)
	assert.deepEqual(nextMatches.matches.map(m => m.author), ['Alice'])

	const ghMatches = resolveFeedQuery('github.io', sampleEntries)
	assert.equal(ghMatches.isDirectAddress, false)
	assert.deepEqual(ghMatches.matches.map(m => m.author), ['Bob'])

	const noSlashDomain = resolveFeedQuery('hongliu.icu/', sampleEntries)
	assert.equal(noSlashDomain.isDirectAddress, false)
	assert.equal(noSlashDomain.matches[0]?.author, 'Alice')
	assert.deepEqual(noSlashDomain.matches[0]?.archs, ['Next.js', 'Vercel'])

	const explicitSubpath = resolveFeedQuery('https://wiki.cooo.site/blog/', sampleEntries)
	assert.equal(explicitSubpath.isDirectAddress, true)
	assert.equal(explicitSubpath.matches[0]?.author, 'Carol')

	const externalDomain = resolveFeedQuery('example.com', sampleEntries)
	assert.equal(externalDomain.isDirectAddress, true)
	assert.deepEqual(externalDomain.matches, [{ link: 'https://example.com/' }])

	const explicitExternal = resolveFeedQuery('https://example.org/hello/', sampleEntries)
	assert.equal(explicitExternal.isDirectAddress, true)
	assert.deepEqual(explicitExternal.matches, [{ link: 'https://example.org/hello/' }])

	assert.equal(resolveFeedQuery('', sampleEntries).matches.length, 3)
})

test('invalid URLs and unsupported protocols return errors without aborting valid checks', { timeout: 3000 }, async (t) => {
	let seenUserAgent = ''
	const port = await listen(t, http.createServer((req, res) => {
		seenUserAgent = req.headers['user-agent'] ?? ''
		res.setHeader('Server', 'local-fixture')
		res.setHeader('CF-Ray', 'abc-123')
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
	assert.equal(good.headers['cf-ray'], 'abc-123')
	assert.equal(good.ip, '127.0.0.1')
	assert.match(seenUserAgent, /BlogFeedCheck/)
})

test('HEAD 403, 405, and 501 fall back to GET and close unfinished response bodies', { timeout: 4000 }, async (t) => {
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
	for (const code of [403, 405, 501]) {
		const closed = new Promise<void>((done) => {
			onBodyClose = done
		})
		const result = await getLinkInfo({ link: `http://127.0.0.1:${port}/${code}` }, { timeout: 1000 })
		assert.equal(result.error, '')
		assert.equal(result.code, 200)
		assert.equal(result.method, 'GET')
		await closed
	}
	assert.deepEqual(methods, ['HEAD', 'GET', 'HEAD', 'GET', 'HEAD', 'GET'])
})

test('relative redirects reach final URL; redirect loops and mid-redirect failures clear stale hop fields', { timeout: 4000 }, async (t) => {
	// Reserve an unused port for mid-redirect connection failure.
	const deadServer = net.createServer()
	const deadPort = await new Promise<number>((done) => {
		deadServer.listen(0, '127.0.0.1', () => {
			const p = (deadServer.address() as net.AddressInfo).port
			deadServer.close(() => done(p))
		})
	})

	let loopRequests = 0
	const port = await listen(t, http.createServer((req, res) => {
		if (req.url === '/final') {
			res.writeHead(204)
		}
		else if (req.url === '/to-dead') {
			res.writeHead(302, {
				Location: `http://127.0.0.1:${deadPort}/down`,
				Server: 'hop1-proxy',
			})
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

	const midFail = await getLinkInfo({ link: `${origin}/to-dead` }, { timeout: 1000 })
	assert.ok(midFail.error)
	assert.equal(midFail.finalUrl, `http://127.0.0.1:${deadPort}/down`)
	assert.deepEqual(midFail.redirects, [`http://127.0.0.1:${deadPort}/down`])
	assert.equal(midFail.code, -1)
	assert.equal(midFail.server, '')
	assert.equal(midFail.ip, '')
})

test('inspectHtml extracts title and generator, supports gzip, and closes stream after </head>', { timeout: 4000 }, async (t) => {
	assert.deepEqual(
		extractHtmlMeta('<html><head><title>  Hello &amp; &#39;World&#x27;&nbsp;! </title><meta content="Astro v5.0" name="generator"></head></html>'),
		{ title: 'Hello & \'World\' !', generator: 'Astro v5.0' },
	)

	let onBodyClose: () => void = () => {}
	const port = await listen(t, http.createServer((req, res) => {
		if (req.url === '/gzip') {
			const html = gzipSync('<!doctype html><html><head><title>Gzipped &amp; Blog</title><meta name="generator" content="Hexo 7.3.0"></head><body><script src="/_nuxt/app.js"></script></body></html>')
			res.writeHead(200, {
				'Content-Type': 'text/html; charset=utf-8',
				'Content-Encoding': 'gzip',
				'X-Vercel-Id': 'hnd1::abc',
			})
			res.end(html)
			return
		}
		res.once('close', () => onBodyClose())
		res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
		res.write('<!doctype html><html><head><title>Streamed Title</title><meta content="Hugo 0.140.0" name="generator"></head>')
		// Keep body open; inspectHtml must disconnect right after </head>.
	}))

	const gzipped = await getLinkInfo({ link: `http://127.0.0.1:${port}/gzip` }, { inspectHtml: true })
	assert.equal(gzipped.error, '')
	assert.equal(gzipped.method, 'GET')
	assert.equal(gzipped.title, 'Gzipped & Blog')
	assert.equal(gzipped.generator, 'Hexo 7.3.0')
	assert.ok(gzipped.inferredArchs.includes('Hexo'))
	assert.ok(gzipped.inferredArchs.includes('Vercel'))

	const closed = new Promise<void>((done) => {
		onBodyClose = done
	})
	const streamed = await getLinkInfo({ link: `http://127.0.0.1:${port}/stream` }, { inspectHtml: true, timeout: 1000 })
	assert.equal(streamed.error, '')
	assert.equal(streamed.title, 'Streamed Title')
	assert.equal(streamed.generator, 'Hugo 0.140.0')
	assert.ok(streamed.inferredArchs.includes('Hugo'))
	await closed
})

test('inferArchs and hasArchMismatch classify frameworks/hosting and respect aliases', () => {
	assert.deepEqual(
		inferArchs({
			finalUrl: 'https://example.com/',
			headers: { 'x-vercel-id': 'iad1::123', 'x-powered-by': 'Nuxt' },
			cname: ['cname.vercel-dns.com'],
		}),
		['Nuxt', 'Vercel'],
	)
	assert.deepEqual(
		inferArchs({
			finalUrl: 'https://example.com/',
			headers: { 'eo-log-uuid': 'uuid-1' },
			cname: ['example.com.eo.dnse2.com'],
			html: '<script src="/_astro/entry.js"></script>',
		}),
		['Astro', 'EdgeOne'],
	)
	assert.deepEqual(
		inferArchs({
			finalUrl: 'https://alice.github.io/',
			server: 'GitHub.com',
			generator: 'Hexo 7.0.0',
		}),
		['Hexo', 'GitHub Pages'],
	)

	// Equivalence & subset rules must avoid false positives.
	assert.equal(hasArchMismatch(['NotionNext', 'Vercel'], ['Next.js', 'Vercel']), false)
	assert.equal(hasArchMismatch(['Nuxt', 'Vercel'], ['Vue', 'Vercel']), false)
	assert.equal(hasArchMismatch(['EdgeOne'], ['国内 CDN']), false)
	assert.equal(hasArchMismatch(['Hexo', 'Netlify'], ['Hexo', '服务器']), false)
	assert.equal(hasArchMismatch(['Nuxt', 'Vercel'], ['Vercel']), false)

	// Real framework or hosting changes must trigger mismatch.
	assert.equal(hasArchMismatch(['Hexo', 'Vercel'], ['Astro', 'Vercel']), true)
	assert.equal(hasArchMismatch(['Hexo', 'Vercel'], ['Hexo', 'EdgeOne']), true)
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

test('trusted HTTPS reuses cert and probes nonstandard port; untrusted HTTPS still collects cert metadata', { timeout: 15000 }, async (t) => {
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
	const server = https.createServer({ key: await readFile(key), cert: await readFile(cert) }, (_req, res) => {
		res.setHeader('Server', 'tls-fixture')
		res.end()
	})
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

	ipProbeMode = 'normal'
	const untrusted = await getLinkInfo({ link: url }, { timeout: 1000 })
	assert.ok(untrusted.error, 'a certificate absent from the trust store must fail')
	assert.equal(untrusted.code, 200)
	assert.equal(untrusted.server, 'tls-fixture')
	assert.ok(untrusted.ip)
	assert.ok(untrusted.certDomains.includes('localhost'))
	assert.equal(new Date(untrusted.certExpires).toISOString(), untrusted.certExpires)
	assert.ok(untrusted.certDaysLeft !== null && untrusted.certDaysLeft >= 0)
})

test('checkFeed validates RSS/Atom endpoints without polluting site status', { timeout: 4000 }, async (t) => {
	const port = await listen(t, http.createServer((req, res) => {
		if (req.url === '/atom.xml') {
			res.writeHead(200, { 'Content-Type': 'application/atom+xml; charset=utf-8' })
		}
		else if (req.url === '/html-feed') {
			res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
		}
		else if (req.url === '/missing-feed') {
			res.writeHead(404)
		}
		else {
			res.writeHead(200, { 'Content-Type': 'text/html' })
		}
		res.end()
	}))
	const origin = `http://127.0.0.1:${port}`

	const valid = await getLinkInfo({ link: `${origin}/`, feed: `${origin}/atom.xml` }, { checkFeed: true })
	assert.equal(valid.error, '')
	assert.equal(valid.feedCode, 200)
	assert.match(valid.feedContentType, /atom\+xml/)
	assert.equal(valid.feedError, '')

	const htmlFeed = await getLinkInfo({ link: `${origin}/`, feed: `${origin}/html-feed` }, { checkFeed: true })
	assert.equal(htmlFeed.error, '')
	assert.equal(htmlFeed.feedCode, 200)
	assert.match(htmlFeed.feedError, /HTML/)

	const missingFeed = await getLinkInfo({ link: `${origin}/`, feed: `${origin}/missing-feed` }, { checkFeed: true })
	assert.equal(missingFeed.error, '')
	assert.equal(missingFeed.code, 200)
	assert.equal(missingFeed.feedCode, 404)
	assert.match(missingFeed.feedError, /404/)
})
