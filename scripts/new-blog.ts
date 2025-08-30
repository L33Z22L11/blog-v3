import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { customAlphabet } from 'nanoid'
import blogConfig from '../blog.config.ts'

// 获取当前路径和参数
const args = process.argv.slice(2)
const blogTitle = args[0]

if (!blogTitle) {
	console.error('请提供博客标题，如：pnpm new blog-title')
	process.exit(1)
}

// 获取当前年份
const now = new Date()
const year = now.getFullYear()
const directory = path.join(process.cwd(), 'content', 'posts', year.toString())

// 确保目录存在
if (!fs.existsSync(directory)) {
	fs.mkdirSync(directory, { recursive: true })
}

const filePath = path.join(directory, `${blogTitle}.md`)

if (fs.existsSync(filePath)) {
	console.error('文件已存在')
	process.exit(1)
}

let permalink: string | undefined
if (blogConfig.content.randomPathAtNew) {
	const hash = customAlphabet('0123456789abcdef', 7)()
	permalink = `/posts/${hash}`
}

const frontmatter = {
	title: blogTitle,
	description: blogTitle,
	date: `${now.toLocaleDateString('en-CA')} ${now.toLocaleTimeString()}`,
	updated: `${now.toLocaleDateString('en-CA')} ${now.toLocaleTimeString()}`,
	image: '# 图片',
	permalink,
	type: '# story',
	categories: '[分类]',
	tags: '[标签1, 标签2]',
}

// 创建 Markdown 文件
fs.writeFileSync(filePath, `---\n${Object.entries(frontmatter)
	.filter(([, value]) => value !== undefined)
	.map(([key, value]) => `${key}: ${value}`)
	.join('\n')}
---

## ${blogTitle}的第一个小标题

`, 'utf8')

// 使用 VS Code 打开文件
exec(`code "${filePath}"`, (error) => {
	if (error) {
		console.error(`无法打开文件: ${error.message}`)
	}
	else {
		console.log(`已创建并打开 ${filePath}`)
	}
})
