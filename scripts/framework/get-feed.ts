#!/usr/bin/env node

import process from 'node:process'
import { parseArgs } from 'node:util'
import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts'
import { displayName, entries, getLinkInfo, resolveFeedQuery } from './utils'

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		json: { type: 'boolean' },
		fast: { type: 'boolean' },
		help: { type: 'boolean', short: 'h' },
	},
})
if (values.help) {
	console.log('用法: pnpm check:feed [URL / 域名 / 关键字] [--fast] [--json]\n不传参数时交互选择；默认探测 HTML 标题/生成器与订阅源，--fast 仅做轻量探测，--json 输出完整结果。')
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

const { matches: filtered } = resolveFeedQuery(query, entries)

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

const info = await getLinkInfo(choice, {
	inspectHtml: !values.fast,
	checkFeed: !values.fast,
})
if (values.json) {
	console.log(JSON.stringify(info, null, 2))
}
else {
	const optionalEmptyKeys = new Set([
		'title',
		'generator',
		'ipCertError',
		'feedContentType',
		'feedError',
		'knownError',
		'error',
	])
	const optionalEmptyArrayKeys = new Set(['redirects', 'cname', 'ipCertDomains'])
	const rows: Record<string, { 值: string | number | boolean }> = {}

	for (const [key, value] of Object.entries(info)) {
		if (key === 'feedCode' && value === null && !choice.feed)
			continue
		if ((key === 'feedContentType' || key === 'feedError') && !choice.feed && !value)
			continue
		if (optionalEmptyKeys.has(key) && !value)
			continue
		if (Array.isArray(value)) {
			if (!value.length && optionalEmptyArrayKeys.has(key))
				continue
			rows[key] = { 值: value.join(', ') }
			continue
		}
		if (value && typeof value === 'object') {
			const formatted = Object.entries(value as Record<string, string>)
				.map(([k, v]) => `${k}: ${v}`)
				.join(' | ')
			if (formatted)
				rows[key] = { 值: formatted }
			continue
		}
		rows[key] = { 值: value ?? '' }
	}

	console.table(rows)
	outro('检测完成')
}
if (info.error || info.code >= 400)
	process.exitCode = 1
