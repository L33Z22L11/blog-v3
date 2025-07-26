import { exec } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

// 获取当前路径和参数
const args = process.argv.slice(2)
const blogTitle = args[0]

if (!blogTitle) {
	console.error('请提供博客标题，如：pnpm new blog-title')
	process.exit(1)
}

// 获取当前年份
const year = new Date().getFullYear()
const directory = path.join(process.cwd(), 'content', 'posts', year.toString())

// 确保目录存在
if (!fs.existsSync(directory)) {
	fs.mkdirSync(directory, { recursive: true })
}

// 创建 Markdown 文件
const filePath = path.join(directory, `${blogTitle}.md`)
fs.writeFileSync(filePath, `---
title: ${blogTitle}
description: ${blogTitle}
date: ${new Date().toLocaleDateString('en-CA')} ${new Date().toLocaleTimeString()}
updated: ${new Date().toLocaleDateString('en-CA')} ${new Date().toLocaleTimeString()}
# image:
# type: story
categories: [分类]
tags: [标签1, 标签2]
---
\n\n`, 'utf8')

// 使用 VS Code 打开文件
exec(`code "${filePath}"`, (error) => {
	if (error) {
		console.error(`无法打开文件: ${error.message}`)
	}
	else {
		console.log(`已创建并打开 ${filePath}`)
	}
})
