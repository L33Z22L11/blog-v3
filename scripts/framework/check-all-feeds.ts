#!/usr/bin/env node

import { log } from 'node:console'

import fs from 'node:fs'
import path from 'node:path'
import { intro, outro, spinner } from '@clack/prompts'
import pLimit from 'p-limit'
import { entries, getLinkInfo, tableToString, toCsv } from './utils'

intro('🌐 批量检测友链 Server + 域名/IP 证书')

const limit = pLimit(20)

const s = spinner()
s.start(`正在处理 0/${entries.length} 个友链...`)

let completed = 0
const results = await Promise.all(entries.map(e => limit(async () => {
	const r = await getLinkInfo(e)
	completed++

	s.message(`正在处理 ${completed}/${entries.length} 个友链...`)
	return r
})))

s.stop('✅ 检测完成，开始生成日志')

fs.mkdirSync(path.resolve('logs'), { recursive: true })
const logFile = `logs/feeds-check-${new Date().getTime()}`

const tableStr = tableToString(results, Object.keys(results[0]))
const csvStr = toCsv(results, Object.keys(results[0]))
const logPath = path.resolve(`${logFile}.log`)
const csvPath = path.resolve(`${logFile}.csv`)

fs.writeFileSync(logPath, tableStr, 'utf-8')
fs.writeFileSync(csvPath, `\uFEFF${csvStr}`, 'utf-8')

log(`📋 日志: ${logPath}`)
log(`📋 CSV : ${csvPath}`)

outro(`✅ ${completed} 个友链检测完成`)
