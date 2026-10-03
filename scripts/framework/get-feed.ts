#!/usr/bin/env node

import { isIP } from 'node:net'
import process from 'node:process'
import { parseArgs } from 'node:util'
import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts'
import { mapValues } from 'es-toolkit/object'
import { displayName, entries, getLinkInfo } from './utils'

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: { json: { type: 'boolean' }, help: { type: 'boolean', short: 'h' } },
})
if (values.help) {
	console.log('用法: pnpm check:feed [URL / 域名 / 关键字] [--json]\n不传参数时交互选择；--json 输出检测结果，适合脚本调用。')
	process.exit(0)
}
if (positionals.length > 1) {
	console.error('只接受一个 URL、域名或关键字；带空格的关键字请加引号。')
	process.exit(1)
}
if (!values.json)
	intro('🔎 检测友链状态与托管线索')

let query = positionals[0]
if (query === undefined) {
	if (values.json || !process.stdin.isTTY) {
		console.error('请提供 URL、域名或关键字。')
		process.exit(1)
	}
	const answer = await text({
		message: '输入关键字、URL 或域名：',
		placeholder: '例如: nuxt / vercel / 站点名 / example.com',
	})
	if (isCancel(answer)) {
		cancel('已取消')
		process.exit(0)
	}
	query = answer
}
query = query.trim()

// 完整 URL 和域名直接检测，其余输入用于搜索友链。
const target = URL.parse(query.includes('://') ? query : `https://${query}`)
const hostname = target?.hostname.replace(/^\[|\]$/g, '') ?? ''
const isAddress = target && (query.includes('://') || hostname.includes('.') || hostname === 'localhost' || isIP(hostname))
const filtered = isAddress
	? [entries.find(e => e.link === target.href) ?? { link: target.href }]
	: entries.filter(e => Object.values(e).join('\n').toLowerCase().includes(query.toLowerCase()))

if (!filtered.length) {
	console.error('未找到匹配的友链。')
	process.exit(1)
}
let choice = filtered[0]!
if (filtered.length > 1) {
	if (values.json || !process.stdin.isTTY) {
		console.error(`匹配到 ${filtered.length} 个友链，请提供更精确的关键字或完整 URL。`)
		process.exit(1)
	}
	const selected = await select({
		message: '选择一个：',
		options: filtered.map((e, index) => ({ value: index, label: displayName(e), hint: e.link })),
	})
	if (isCancel(selected)) {
		cancel('已取消')
		process.exit(0)
	}
	choice = filtered[selected]!
}

const info = await getLinkInfo(choice)
if (values.json) {
	console.log(JSON.stringify(info, null, 2))
}
else {
	console.table(mapValues(info, value => ({ 值: value })))
	outro('检测完成')
}
if (info.error || info.code >= 400)
	process.exitCode = 1
