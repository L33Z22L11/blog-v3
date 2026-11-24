/* eslint-disable test/no-import-node-test -- Use Node's built-in runner without adding a test framework. */
import type { Server } from 'node:http'
import type { TestContext } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import net from 'node:net'
import test from 'node:test'
import { gzipSync } from 'node:zlib'
import {
	extractHtmlMeta,
	getLinkInfo,
	hasArchMismatch,
	inferArchs,
	isSuspiciousTitle,
	normalizeUrl,
	resolveFeedQuery,
	toCsv,
} from '../scripts/framework/utils'
import { getArchIcon } from '../shared/utils/icon'

async function listen(t: TestContext, server: Server): Promise<number> {
	const sockets = new Set<net.Socket>()
	server.on('connection', (socket) => {
		sockets.add(socket)
		socket.once('close', () => sockets.delete(socket))
	})
	t.after(async () => {
		for (const socket of sockets)
			socket.destroy()
		await new Promise<void>((done, reject) => server.close(err => err ? reject(err) : done()))
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

test('resolveFeedQuery, normalizeUrl, and toCsv handle search priority and serialization', () => {
	const sample = [
		{ author: 'Alice', link: 'https://hongliu.icu', archs: ['Next.js', 'Vercel'] },
		{ author: 'Bob', link: 'https://bob.github.io/', archs: ['Hexo', 'GitHub Pages'] },
	]
	assert.equal(normalizeUrl('https://Example.COM/blog/'), 'https://example.com/blog')
	assert.equal(resolveFeedQuery('Next.js', sample).isDirectAddress, false)
	assert.equal(resolveFeedQuery('github.io', sample).isDirectAddress, false)
	assert.equal(resolveFeedQuery('hongliu.icu/', sample).matches[0]?.author, 'Alice')
	assert.deepEqual(resolveFeedQuery('example.com', sample), { matches: [{ link: 'https://example.com/' }], isDirectAddress: true })
	assert.equal(toCsv([
		{ name: 'A,"B"', tags: ['a', 'b'], headers: { server: 'nginx' } },
	], ['name', 'tags', 'headers']), '"name","tags","headers"\n"A,""B""","a; b","server=nginx"')
})

test('inferArchs, hasArchMismatch, and HTML title checks avoid false positives', () => {
	const cases = [
		[{ finalUrl: 'https://a.com/', headers: { 'x-vercel-id': 'hnd1::1', 'x-powered-by': 'Nuxt' } }, ['Nuxt', 'Vercel']],
		[{ finalUrl: 'https://a.com/', headers: { 'eo-log-uuid': '1' }, html: '<script src="/_astro/a.js"></script>' }, ['Astro', 'EdgeOne']],
		[{ finalUrl: 'https://a.github.io/', server: 'GitHub.com', generator: 'Hexo 7.0.0' }, ['Hexo', 'GitHub Pages']],
	] as const
	for (const [input, expected] of cases) {
		const inferred = inferArchs(input)
		assert.deepEqual(inferred, expected)
		for (const arch of inferred)
			assert.ok(getArchIcon(arch), `missing icon for ${arch}`)
	}

	assert.equal(hasArchMismatch(['NotionNext', 'Vercel'], ['Next.js', 'Vercel']), false)
	assert.equal(hasArchMismatch(['Nuxt', 'Vercel'], ['Vue', 'Vercel']), false)
	assert.equal(hasArchMismatch(['EdgeOne'], ['国内 CDN']), false)
	assert.equal(hasArchMismatch(['Hexo', 'Netlify'], ['Hexo', '服务器']), false)
	assert.equal(hasArchMismatch(['Hexo', 'Vercel'], ['Astro', 'EdgeOne']), true)

	assert.deepEqual(
		extractHtmlMeta('<title> Hello &amp; &#39;Blog&#x27; </title><meta content="Hugo 0.140" name="generator">'),
		{ title: 'Hello & \'Blog\'', generator: 'Hugo 0.140' },
	)
	assert.equal(isSuspiciousTitle('Just a moment...'), true)
	assert.equal(isSuspiciousTitle('网站未备案拦截'), true)
	assert.equal(isSuspiciousTitle('我的 EdgeOne 折腾笔记'), false)
	assert.equal(isSuspiciousTitle('个人博客备案记录'), false)
})

test('HEAD 403/405 fallback, User-Agent, and mid-redirect field reset', { timeout: 4000 }, async (t) => {
	const dead = net.createServer()
	const deadPort = await new Promise<number>(done => dead.listen(0, '127.0.0.1', () => {
		const p = (dead.address() as net.AddressInfo).port
		dead.close(() => done(p))
	}))

	let ua = ''
	let onGetClose: () => void = () => {}
	const closedOnGet = new Promise<void>((done) => {
		onGetClose = done
	})
	const port = await listen(t, http.createServer((req, res) => {
		ua = req.headers['user-agent'] ?? ''
		if (req.url === '/403' && req.method === 'HEAD') {
			res.writeHead(403).end()
			return
		}
		if (req.url === '/to-dead') {
			res.writeHead(302, { Location: `http://127.0.0.1:${deadPort}/down`, Server: 'hop1' }).end()
			return
		}
		if (req.url === '/loop') {
			res.writeHead(302, { Location: '/loop' }).end()
			return
		}
		res.once('close', () => onGetClose())
		res.writeHead(200, { Server: 'ok-srv' })
		res.flushHeaders()
	}))

	const ok = await getLinkInfo({ link: `http://127.0.0.1:${port}/403` }, { timeout: 1000 })
	assert.equal(ok.code, 200)
	assert.equal(ok.method, 'GET')
	await closedOnGet
	assert.match(ua, /BlogFeedCheck/)

	const loop = await getLinkInfo({ link: `http://127.0.0.1:${port}/loop` }, { maxRedirects: 2 })
	assert.ok(loop.error)

	const midFail = await getLinkInfo({ link: `http://127.0.0.1:${port}/to-dead` }, { timeout: 1000 })
	assert.ok(midFail.error)
	assert.equal(midFail.code, -1)
	assert.equal(midFail.server, '')
	assert.equal(midFail.finalUrl, `http://127.0.0.1:${deadPort}/down`)
})

test('inspectHtml reads gzipped head and disconnects at </head>; checkFeed isolates feed errors', { timeout: 4000 }, async (t) => {
	let onStreamClose: () => void = () => {}
	const streamClosed = new Promise<void>((done) => {
		onStreamClose = done
	})
	const port = await listen(t, http.createServer((req, res) => {
		if (req.url === '/gzip') {
			const gz = gzipSync('<html><head><title>Gz &amp; Site</title><meta name="generator" content="Hexo 7"></head></html>')
			res.writeHead(200, { 'Content-Type': 'text/html', 'Content-Encoding': 'gzip' }).end(gz)
		}
		else if (req.url === '/atom.xml') {
			res.writeHead(200, { 'Content-Type': 'application/atom+xml' }).end()
		}
		else if (req.url === '/html-feed') {
			res.writeHead(200, { 'Content-Type': 'text/html' }).end()
		}
		else {
			res.once('close', () => onStreamClose())
			res.writeHead(200, { 'Content-Type': 'text/html' })
			res.write('<html><head><title>Stream</title></head>')
		}
	}))
	const origin = `http://127.0.0.1:${port}`

	const gz = await getLinkInfo({ link: `${origin}/gzip`, feed: `${origin}/atom.xml` }, { inspectHtml: true, checkFeed: true })
	assert.equal(gz.title, 'Gz & Site')
	assert.equal(gz.generator, 'Hexo 7')
	assert.equal(gz.feedCode, 200)
	assert.equal(gz.feedError, '')

	const streamed = await getLinkInfo({ link: `${origin}/`, feed: `${origin}/html-feed` }, { inspectHtml: true, checkFeed: true })
	assert.equal(streamed.error, '')
	assert.equal(streamed.title, 'Stream')
	await streamClosed
	assert.match(streamed.feedError, /HTML/)
})
