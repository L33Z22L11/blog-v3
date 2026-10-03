#!/usr/bin/env node

import type { ServerResp } from './utils'
import fs from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { intro, log, outro, spinner } from '@clack/prompts'
import pLimit from 'p-limit'
import { Temporal } from 'temporal-polyfill'
import { entries, getLinkInfo, tableToString, toCsv } from './utils'

const { values } = parseArgs({
	options: {
		concurrency: { type: 'string', default: '20' },
		help: { type: 'boolean', short: 'h' },
	},
})
if (values.help) {
	console.log('用法: pnpm check:feed/all [--concurrency 20]\n检测全部友链，将表格和 CSV 保存到 logs 目录。')
	process.exit(0)
}
const concurrency = Number(values.concurrency)
if (!Number.isInteger(concurrency) || concurrency < 1) {
	console.error('--concurrency 必须为正整数。')
	process.exit(1)
}

intro('🌐 批量检测友链状态与证书')
if (!entries.length) {
	outro('没有需要检测的友链')
	process.exit(0)
}
const s = spinner()
s.start(`已处理 0/${entries.length} 个友链...`)

let completed = 0
const results = await pLimit(concurrency).map(entries, async (entry) => {
	const result = await getLinkInfo(entry)
	s.message(`已处理 ${++completed}/${entries.length} 个友链...`)
	return result
})
s.stop('检测完成，开始生成报告')

fs.mkdirSync(resolve('logs'), { recursive: true })
const logFile = `logs/feeds-check-${Temporal.Now.plainDateTimeISO().toLocaleString('sv').replaceAll(/\W/g, '-')}`
const columns = Object.keys(results[0]!) as (keyof ServerResp)[]
const logPath = resolve(`${logFile}.log`)
const csvPath = resolve(`${logFile}.csv`)
fs.writeFileSync(logPath, tableToString(results, columns), 'utf-8')
fs.writeFileSync(csvPath, `\uFEFF${toCsv(results, columns)}`, 'utf-8')
log.success(`日志: ${logPath}`)
log.success(`CSV : ${csvPath}`)

const failed = results.filter(result => result.error || result.code >= 400).length
outro(`${completed} 个友链检测完成，${failed} 个请求失败或返回错误状态`)
if (failed)
	process.exitCode = 1
