#!/usr/bin/env node

import fs from 'node:fs'
import process from 'node:process'
import { intro, log, outro, spinner, text } from '@clack/prompts'

intro('初始化博客：删除原有文章、配置')

const confirm = await text({
	message: '此操作会导致所有文章、配置文件丢失！输入“confirm”确认',
})

if (confirm !== 'confirm') {
	log.error('已取消')
	process.exit(1)
}

const s = spinner()
s.start('正在处理文章、配置文件...')

// 清空 content 目录并新建示例文章
const PATH_LINK_MD = './content/link.md'
const PATH_NEW_MD = `./content/posts/${new Date().getFullYear()}`
const linkMdContent = fs.readFileSync(PATH_LINK_MD, 'utf8')
const exampleMdContent = fs.readFileSync('./content/previews/example.md', 'utf8')
fs.rmSync('./content', { recursive: true, force: true })
fs.mkdirSync(PATH_NEW_MD, { recursive: true })
fs.writeFileSync(PATH_LINK_MD, linkMdContent)
fs.writeFileSync(`${PATH_NEW_MD}/example.md`, exampleMdContent)

// 处理 app.config.ts
const PATH_APP_CONFIG = './app/app.config.ts'
const appConfigContent = fs.readFileSync(PATH_APP_CONFIG, 'utf8')
	.replace(/'.*?avatar.com.*?'/, 'blogConfig.author.avatar')
	.replaceAll('L33Z22L11\'', 'octocat\'')
	.replace('\'/theme\'', `'https://blog.zhilu.site/theme'`)
	.replace(/'.?ICP备.*?'/, '\'备案\'')
fs.writeFileSync(PATH_APP_CONFIG, appConfigContent)

// 处理 blog.config.ts
const PATH_BLOG_CONFIG = './blog.config.ts'
const blogConfigContent = fs.readFileSync(PATH_BLOG_CONFIG, 'utf8')
	.replace(/'[^']*纸鹿[^']*'/g, '\'博客\'')
	.replace(/'[^']*zhilu[^']*'/g, match => match.replace(/zhilu/, 'example'))
fs.writeFileSync(PATH_BLOG_CONFIG, blogConfigContent)

// 处理 redirects.json
fs.writeFileSync('./redirects.json', `{
	"/theme": "https://blog.zhilu.site/theme",
}`)

s.stop('初始化完成')

outro('请参照 README.md 完成后续配置')
