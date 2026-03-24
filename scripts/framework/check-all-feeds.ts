#!/usr/bin/env node

import fs from 'node:fs'
import { resolve } from 'node:path'
import { intro, log, outro, spinner } from '@clack/prompts'
import pLimit from 'p-limit'
import { Temporal } from 'temporal-polyfill'
import { entries, getLinkInfo, tableToString, toCsv } from './utils'

intro('🌐 批量检测友链 Server + 域名/IP 证书')

const limit = pLimit(50)

const s = spinner()
s.start(`已处理 0/${entries.length} 个友链...`)

let completed = 0
const results = await Promise.all(entries.map(e => limit(async () => {
	const longTask = setTimeout(() => log.warn(`检测 ${e.link} 可能需要较长时间...`), 10000)
	const result = await getLinkInfo(e)
	clearTimeout(longTask)
	s.message(`已处理 ${completed++}/${entries.length} 个友链...`)
	return result
})))

s.stop('✅ 检测完成，开始生成日志')

fs.mkdirSync(resolve('logs'), { recursive: true })
const logFile = `logs/feeds-check-${Temporal.Now.plainDateTimeISO().toLocaleString('sv').replaceAll(/\W/g, '-')}`

const tableStr = tableToString(results, Object.keys(results[0]!))
const csvStr = toCsv(results, Object.keys(results[0]!))
const logPath = resolve(`${logFile}.log`)
const csvPath = resolve(`${logFile}.csv`)

fs.writeFileSync(logPath, tableStr, 'utf-8')
fs.writeFileSync(csvPath, `\uFEFF${csvStr}`, 'utf-8')

log.success(`📋 日志: ${logPath}`)
log.success(`📋 CSV : ${csvPath}`)

outro(`✅ ${completed} 个友链检测完成`)
