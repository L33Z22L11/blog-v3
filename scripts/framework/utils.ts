import type { FeedEntry, FeedGroup } from '../../app/types/feed'
import { Console } from 'node:console'
import http from 'node:http'
import https from 'node:https'
import { Writable } from 'node:stream'
import tls from 'node:tls'
import stripAnsi from 'strip-ansi'
import feeds from '../../app/feeds'

export const entries = flattenFeedGroups(feeds)

function flattenFeedGroups(groups: FeedGroup[]): FeedEntry[] {
	return groups.flatMap(g => g.entries)
}

export function displayName(e: FeedEntry): string {
	return (e.title?.trim() || e.sitenick?.trim() || e.author?.trim() || '(无标题)')!
}

export interface ServerResp {
	name: string
	url: string
	code: number
	time: number
	archs: string[]
	server: string
	certDomains: string[]
	ipCertDomains: string[]
	error: string
}

export async function getLinkInfo(e: FeedEntry): Promise<ServerResp> {
	const basicResp: ServerResp = {
		name: displayName(e),
		url: e.link,
		code: -1,
		time: -1,
		archs: e.archs ?? [],
		server: '',
		certDomains: [],
		ipCertDomains: [],
		error: '',
	}

	const start = Date.now()
	const url = new URL(e.link)
	const lib = url.protocol === 'https:' ? https : http

	return new Promise<ServerResp>((resolve) => {
		const req = lib.request(url, { method: 'HEAD', timeout: 5000 })

		req.on('response', async (res) => {
			const code = res.statusCode as number
			const server = res.headers.server as string
			const rawIp = res.socket.remoteAddress as string
			const ipHost = rawIp?.includes(':') ? `[${rawIp}]` : rawIp
			// const ip = `${url.protocol}//${ipHost}`
			const time = Date.now() - start
			res.resume()
			if (url.protocol === 'https:') {
				const certDomains = await getCertDomains({ host: url.hostname, servername: url.hostname })
				const ipCertDomains = await getCertDomains({ host: ipHost, rejectUnauthorized: false })
				resolve({ ...basicResp, code, time, server, certDomains, ipCertDomains })
			}
			else {
				resolve({ ...basicResp, code, time, server })
			}
		})

		req.on('timeout', () => req.destroy() && resolve({ ...basicResp, error: '请求超时' }))
		req.on('error', err => resolve({ ...basicResp, error: err.message }))
		req.end()
	})
}

export async function getCertDomains(options: tls.ConnectionOptions): Promise<string[]> {
	options = { port: 443, timeout: 5000, ...options }
	return new Promise((resolve) => {
		const socket = tls.connect(options, () => {
			const cert = socket.getPeerCertificate(true)
			const san: string[] = cert.subjectaltname
				?.split(', ')
				.map(s => s.replace(/^DNS:/, '')) ?? []
			const domains = san.length ? san : [cert.subject.CN] as string[]
			resolve(domains)
			socket.end()
		})
		socket.on('error', () => resolve([]))
	})
}

export function toCsv(data: any[], columns: string[]) {
	const lines: string[] = []
	lines.push(columns.join(','))
	for (const row of data) {
		const vals = columns.map((col) => {
			const v = row[col]
			if (Array.isArray(v))
				return v.join('; ').replaceAll('"', '""')
			return v
		})
		lines.push(vals.join(','))
	}
	return lines.join('\n')
}

export function tableToString(data: any[], columns?: string[]) {
	let output = ''
	new Console(new Writable({
		write(chunk, encoding, callback) {
			output += chunk.toString()
			callback()
		},
	})).table(data, columns)
	return stripAnsi(output)
}
