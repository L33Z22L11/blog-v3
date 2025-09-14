#!/usr/bin/env node

import type { FeedEntry } from '../../app/types/feed'
import process from 'node:process'
import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts'
import { entries, getLinkInfo } from './utils'

function displayName(e: FeedEntry): string {
	return (e.title || e.sitenick || e.author || '(无标题)').trim()
}

function matches(q: string, e: FeedEntry): boolean {
	const hay = Object.values(e).join('\n').toLowerCase()
	return hay.includes(q.toLowerCase())
}

intro('🔎 获取友链的托管服务')

const query = await text({
	message: '输入关键字或任意链接：',
	placeholder: '例如: nuxt / vercel / 站点名 / 域名片段 / 任意完整域名',
	initialValue: process.argv[2],
})
if (isCancel(query)) {
	cancel('已取消')
	process.exit(0)
}

const filtered = query?.trim()
	? entries.filter(e => matches(String(query), e))
	: entries

if (query?.startsWith('http')) {
	filtered.push({
		author: query,
		link: query,
		icon: query,
		avatar: query,
		date: new Date().toLocaleString('en-CA'),
	})
}

if (!filtered.length) {
	cancel('未找到匹配的友链。')
	process.exit(0)
}

const selected = await select({
	message: `选择一个：`,
	options: filtered.map((e, idx) => ({
		value: String(idx),
		label: displayName(e),
		hint: e.link,
	})),
})
if (isCancel(selected)) {
	cancel('已取消')
	process.exit(0)
}

const choice = filtered[Number(selected)]

const info = await getLinkInfo(choice)

console.table(Object.fromEntries(Object.entries(info).map(([k, v]) => [k, { '(value)': v }])))

outro('完成 ✅')
