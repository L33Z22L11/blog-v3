import type { FeedEntry, FeedGroup } from '../../app/types/feed'
import http from 'node:http'
import https from 'node:https'
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
	archs: string[]
	server: string
	certDomains: string[]
	ipCertDomains: string[]
}

export async function getLinkInfo(e: FeedEntry): Promise<ServerResp> {
	const url = new URL(e.link.startsWith('http') ? e.link : `https://${e.link}`)
	const basicResp: ServerResp = {
		name: displayName(e),
		archs: e.archs ?? [],
		server: '(无 Server 信息)',
		certDomains: [],
		ipCertDomains: [],
	}

	const lib = url.protocol === 'https:' ? https : http

	return new Promise<ServerResp>((resolve) => {
		const req = lib.request(url, { method: 'HEAD', timeout: 5000 })

		req.on('response', async (res) => {
			const server = res.headers.server as string ?? '(无 Server 信息)'
			const rawIp = res.socket.remoteAddress as string
			const ipHost = rawIp?.includes(':') ? `[${rawIp}]` : rawIp
			// const ip = `${url.protocol}//${ipHost}`
			res.resume()
			if (url.protocol === 'https:') {
				const certDomains = await getCertDomains({ host: url.hostname, servername: url.hostname })
				const ipCertDomains = await getCertDomains({ host: ipHost, rejectUnauthorized: false })
				resolve({ ...basicResp, server, certDomains, ipCertDomains })
			}
			else {
				resolve({ ...basicResp, server })
			}
		})
		req.on('error', err => resolve({ ...basicResp, server: `请求失败: ${err.message}` }))
		req.end()
	})
}

export async function getCertDomains(options: tls.ConnectionOptions): Promise<string[]> {
	return new Promise((resolve) => {
		const socket = tls.connect(
			{ port: 443, ...options },
			() => {
				try {
					const cert = socket.getPeerCertificate(true)
					const san: string[] = cert.subjectaltname
						?.split(', ')
						.map(s => s.replace(/^DNS:/, '')) ?? []
					const domains = san.length ? san : [cert.subject.CN]
					resolve(domains)
				}
				catch (err) {
					console.error(`获取 ${options.host} 的证书域名失败: ${err}`)
					resolve([])
				}
				finally {
					socket.end()
				}
			},
		)
		socket.on('error', () => resolve([]))
	})
}

export function toCsv(data: any[], columns: string[]) {
	const lines: string[] = []
	lines.push(columns.join(','))
	for (const row of data) {
		const vals = columns.map((col) => {
			const v = row[col]
			return (v.join?.('; ') ?? v ?? '').replace(/"/g, '""')
		})
		lines.push(vals.join(','))
	}
	return lines.join('\n')
}

export function tableToString(data: any[], columns?: string[]) {
	const oldLog = console.log
	let output = ''
	console.log = (...args: any[]) => {
		output += `${args.join(' ')}\n`
	}
	console.table(data, columns)
	console.log = oldLog
	return stripAnsi(output)
}
