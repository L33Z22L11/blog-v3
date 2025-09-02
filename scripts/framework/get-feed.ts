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

const q = await text({
	message: '输入关键字（回车查看全部）：',
	placeholder: '例如: vue / react / 某个作者名 / 域名片段',
	initialValue: process.argv[2],
})
if (isCancel(q)) {
	cancel('已取消')
	process.exit(0)
}

const filtered = q?.trim()
	? entries.filter(e => matches(String(q), e))
	: entries.slice()

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
