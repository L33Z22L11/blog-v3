import type { FeedEntry } from '../../app/types/feed'
import { Console } from 'node:console'
import http from 'node:http'
import https from 'node:https'
import { Writable } from 'node:stream'
import tls from 'node:tls'
import { stripVTControlCharacters } from 'node:util'
import feeds from '../../app/feeds'

export const entries = feeds.flatMap(group => group.entries)

type LinkEntry = Pick<FeedEntry, 'link'> & Partial<Pick<FeedEntry, 'title' | 'sitenick' | 'author' | 'archs'>>

export function displayName(e: LinkEntry): string {
	return e.title?.trim() || e.sitenick?.trim() || e.author?.trim() || e.link
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
	server: string
	ip: string
	certDomains: string[]
	certExpires: string
	certDaysLeft: number | null
	ipCertDomains: string[]
	ipCertError: string
	error: string
}

function certDomains(cert: tls.PeerCertificate): string[] {
	const domains = cert.subjectaltname?.split(', ').filter(name => name.startsWith('DNS:')).map(name => name.slice(4)) ?? []
	return domains.length ? domains : [cert.subject?.CN].flat().filter(name => name !== undefined)
}

/** 收到响应头即停止读取；GET 回退也不下载整页或无限响应体。 */
function readHeaders(url: URL, method: 'HEAD' | 'GET', signal: AbortSignal) {
	if (!['http:', 'https:'].includes(url.protocol))
		throw new Error(`不支持的协议: ${url.protocol}`)
	return new Promise<{
		code: number
		headers: http.IncomingHttpHeaders
		ip: string
		cert?: tls.PeerCertificate
	}>((resolve, reject) => {
		const req = (url.protocol === 'https:' ? https : http).request(url, { method, signal, agent: false }, (res) => {
			resolve({
				code: res.statusCode ?? -1,
				headers: res.headers,
				ip: res.socket.remoteAddress ?? '',
				cert: res.socket instanceof tls.TLSSocket ? res.socket.getPeerCertificate() : undefined,
			})
			res.destroy()
		})
		req.once('error', reject)
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

export async function getLinkInfo(e: LinkEntry, { timeout = 10000, maxRedirects = 5 } = {}): Promise<ServerResp> {
	const result: ServerResp = {
		name: displayName(e),
		url: e.link,
		finalUrl: e.link,
		code: -1,
		time: -1,
		method: 'HEAD',
		redirects: [],
		archs: e.archs ?? [],
		server: '',
		ip: '',
		certDomains: [],
		certExpires: '',
		certDaysLeft: null,
		ipCertDomains: [],
		ipCertError: '',
		error: '',
	}
	const start = Date.now()
	try {
		const signal = AbortSignal.timeout(timeout)
		let url = new URL(e.link)
		const visited = new Set([url.href])
		while (true) {
			result.finalUrl = url.href
			let response = await readHeaders(url, 'HEAD', signal)
			result.method = 'HEAD'
			if ([405, 501].includes(response.code)) {
				result.method = 'GET'
				response = await readHeaders(url, 'GET', signal)
			}
			result.code = response.code
			result.server = String(response.headers.server ?? '')
			result.ip = response.ip
			if ([301, 302, 303, 307, 308].includes(response.code) && response.headers.location) {
				const next = new URL(response.headers.location, url)
				if (visited.has(next.href))
					throw new Error('重定向循环')
				if (result.redirects.length >= maxRedirects)
					throw new Error(`重定向超过 ${maxRedirects} 次`)
				visited.add(next.href)
				result.redirects.push(next.href)
				url = next
				continue
			}
			result.time = Date.now() - start
			if (response.cert) {
				result.certDomains = certDomains(response.cert)
				const expires = Date.parse(response.cert.valid_to)
				if (Number.isFinite(expires)) {
					result.certExpires = new Date(expires).toISOString()
					result.certDaysLeft = Math.ceil((expires - Date.now()) / 86400000)
				}
				if (response.ip) {
					try {
						result.ipCertDomains = await getIpCertDomains(response.ip, Number(url.port || 443), signal)
					}
					catch (error) {
						result.ipCertError = signal.aborted ? 'IP 证书检测超时' : (error as Error).message
					}
				}
			}
			break
		}
	}
	catch (error) {
		result.time = Date.now() - start
		result.error = (error as Error).name === 'AbortError' ? '请求超时' : (error as Error).message
	}
	return result
}

export function toCsv<T extends object>(data: T[], columns: (keyof T & string)[]) {
	const quote = (value: unknown) => `"${String(Array.isArray(value) ? value.join('; ') : value ?? '').replaceAll('"', '""')}"`
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
