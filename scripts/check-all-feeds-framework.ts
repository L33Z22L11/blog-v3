#!/usr/bin/env node

import type { FeedEntry } from '../app/types/feed'
import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import tls from 'node:tls'
import { intro, outro, spinner } from '@clack/prompts'
import pLimit from 'p-limit'
import stripAnsi from 'strip-ansi'
import feeds, { flattenFeedGroups } from '../app/feeds'

function displayName(e: FeedEntry): string {
	return (e.title?.trim() || e.sitenick?.trim() || e.author?.trim() || '(无标题)')!
}

intro('🌐 批量检测友链 Server + IP + 证书域名')

const entries = flattenFeedGroups(feeds)
const limit = pLimit(20)

const s = spinner()
s.start(`正在处理 0/${entries.length} 个友链...`)

interface ServerResp {
	name: string
	archs: string[]
	server: string
	ip: string
	certDomains: string[]
	ipCertDomains: string[]
}

async function getCertDomains(options: tls.ConnectionOptions): Promise<string[]> {
	const { host, port = 443, servername } = options
	return new Promise((resolve) => {
		const socket = tls.connect(
			{ host, port, servername, rejectUnauthorized: false },
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
					console.error(`获取 ${host} 的证书域名失败: ${err}`)
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

async function getLinkInfo(e: FeedEntry): Promise<ServerResp> {
	const url = new URL(e.link.startsWith('http') ? e.link : `https://${e.link}`)
	const basicResp: ServerResp = {
		name: displayName(e),
		archs: e.archs ?? [],
		server: '(无 Server 信息)',
		ip: '(未知)',
		certDomains: [],
		ipCertDomains: [],
	}

	const lib = url.protocol === 'https:' ? https : http

	return new Promise<ServerResp>((resolve) => {
		const req = lib.request(url, { method: 'HEAD' })
		req.on('response', async (res) => {
			const server = res.headers.server as string ?? '(无 Server 信息)'
			const rawIp = res.socket.remoteAddress as string
			const ipHost = rawIp?.includes(':') ? `[${rawIp}]` : rawIp
			const ip = `${url.protocol}//${ipHost}`
			res.resume()
			if (url.protocol === 'https:') {
				const certDomains = await getCertDomains({ host: url.hostname, servername: url.hostname })
				const ipCertDomains = await getCertDomains({ host: ipHost })
				resolve({ ...basicResp, server, ip, certDomains, ipCertDomains })
			}
			else {
				resolve({ ...basicResp, server, ip })
			}
		})
		req.on('error', err => resolve({ ...basicResp, server: `请求失败: ${err.message}` }))
		req.end()
	})
}

let completed = 0
const results = await Promise.all(entries.map(e => limit(async () => {
	const r = await getLinkInfo(e)
	completed++
	s.message(`正在处理 ${completed}/${entries.length} 个友链...`)
	return r
})))

s.stop('📋 检测完成，开始生成日志')

fs.mkdirSync(path.resolve('logs'), { recursive: true })
const logFile = `logs/feeds-check-${new Date().getTime()}`

// 生成 CSV
function toCsv(data: any[], columns: string[]) {
	const lines: string[] = []
	lines.push(columns.join(','))
	for (const row of data) {
		const vals = columns.map((col) => {
			const v = row[col]
			return (v.join?.(';') ?? v ?? '').replace(/"/g, '""')
		})
		lines.push(vals.join(','))
	}
	return lines.join('\n')
}

function tableToString(data: any[], columns?: string[]) {
	const oldLog = console.log
	let output = ''
	console.log = (...args: any[]) => {
		output += `${args.join(' ')}\n`
	}
	console.table(data, columns)
	console.log = oldLog
	return stripAnsi(output)
}

const tableStr = tableToString(results, Object.keys(results[0]))
const csvStr = toCsv(results, Object.keys(results[0]))
fs.writeFileSync(path.resolve(`${logFile}.log`), tableStr, 'utf-8')
fs.writeFileSync(path.resolve(`${logFile}.csv`), `\uFEFF${csvStr}`, 'utf-8')

outro(`✅ 检测完成，日志已保存到: ${logFile}`)
