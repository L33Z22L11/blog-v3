import type { IncomingHttpHeaders } from 'node:http'
import type { PeerCertificate } from 'node:tls'
import type { FeedEntry } from '../../app/types/feed'
import type { Arch } from '../../shared/utils/icon'
import { Buffer } from 'node:buffer'
import { Console } from 'node:console'
import { resolveCname } from 'node:dns/promises'
import http from 'node:http'
import https from 'node:https'
import { isIP } from 'node:net'
import { Writable } from 'node:stream'
import tls from 'node:tls'
import { stripVTControlCharacters } from 'node:util'
import { createBrotliDecompress, createGunzip, createInflate } from 'node:zlib'
import feeds from '../../app/feeds'

export const entries = feeds.flatMap(group => group.entries)

export type LinkEntry = Pick<FeedEntry, 'link'> & Partial<Pick<FeedEntry, 'title' | 'sitenick' | 'author' | 'archs' | 'feed' | 'error'>>

export interface LinkCheckOptions {
	timeout?: number
	maxRedirects?: number
	inspectHtml?: boolean
	checkFeed?: boolean
	skipDns?: boolean
}

export interface ServerResp {
	name: string
	url: string
	finalUrl: string
	code: number
	time: number
	method: 'HEAD' | 'GET'
	redirects: string[]
	archs: string[]
	inferredArchs: Arch[]
	archMismatch: boolean
	server: string
	headers: Record<string, string>
	cname: string[]
	ip: string
	title: string
	generator: string
	certDomains: string[]
	certExpires: string
	certDaysLeft: number | null
	ipCertDomains: string[]
	ipCertError: string
	feedCode: number | null
	feedContentType: string
	feedError: string
	knownError: string
	error: string
}

export interface ArchInferenceInput {
	finalUrl?: string
	server?: string
	headers?: Record<string, string>
	cname?: string[]
	title?: string
	generator?: string
	html?: string
}

export interface FeedQueryResult {
	matches: LinkEntry[]
	isDirectAddress: boolean
}

const MAX_HTML_BYTES = 32 * 1024

const DEFAULT_HEADERS = {
	'User-Agent': 'Mozilla/5.0 (compatible; BlogFeedCheck/1.0; +https://github.com/L33Z22L11/blog-v3)',
	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
	'Accept-Encoding': 'gzip, deflate, br',
}

const TRACKED_HEADERS = [
	'server',
	'x-powered-by',
	'via',
	'x-cache',
	'x-cdn',
	'cf-ray',
	'cf-cache-status',
	'x-vercel-id',
	'x-vercel-cache',
	'x-nf-request-id',
	'eo-log-uuid',
	'eo-cache-status',
	'x-github-request-id',
	'x-fastly-request-id',
	'fly-request-id',
	'x-zeabur-request-id',
	'x-deno-ray',
	'x-nextjs-cache',
	'x-nuxt-render',
	'x-pingback',
	'x-ghost-cache-status',
	'eagleid',
	'ali-swift-global-savetime',
	'x-swift-cachetime',
	'x-nws-log-uuid',
	'x-daa-tunnel',
	'x-upyun-request-id',
	'x-qiniu-zone',
	'x-cos-request-id',
	'x-oss-request-id',
	'content-type',
] as const

const REDIRECT_CODES = new Set([301, 302, 303, 307, 308])
const RETRY_GET_CODES = new Set([400, 403, 404, 405, 501])

const TLS_CERT_ERROR_CODES = new Set([
	'CERT_HAS_EXPIRED',
	'CERT_NOT_YET_VALID',
	'CERT_REVOKED',
	'CERT_UNTRUSTED',
	'CERT_REJECTED',
	'DEPTH_ZERO_SELF_SIGNED_CERT',
	'SELF_SIGNED_CERT_IN_CHAIN',
	'UNABLE_TO_VERIFY_LEAF_SIGNATURE',
	'UNABLE_TO_GET_ISSUER_CERT',
	'UNABLE_TO_GET_ISSUER_CERT_LOCALLY',
	'ERR_TLS_CERT_ALTNAME_INVALID',
])

const NON_FALLBACK_ERROR_CODES = new Set([
	'ENOTFOUND',
	'EAI_AGAIN',
	'ECONNREFUSED',
	'EHOSTUNREACH',
	'ENETUNREACH',
	'ERR_INVALID_URL',
	...TLS_CERT_ERROR_CODES,
])

const NAMED_ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: '\'',
	nbsp: ' ',
}

const ARCH_COVERAGE: Record<string, string[]> = {
	'NotionNext': ['Next.js', 'React', 'Notion'],
	'Nuxt': ['Vue'],
	'VitePress': ['Vue'],
	'VuePress': ['Vue'],
	'Valaxy': ['Vue'],
	'Next.js': ['React'],
	'EdgeOne': ['国内 CDN'],
	'WordPress': ['PHP'],
	'Typecho': ['PHP'],
	'虚拟主机': ['服务器'],
}

const HOSTING_ARCHS = new Set([
	'Vercel',
	'Netlify',
	'Cloudflare',
	'EdgeOne',
	'GitHub Pages',
	'Deno Deploy',
	'Fly',
	'Zeabur',
	'Framer',
	'Notion',
	'国内 CDN',
	'服务器',
	'虚拟主机',
])

const SUSPICIOUS_TITLE_PATTERNS = [
	/^just a moment/i,
	/^attention required/i,
	/^access denied\b/i,
	/^security check\b/i,
	/^403 forbidden\b/i,
	/^404 not found\b/i,
	/\berror 10\d\d\b/i,
	/edgeone.*(?:block|denied|error|security|captcha|防护|拦截)/i,
	/域名停放|网站暂停|站点暂停|网站阻断/,
	/网站未备案|未备案.*阻断|备案占位/,
]

export function displayName(e: LinkEntry): string {
	return e.title?.trim() || e.sitenick?.trim() || e.author?.trim() || e.link
}

export function normalizeUrl(raw: string): string {
	const trimmed = raw.trim()
	const parsed = URL.parse(trimmed)
	if (!parsed)
		return trimmed
	if (parsed.pathname.length > 1)
		parsed.pathname = parsed.pathname.replace(/\/+$/, '') || '/'
	return parsed.href
}

function matchByNormalizedUrl(url: URL, list: LinkEntry[]): LinkEntry | undefined {
	const normalized = normalizeUrl(url.href)
	const exact = list.find(e => normalizeUrl(e.link) === normalized)
	if (exact)
		return exact
	const stripped = normalized.replace(/^https?:/, '')
	return list.find(e => normalizeUrl(e.link).replace(/^https?:/, '') === stripped)
}

export function resolveFeedQuery(query: string, list: LinkEntry[]): FeedQueryResult {
	const trimmed = query.trim()
	if (!trimmed)
		return { matches: list, isDirectAddress: false }

	if (trimmed.includes('://')) {
		const target = URL.parse(trimmed)
		if (target && ['http:', 'https:'].includes(target.protocol)) {
			const existing = matchByNormalizedUrl(target, list)
			if (existing)
				return { matches: [existing], isDirectAddress: true }
			return { matches: [{ link: target.href }], isDirectAddress: true }
		}
		return { matches: [{ link: target?.href ?? trimmed }], isDirectAddress: true }
	}

	const q = trimmed.toLowerCase()
	const matches = list.filter(e => Object.values(e).join('\n').toLowerCase().includes(q))
	if (!/\s/.test(trimmed)) {
		const parsed = URL.parse(`https://${trimmed}`)
		if (parsed) {
			const existing = matchByNormalizedUrl(parsed, list)
			if (existing && !matches.includes(existing))
				matches.unshift(existing)
			if (matches.length)
				return { matches, isDirectAddress: false }
			const hostname = parsed.hostname.replace(/^\[|\]$/g, '')
			if (hostname.includes('.') || hostname === 'localhost' || isIP(hostname))
				return { matches: [{ link: parsed.href }], isDirectAddress: true }
		}
	}

	return { matches, isDirectAddress: false }
}

export function isSuspiciousTitle(title: string): boolean {
	const trimmed = title.trim()
	if (!trimmed)
		return false
	return SUSPICIOUS_TITLE_PATTERNS.some(pattern => pattern.test(trimmed))
}

function certDomains(cert: PeerCertificate): string[] {
	const domains = cert.subjectaltname?.split(', ').filter(name => name.startsWith('DNS:')).map(name => name.slice(4)) ?? []
	return domains.length ? domains : [cert.subject?.CN].flat().filter(name => name !== undefined)
}

function decodeHtmlEntities(input: string): string {
	return input
		.replaceAll(/&#(\d+);/g, (full, dec: string) => {
			const code = Number(dec)
			return code <= 0x10FFFF ? String.fromCodePoint(code) : full
		})
		.replaceAll(/&#x([0-9a-f]+);/gi, (full, hex: string) => {
			const code = Number.parseInt(hex, 16)
			return code <= 0x10FFFF ? String.fromCodePoint(code) : full
		})
		.replaceAll(/&([a-z]+);/gi, (full, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? full)
}

export function extractHtmlMeta(html: string): { title: string, generator: string } {
	const titleMatch = /<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(html)
	const title = titleMatch?.[1]
		? decodeHtmlEntities(titleMatch[1]).replaceAll(/\s+/g, ' ').trim()
		: ''

	let generator = ''
	for (const tagMatch of html.matchAll(/<meta\b[^>]*>/gi)) {
		const tag = tagMatch[0]
		let name = ''
		let content = ''
		for (const attr of tag.matchAll(/([a-z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
			const key = attr[1]?.toLowerCase()
			const val = attr[2] ?? attr[3] ?? attr[4] ?? ''
			if (key === 'name')
				name = val.toLowerCase()
			else if (key === 'content')
				content = val
		}
		if (name === 'generator' && content) {
			generator = decodeHtmlEntities(content).replaceAll(/\s+/g, ' ').trim()
			break
		}
	}

	return { title, generator }
}

function pickTrackedHeaders(rawHeaders: IncomingHttpHeaders): Record<string, string> {
	const picked: Record<string, string> = {}
	for (const key of TRACKED_HEADERS) {
		const raw = rawHeaders[key]
		if (raw === undefined)
			continue
		const value = (Array.isArray(raw) ? raw.join(', ') : String(raw)).trim()
		if (value)
			picked[key] = value
	}
	return picked
}

interface HttpProbeResult {
	code: number
	headers: Record<string, string>
	location: string
	ip: string
	cert?: PeerCertificate
	html: string
}

/** 收到响应头即停止读取；按需仅读取至 `</head>` 或最多 32KB HTML。 */
function probeHttp(
	url: URL,
	method: 'HEAD' | 'GET',
	signal: AbortSignal,
	options: { readHtml?: boolean, rejectUnauthorized?: boolean } = {},
): Promise<HttpProbeResult> {
	if (!['http:', 'https:'].includes(url.protocol))
		throw new Error(`不支持的协议: ${url.protocol}`)

	const { readHtml = false, rejectUnauthorized = true } = options
	return new Promise((resolve, reject) => {
		let settled = false
		let activeRes: http.IncomingMessage | undefined
		let activeDecoder: ReturnType<typeof createGunzip> | ReturnType<typeof createInflate> | ReturnType<typeof createBrotliDecompress> | undefined

		const reqOptions: https.RequestOptions = {
			method,
			signal,
			agent: false,
			headers: DEFAULT_HEADERS,
			...(url.protocol === 'https:' ? { rejectUnauthorized } : {}),
		}

		const req = (url.protocol === 'https:' ? https : http).request(url, reqOptions, (res) => {
			activeRes = res
			const code = res.statusCode ?? -1
			const headers = pickTrackedHeaders(res.headers)
			const rawLocation = res.headers.location
			const location = Array.isArray(rawLocation) ? (rawLocation[0] ?? '') : (rawLocation ?? '')
			const ip = res.socket?.remoteAddress ?? ''
			const cert = res.socket instanceof tls.TLSSocket ? res.socket.getPeerCertificate() : undefined
			const isRedirect = REDIRECT_CODES.has(code) && Boolean(location)
			const contentType = headers['content-type'] ?? ''
			const shouldReadHtml = method === 'GET'
				&& readHtml
				&& !isRedirect
				&& (!contentType || /html|xhtml|xml/i.test(contentType))

			if (!shouldReadHtml) {
				settled = true
				res.destroy()
				resolve({ code, headers, location, ip, cert, html: '' })
				return
			}

			const encoding = String(res.headers['content-encoding'] ?? '').split(',')[0]?.trim().toLowerCase()
			if (encoding === 'gzip' || encoding === 'x-gzip')
				activeDecoder = createGunzip()
			else if (encoding === 'deflate')
				activeDecoder = createInflate()
			else if (encoding === 'br')
				activeDecoder = createBrotliDecompress()

			const stream = activeDecoder ? res.pipe(activeDecoder) : res
			const chunks: Buffer[] = []
			let totalBytes = 0

			const finish = (html?: string) => {
				if (settled)
					return
				settled = true
				activeDecoder?.destroy()
				res.destroy()
				resolve({
					code,
					headers,
					location,
					ip,
					cert,
					html: html ?? Buffer.concat(chunks).toString('utf8'),
				})
			}

			const onStreamError = (err: Error) => {
				if (settled)
					return
				if (signal.aborted) {
					settled = true
					activeDecoder?.destroy()
					res.destroy()
					reject(err)
					return
				}
				finish()
			}

			res.on('error', onStreamError)
			activeDecoder?.on('error', onStreamError)

			stream.on('data', (chunk: Buffer | string) => {
				if (settled)
					return
				const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
				const remaining = MAX_HTML_BYTES - totalBytes
				if (remaining > 0) {
					const slice = buf.length > remaining ? buf.subarray(0, remaining) : buf
					chunks.push(slice)
					totalBytes += slice.length
				}
				const text = Buffer.concat(chunks).toString('utf8')
				if (totalBytes >= MAX_HTML_BYTES || text.toLowerCase().includes('</head>'))
					finish(text)
			})
			stream.once('end', () => finish())
			stream.once('close', () => finish())
		})

		req.once('error', (err) => {
			if (settled)
				return
			settled = true
			activeDecoder?.destroy()
			activeRes?.destroy()
			reject(err)
		})
		req.end()
	})
}

/** 仅查看同一 IP、同一端口在无 SNI 时返回的默认证书，不代表站点真实托管商。 */
function getIpCertDomains(host: string, port: number, signal: AbortSignal): Promise<string[]> {
	return new Promise((resolve, reject) => {
		const options = { host, port, signal, rejectUnauthorized: false }
		const socket = tls.connect(options, () => {
			resolve(certDomains(socket.getPeerCertificate()))
			socket.destroy()
		})
		socket.once('error', reject)
	})
}

export async function resolveCnameChain(hostname: string, signal: AbortSignal, maxHops = 5): Promise<string[]> {
	const host = hostname.replace(/^\[|\]$/g, '').toLowerCase()
	if (!host || host === 'localhost' || host.endsWith('.localhost') || isIP(host) || signal.aborted)
		return []

	const chain: string[] = []
	const visited = new Set([host])
	let current = host

	for (let i = 0; i < maxHops; i++) {
		if (signal.aborted)
			break
		let onAbort: (() => void) | undefined
		try {
			const cnames = await Promise.race([
				resolveCname(current).catch(() => [] as string[]),
				new Promise<never>((_, reject) => {
					onAbort = () => reject(signal.reason ?? new DOMException('Aborted', 'AbortError'))
					if (signal.aborted)
						onAbort()
					else
						signal.addEventListener('abort', onAbort, { once: true })
				}),
			])
			const next = cnames[0]?.replace(/\.$/, '').toLowerCase()
			if (!next || visited.has(next))
				break
			visited.add(next)
			chain.push(next)
			current = next
		}
		catch {
			break
		}
		finally {
			if (onAbort)
				signal.removeEventListener('abort', onAbort)
		}
	}

	return chain
}

function getErrorCode(error: unknown): string {
	if (!error || typeof error !== 'object')
		return ''
	const err = error as { code?: unknown, cause?: { code?: unknown } }
	if (typeof err.code === 'string')
		return err.code
	if (err.cause && typeof err.cause.code === 'string')
		return err.cause.code
	return ''
}

function formatErrorMessage(error: unknown): string {
	if (error instanceof Error)
		return error.name === 'AbortError' ? '请求超时' : error.message
	return String(error)
}

export function inferArchs(input: ArchInferenceInput): Arch[] {
	const headers = input.headers ?? {}
	const server = (input.server ?? headers.server ?? '').toLowerCase()
	const poweredBy = (headers['x-powered-by'] ?? '').toLowerCase()
	const generator = (input.generator ?? '').toLowerCase()
	const html = (input.html ?? '').toLowerCase()
	const cnames = (input.cname ?? []).map(c => c.toLowerCase())
	const host = URL.parse(input.finalUrl ?? '')?.hostname.toLowerCase() ?? ''

	const frameworks: Arch[] = []
	const hosting: Arch[] = []

	// 框架识别
	if (headers['x-nuxt-render'] || poweredBy.includes('nuxt') || generator.includes('nuxt') || html.includes('/_nuxt/') || html.includes('__nuxt'))
		frameworks.push('Nuxt')
	if (headers['x-nextjs-cache'] || poweredBy.includes('next.js') || generator.includes('next.js') || html.includes('/_next/') || html.includes('__next_data__'))
		frameworks.push('Next.js')
	if (generator.includes('astro') || html.includes('/_astro/'))
		frameworks.push('Astro')
	if (generator.includes('hexo') || /hexo[-_]theme/.test(html) || html.includes('window.hexo'))
		frameworks.push('Hexo')
	if (generator.includes('hugo'))
		frameworks.push('Hugo')
	if (headers['x-pingback'] || poweredBy.includes('wordpress') || generator.includes('wordpress') || html.includes('/wp-content/') || html.includes('/wp-includes/'))
		frameworks.push('WordPress')
	if (generator.includes('typecho') || html.includes('/usr/themes/'))
		frameworks.push('Typecho')
	if (poweredBy.includes('halo') || generator.includes('halo') || html.includes('/themes/theme-'))
		frameworks.push('Halo')
	if (headers['x-ghost-cache-status'] || poweredBy.includes('ghost') || generator.includes('ghost'))
		frameworks.push('Ghost')
	if (generator.includes('vitepress') || html.includes('vitepress-theme') || html.includes('__vp_'))
		frameworks.push('VitePress')
	if (generator.includes('vuepress'))
		frameworks.push('VuePress')
	if (generator.includes('jekyll'))
		frameworks.push('Jekyll')
	if (generator.includes('gridea'))
		frameworks.push('Gridea')
	if (generator.includes('valaxy'))
		frameworks.push('Valaxy')
	if (generator.includes('mkdocs'))
		frameworks.push('Material for MkDocs')
	if (poweredBy.includes('express'))
		frameworks.push('Express')
	if (poweredBy.includes('php') && !frameworks.includes('WordPress') && !frameworks.includes('Typecho'))
		frameworks.push('PHP')

	// 托管 / CDN 识别
	const matchesHostOrCname = (suffixes: string[]) =>
		suffixes.some(suffix => host.endsWith(suffix) || cnames.some(cname => cname.endsWith(suffix) || cname.includes(suffix)))

	if (headers['x-vercel-id'] || headers['x-vercel-cache'] || server === 'vercel' || matchesHostOrCname(['.vercel.app', '.vercel-dns.com']))
		hosting.push('Vercel')
	if (headers['x-nf-request-id'] || server === 'netlify' || matchesHostOrCname(['.netlify.app', '.netlifyglobalcdn.com']))
		hosting.push('Netlify')
	if (headers['cf-ray'] || headers['cf-cache-status'] || server === 'cloudflare' || matchesHostOrCname(['.cloudflare.net', '.pages.dev', '.workers.dev']))
		hosting.push('Cloudflare')
	if (headers['eo-log-uuid'] || headers['eo-cache-status'] || server.includes('edgeone') || cnames.some(c => c.includes('.eo.') || c.includes('edgeone')))
		hosting.push('EdgeOne')
	if (headers['x-github-request-id'] || server === 'github.com' || matchesHostOrCname(['.github.io']))
		hosting.push('GitHub Pages')
	if (headers['x-deno-ray'] || server.includes('deno') || matchesHostOrCname(['.deno.dev']))
		hosting.push('Deno Deploy')
	if (headers['fly-request-id'] || server.includes('fly/') || matchesHostOrCname(['.fly.dev']))
		hosting.push('Fly')
	if (headers['x-zeabur-request-id'] || matchesHostOrCname(['.zeabur.app']))
		hosting.push('Zeabur')
	if (server.includes('framer') || matchesHostOrCname(['.framer.website', '.framer.app']))
		hosting.push('Framer')
	if (matchesHostOrCname(['.notion.site', '.super.site']))
		hosting.push('Notion')

	const hasDomesticCdnHeader = Boolean(
		headers.eagleid
		|| headers['ali-swift-global-savetime']
		|| headers['x-swift-cachetime']
		|| headers['x-nws-log-uuid']
		|| headers['x-daa-tunnel']
		|| headers['x-upyun-request-id']
		|| headers['x-qiniu-zone']
		|| headers['x-cos-request-id']
		|| headers['x-oss-request-id'],
	)
	const hasDomesticCdnServer = /tengine|marco|wscdn|kunlun/.test(server)
	const hasDomesticCdnCname = cnames.some(c =>
		/alicdn|kunlun|aliyuncs|myqcloud|dnsv1|qiniudns|bcelive|upyun|baiduyundns|ksyuncdn|wangsu|chinacache/.test(c),
	)
	if ((hasDomesticCdnHeader || hasDomesticCdnServer || hasDomesticCdnCname) && !hosting.includes('EdgeOne'))
		hosting.push('国内 CDN')

	if (!hosting.length && /nginx|openresty|caddy|apache|litespeed|iis|traefik|envoy|gunicorn|uvicorn|kestrel/.test(server))
		hosting.push('服务器')

	return [...new Set([...frameworks, ...hosting])]
}

export function hasArchMismatch(recorded: string[], inferred: string[]): boolean {
	if (!recorded.length || !inferred.length)
		return false

	const covered = new Set<string>(recorded)
	for (const arch of recorded) {
		for (const alias of ARCH_COVERAGE[arch] ?? [])
			covered.add(alias)
	}
	const hasRecordedHosting = recorded.some(arch => HOSTING_ARCHS.has(arch))

	return inferred.some((arch) => {
		if (arch === '服务器' && hasRecordedHosting)
			return false
		return !covered.has(arch)
	})
}

async function fetchWithRedirects(
	startUrl: URL,
	signal: AbortSignal,
	options: {
		maxRedirects: number
		inspectHtml: boolean
		rejectUnauthorized: boolean
		initialRedirects?: string[]
	},
) {
	let url = startUrl
	const redirects = [...(options.initialRedirects ?? [])]
	const visited = new Set([startUrl.href, ...redirects])

	while (true) {
		let method: 'HEAD' | 'GET' = options.inspectHtml ? 'GET' : 'HEAD'
		let response: HttpProbeResult
		try {
			response = await probeHttp(url, method, signal, {
				readHtml: options.inspectHtml,
				rejectUnauthorized: options.rejectUnauthorized,
			})
			if (!options.inspectHtml && RETRY_GET_CODES.has(response.code)) {
				method = 'GET'
				response = await probeHttp(url, 'GET', signal, {
					readHtml: false,
					rejectUnauthorized: options.rejectUnauthorized,
				})
			}
		}
		catch (error) {
			const errCode = getErrorCode(error)
			if (
				!options.inspectHtml
				&& method === 'HEAD'
				&& !signal.aborted
				&& (error as Error).name !== 'AbortError'
				&& !NON_FALLBACK_ERROR_CODES.has(errCode)
			) {
				method = 'GET'
				response = await probeHttp(url, 'GET', signal, {
					readHtml: false,
					rejectUnauthorized: options.rejectUnauthorized,
				})
			}
			else {
				throw Object.assign(error instanceof Error ? error : new Error(String(error)), {
					failedUrl: url.href,
					redirects,
				})
			}
		}

		if (REDIRECT_CODES.has(response.code) && response.location) {
			const next = new URL(response.location, url)
			if (visited.has(next.href)) {
				throw Object.assign(new Error('重定向循环'), {
					failedUrl: url.href,
					redirects,
				})
			}
			if (redirects.length >= options.maxRedirects) {
				throw Object.assign(new Error(`重定向超过 ${options.maxRedirects} 次`), {
					failedUrl: url.href,
					redirects,
				})
			}
			visited.add(next.href)
			redirects.push(next.href)
			url = next
			continue
		}

		return {
			finalUrl: url,
			method,
			redirects,
			response,
		}
	}
}

function applyProbeResult(
	result: ServerResp,
	probe: Awaited<ReturnType<typeof fetchWithRedirects>>,
	options: { inspectHtml: boolean },
) {
	const { finalUrl, method, redirects, response } = probe
	result.finalUrl = finalUrl.href
	result.method = method
	result.redirects = redirects
	result.code = response.code
	result.headers = response.headers
	result.server = response.headers.server ?? ''
	result.ip = response.ip

	if (options.inspectHtml && response.html) {
		const meta = extractHtmlMeta(response.html)
		result.title = meta.title
		result.generator = meta.generator
	}

	if (response.cert) {
		result.certDomains = certDomains(response.cert)
		const expires = Date.parse(response.cert.valid_to)
		if (Number.isFinite(expires)) {
			result.certExpires = new Date(expires).toISOString()
			result.certDaysLeft = Math.ceil((expires - Date.now()) / 86400000)
		}
	}
}

async function checkFeedEndpoint(feedUrlRaw: string, signal: AbortSignal, maxRedirects: number) {
	try {
		const startUrl = new URL(feedUrlRaw)
		const probe = await fetchWithRedirects(startUrl, signal, {
			maxRedirects,
			inspectHtml: false,
			rejectUnauthorized: true,
		})
		const code = probe.response.code
		const contentType = probe.response.headers['content-type'] ?? ''
		let feedError = ''
		if (code >= 400)
			feedError = `HTTP ${code}`
		else if (/text\/html/i.test(contentType))
			feedError = '返回 HTML 而非订阅源'
		return { feedCode: code, feedContentType: contentType, feedError }
	}
	catch (error) {
		return {
			feedCode: null,
			feedContentType: '',
			feedError: formatErrorMessage(error),
		}
	}
}

export async function getLinkInfo(e: LinkEntry, options: LinkCheckOptions = {}): Promise<ServerResp> {
	const {
		timeout = 10000,
		maxRedirects = 5,
		inspectHtml = false,
		checkFeed = false,
		skipDns = false,
	} = options

	const result: ServerResp = {
		name: displayName(e),
		url: e.link,
		finalUrl: e.link,
		code: -1,
		time: -1,
		method: inspectHtml ? 'GET' : 'HEAD',
		redirects: [],
		archs: e.archs ?? [],
		inferredArchs: [],
		archMismatch: false,
		server: '',
		headers: {},
		cname: [],
		ip: '',
		title: '',
		generator: '',
		certDomains: [],
		certExpires: '',
		certDaysLeft: null,
		ipCertDomains: [],
		ipCertError: '',
		feedCode: null,
		feedContentType: '',
		feedError: '',
		knownError: e.error ?? '',
		error: '',
	}

	const start = Date.now()
	let rawHtml = ''
	const signal = AbortSignal.timeout(timeout)

	try {
		const startUrl = new URL(e.link)
		const probe = await fetchWithRedirects(startUrl, signal, {
			maxRedirects,
			inspectHtml,
			rejectUnauthorized: true,
		})
		result.time = Date.now() - start
		applyProbeResult(result, probe, { inspectHtml })
		rawHtml = probe.response.html
	}
	catch (error) {
		result.time = Date.now() - start
		result.error = formatErrorMessage(error)
		const errWithMeta = error as { failedUrl?: string, redirects?: string[] }
		if (errWithMeta.failedUrl)
			result.finalUrl = errWithMeta.failedUrl
		if (errWithMeta.redirects)
			result.redirects = errWithMeta.redirects
		result.code = -1
		result.server = ''
		result.headers = {}
		result.ip = ''

		const errCode = getErrorCode(error)
		const fallbackTarget = URL.parse(result.finalUrl)
		if (TLS_CERT_ERROR_CODES.has(errCode) && !signal.aborted && fallbackTarget?.protocol === 'https:') {
			try {
				const fallbackProbe = await fetchWithRedirects(fallbackTarget, signal, {
					maxRedirects: Math.max(0, maxRedirects - result.redirects.length),
					inspectHtml,
					rejectUnauthorized: false,
					initialRedirects: result.redirects,
				})
				applyProbeResult(result, fallbackProbe, { inspectHtml })
				rawHtml = fallbackProbe.response.html
			}
			catch {
				// 保留原始 TLS 校验错误与已记录的重定向信息
			}
		}
	}

	const finalParsed = URL.parse(result.finalUrl)
	const tasks: Promise<void>[] = []

	if (!skipDns && finalParsed && ['http:', 'https:'].includes(finalParsed.protocol) && !signal.aborted) {
		tasks.push(
			resolveCnameChain(finalParsed.hostname, signal).then((chain) => {
				result.cname = chain
			}),
		)
	}

	if (result.ip && finalParsed?.protocol === 'https:' && !signal.aborted) {
		tasks.push(
			getIpCertDomains(result.ip, Number(finalParsed.port || 443), signal)
				.then((domains) => {
					result.ipCertDomains = domains
				})
				.catch((error) => {
					result.ipCertError = signal.aborted ? 'IP 证书检测超时' : formatErrorMessage(error)
				}),
		)
	}

	if (checkFeed && e.feed && !signal.aborted) {
		tasks.push(
			checkFeedEndpoint(e.feed, signal, maxRedirects).then((feedResult) => {
				result.feedCode = feedResult.feedCode
				result.feedContentType = feedResult.feedContentType
				result.feedError = feedResult.feedError
			}),
		)
	}

	await Promise.all(tasks)

	result.inferredArchs = inferArchs({
		finalUrl: result.finalUrl,
		server: result.server,
		headers: result.headers,
		cname: result.cname,
		title: result.title,
		generator: result.generator,
		html: rawHtml,
	})
	result.archMismatch = hasArchMismatch(result.archs, result.inferredArchs)

	return result
}

function formatCsvValue(value: unknown): string {
	if (Array.isArray(value))
		return value.join('; ')
	if (value && typeof value === 'object') {
		return Object.entries(value as Record<string, unknown>)
			.map(([key, val]) => `${key}=${String(val)}`)
			.join('; ')
	}
	return String(value ?? '')
}

export function toCsv<T extends object>(data: T[], columns: (keyof T & string)[]) {
	const quote = (value: unknown) => `"${formatCsvValue(value).replaceAll('"', '""')}"`
	return [columns.map(quote).join(','), ...data.map(row => columns.map(key => quote(row[key])).join(','))].join('\n')
}

export function tableToString(data: object[], columns?: string[]) {
	let output = ''
	new Console(new Writable({
		write(chunk, encoding, callback) {
			output += chunk.toString()
			callback()
		},
	})).table(data, columns)
	return stripVTControlCharacters(output)
}
