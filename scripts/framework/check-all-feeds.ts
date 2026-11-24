#!/usr/bin/env node

import type { ServerResp } from './utils'
import fs from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { intro, log, outro, spinner } from '@clack/prompts'
import pLimit from 'p-limit'
import { Temporal } from 'temporal-polyfill'
import { entries, getLinkInfo, isSuspiciousTitle, normalizeUrl, tableToString, toCsv } from './utils'

const { values } = parseArgs({
	options: {
		'concurrency': { type: 'string', default: '20' },
		'inspect': { type: 'boolean' },
		'with-feed': { type: 'boolean' },
		'json': { type: 'boolean' },
		'strict': { type: 'boolean' },
		'help': { type: 'boolean', short: 'h' },
	},
})
if (values.help) {
	console.log('用法: pnpm check:feed/all [--concurrency 20] [--inspect] [--with-feed] [--json] [--strict]\n检测全部友链，将精简表格日志、完整 CSV（及可选 JSON）保存到 logs 目录。')
	process.exit(0)
}
const concurrency = Number(values.concurrency)
if (!Number.isInteger(concurrency) || concurrency < 1) {
	console.error('--concurrency 必须为正整数。')
	process.exit(1)
}

const inspectHtml = Boolean(values.inspect)
const checkFeed = Boolean(values['with-feed'])

function truncate(text: string, max: number): string {
	return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

function isFailed(result: ServerResp): boolean {
	return Boolean(result.error) || result.code >= 400
}

function printSection(title: string, items: string[], level: 'info' | 'warn' | 'success' = 'warn', limit = 15) {
	if (!items.length)
		return
	const visible = items.slice(0, limit).map(line => `  - ${line}`)
	if (items.length > limit)
		visible.push(`  ... 其余 ${items.length - limit} 项见报告`)
	log[level](`${title} (${items.length}):\n${visible.join('\n')}`)
}

intro('🌐 批量检测友链状态与架构')
if (!entries.length) {
	outro('没有需要检测的友链')
	process.exit(0)
}
const s = spinner()
s.start(`已处理 0/${entries.length} 个友链...`)

let completed = 0
const results = await pLimit(concurrency).map(entries, async (entry) => {
	const result = await getLinkInfo(entry, { inspectHtml, checkFeed })
	s.message(`已处理 ${++completed}/${entries.length} 个友链...`)
	return result
})
s.stop('检测完成，开始生成报告')

fs.mkdirSync(resolve('logs'), { recursive: true })
const logFile = `logs/feeds-check-${Temporal.Now.plainDateTimeISO().toLocaleString('sv').replaceAll(/\W/g, '-')}`

const logRows = results.map(r => ({
	name: truncate(r.name, 28),
	code: r.code,
	time: r.time,
	archs: r.archs.join(', '),
	inferredArchs: `${r.inferredArchs.join(', ')}${r.archMismatch ? ' *' : ''}`,
	server: truncate(r.server, 24),
	certDaysLeft: r.certDaysLeft,
	...(inspectHtml ? { title: truncate(r.title, 32) } : {}),
	...(checkFeed ? { feedCode: r.feedCode } : {}),
	redirect: normalizeUrl(r.url) !== normalizeUrl(r.finalUrl) ? truncate(r.finalUrl, 48) : '',
	error: truncate(r.error || (r.feedError ? `feed: ${r.feedError}` : ''), 48),
}))
const logColumns = Object.keys(logRows[0]!)
const csvColumns = Object.keys(results[0]!) as (keyof ServerResp)[]

const logPath = resolve(`${logFile}.log`)
const csvPath = resolve(`${logFile}.csv`)
fs.writeFileSync(logPath, tableToString(logRows, logColumns), 'utf-8')
fs.writeFileSync(csvPath, `\uFEFF${toCsv(results, csvColumns)}`, 'utf-8')
log.success(`日志: ${logPath}`)
log.success(`CSV : ${csvPath}`)

if (values.json) {
	const jsonPath = resolve(`${logFile}.json`)
	fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), 'utf-8')
	log.success(`JSON: ${jsonPath}`)
}

const newFailures = results
	.filter(r => isFailed(r) && !r.knownError)
	.map(r => `${r.name} (${r.url}): ${r.error || `HTTP ${r.code}`}`)
const recovered = results
	.filter(r => !isFailed(r) && Boolean(r.knownError))
	.map(r => `${r.name} (${r.url}): HTTP ${r.code}，原备注「${r.knownError}」`)
const knownFailedCount = results.filter(r => isFailed(r) && Boolean(r.knownError)).length
const redirected = results
	.filter(r => !isFailed(r) && normalizeUrl(r.url) !== normalizeUrl(r.finalUrl))
	.map(r => `${r.name}: ${r.url} -> ${r.finalUrl}`)
const expiringCerts = results
	.filter(r => r.certDaysLeft !== null && r.certDaysLeft <= 30)
	.map(r => `${r.name} (${r.url}): 剩余 ${r.certDaysLeft} 天 (${r.certExpires.slice(0, 10)})`)
const archChanged = results
	.filter(r => r.archMismatch)
	.map(r => `${r.name}: 标注 [${r.archs.join(', ')}] vs 推断 [${r.inferredArchs.join(', ')}]`)
const feedFailures = checkFeed
	? results.filter(r => Boolean(r.feedError)).map(r => `${r.name}: ${r.feedError}`)
	: []
const suspiciousPages = inspectHtml
	? results.filter(r => isSuspiciousTitle(r.title)).map(r => `${r.name} (${r.url}): "${r.title}"`)
	: []

printSection('新增异常', newFailures, 'warn')
printSection('已恢复', recovered, 'success')
if (knownFailedCount)
	log.info(`已知异常: ${knownFailedCount} 个`)
printSection('域名/路径跳转变更', redirected, 'info')
printSection('证书 30 天内到期或已过期', expiringCerts, 'warn')
printSection('架构可能变更', archChanged, 'info')
printSection('订阅源异常', feedFailures, 'warn')
printSection('疑似拦截/占位页', suspiciousPages, 'warn')

const failed = results.filter(isFailed).length
outro(`${completed} 个友链检测完成，${failed} 个请求失败或返回错误状态`)
if (values.strict && failed)
	process.exitCode = 1
