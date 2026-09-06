#!/usr/bin/env node

import fs from 'node:fs'
import process from 'node:process'
import { intro, log, outro, spinner, text } from '@clack/prompts'
import { Temporal } from 'temporal-polyfill'

intro('初始化博客：删除原有文章、配置')

const args = process.argv.slice(2).filter(arg => arg !== '--')
if (args.some(arg => arg !== '--yes')) {
	log.error('未知参数。用法：pnpm init-project [--yes]')
	process.exit(1)
}
if (!args.includes('--yes')) {
	if (!process.stdin.isTTY) {
		log.error('非交互环境请使用 pnpm init-project --yes；此操作会删除所有文章并重置配置，请先备份。')
		process.exit(1)
	}
	const confirm = await text({
		message: '此操作会导致所有文章、配置文件丢失！输入“confirm”确认',
	})
	if (confirm !== 'confirm') {
		log.error('已取消')
		process.exit(1)
	}
}

const placeholderAvatar = 'https://weavatar.com/avatar/?d=initials&name=博主'
const today = Temporal.Now.plainDateISO()
const postDir = `./content/posts/${today.year}`
const examplePath = './content/previews/example.md'
if (!fs.existsSync(examplePath)) {
	log.error('示例文章不存在，请在未初始化的模板副本中运行；未修改任何文件。')
	process.exit(1)
}

// 在删除文章前读取并准备全部配置，避免源文件缺失时只完成一半初始化。
const exampleContent = fs.readFileSync(examplePath, 'utf8')
const appConfigContent = fs.readFileSync('./app/app.config.ts', 'utf8')
	.replace(/logo: '[^']*'/, 'logo: blogConfig.author.avatar')
	.replaceAll('\'/theme\'', '\'https://blog.zhilu.site/theme\'')
	.replace(/^.*\{ icon:.*(?:jq\.qq\.com|travellings\.cn|github\.com\/(?:L33Z22L11|octocat)'|beian\.miit\.gov\.cn).*\n/gm, '')
	.replace(/birthYear: \d+/, 'birthYear: 0')
	.replace(/wordCount: '[^']*'/, 'wordCount: \'\'')
	.replace(/emojiTail: \[[^\]]*\]/, 'emojiTail: [\'📝\', \'✨\', \'🌱\']')

const blogConfigContent = fs.readFileSync('./blog.config.ts', 'utf8')
	.replace(/title: '[^']*'/, 'title: \'我的博客\'')
	.replace(/subtitle: '[^']*'/, 'subtitle: \'记录技术与生活\'')
	.replace(/description: '[^']*'/, 'description: \'分享学习笔记、技术实践与日常生活。\'')
	.replace(/name: '[^']*'/, 'name: \'博主\'')
	.replace(/avatar: '[^']*'/, `avatar: '${placeholderAvatar}'`)
	.replace(/email: '[^']*'/, 'email: \'\'')
	.replace(/homepage: '[^']*'/, 'homepage: \'/\'')
	.replace(/favicon: '[^']*'/, `favicon: '${placeholderAvatar}'`)
	.replace(/timeEstablished: '[^']*'/, `timeEstablished: '${today}'`)
	.replace(/\n\turl: '[^']*'/, '\n\turl: \'http://localhost:3000/\'')
	.replace(/\n\tscripts: \[[\s\S]*?\n\t\],/, '\n\tscripts: [],')
	.replace(/envId: '[^']*'/, 'envId: \'\'')
	.replace(/preload: '[^']*'/, 'preload: \'\'')
	.replace(/sitenick: '[^']*'/, 'sitenick: blogConfig.title')
	.replace(/archs: \[[^\]]*\]/, 'archs: [\'Nuxt\']')

const s = spinner()
s.start('正在处理文章、配置文件...')
fs.rmSync('./content', { recursive: true, force: true })
fs.mkdirSync(postDir, { recursive: true })
fs.writeFileSync(`${postDir}/example.md`, exampleContent)
fs.writeFileSync('./content/link.md', `---
date: ${today}
---

<!-- 请在上线前填写自己的联系方式或启用评论区。 -->

- 欢迎交换友链：持续维护，分享原创内容。
- 请提供博客名称、地址、简介和头像。
- 申请方式：待博主补充。
`)
fs.writeFileSync('./app/feeds.ts', `import type { FeedGroup } from './types/feed'

export default [{
	name: '清晰体验',
	desc: '使用 Clarity 博客主题构建的网站。',
	entries: [{
		author: '纸鹿本鹿',
		sitenick: '摸鱼处',
		title: '纸鹿摸鱼处',
		desc: '纸鹿至麓不知路，支炉制露不止漉',
		link: 'https://blog.zhilu.site/',
		feed: 'https://blog.zhilu.site/atom.xml',
		icon: 'https://www.zhilu.site/api/icon.png',
		avatar: 'https://www.zhilu.site/api/avatar.png',
		archs: ['Nuxt', 'Vercel'],
		date: '2019-07-19',
		comment: 'Clarity 主题作者',
	}],
}] satisfies FeedGroup[]
`)
fs.writeFileSync('./app/app.config.ts', appConfigContent)
fs.writeFileSync('./blog.config.ts', blogConfigContent)
fs.writeFileSync('./redirects.json', `${JSON.stringify({ '/theme': 'https://blog.zhilu.site/theme' }, null, 2)}\n`)
s.stop('初始化完成')

log.info(`上线前请修改以下配置：
- blog.config.ts：title / subtitle / description、author（当前名称：博主，邮箱为空，主页为 /）
- blog.config.ts：url（当前 http://localhost:3000/），请改为实际访问地址
- blog.config.ts：author.avatar / favicon（当前 ${placeholderAvatar}），请换成自己的图片
- blog.config.ts：timeEstablished（当前 ${today}）、scripts / twikoo（当前未启用）
- app/app.config.ts：footer 导航、header.emojiTail、component.stats（birthYear 为 0，年龄已隐藏）
- content/link.md：申请方式；app/feeds.ts：友链列表（当前仅保留纸鹿摸鱼处）`)
outro('请参照 README.md 完成后续配置')
