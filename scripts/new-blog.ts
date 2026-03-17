#!/usr/bin/env node

import { exec } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import fs from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { intro, log, outro, select, spinner, text } from '@clack/prompts'
import { Temporal } from 'temporal-polyfill'
import blogConfig from '../blog.config.ts'

function normalize(val: string | symbol | undefined): string | undefined {
	return typeof val === 'symbol' ? undefined : val?.trim()
}

// #region 读参
let fileName: string | undefined = process.argv[2]
const usePermalink = blogConfig.article.useRandomPremalink
const now = Temporal.Now.plainDateTimeISO()
const dateStr = now.toLocaleString('sv')

const dir = join('content', 'posts', now.year.toString())

if (!fs.existsSync(dir))
	fs.mkdirSync(dir, { recursive: true })

intro(usePermalink ? '📝 使用中文名 + 随机 URL 新建文章' : '📝 使用指定文件名 + 年份 URL 新建文章')
// #endregion

// #region 传入文件名
if (fileName)
	log.info(`文件名: ${join(dir, fileName)}.md`)

const permalink = usePermalink
	? `/posts/${randomBytes(4).toString('hex').slice(1)}`
	: undefined

// #region url为名
do {
	if (fileName || usePermalink)
		break

	fileName = normalize(await text({
		message: `请输入文件名（将创建在 ${dir} 下）`,
		placeholder: `monthly-${now.month}`,
		validate: val => val?.trim() === '' ? '文件名不能为空' : undefined,
	}))
	if (!fileName)
		process.exit(0)

	if (fs.existsSync(join(dir, `${fileName}.md`))) {
		log.error('❌ 文件已存在')
		fileName = undefined
	}
} while (!fileName)
// #endregion

// #region 标题为名
let title = fileName

do {
	if (title)
		break

	title = normalize(await text({
		message: '请输入博客标题',
		placeholder: `${now.month}月生活`,
		validate: val => val?.trim() === '' ? '标题不能为空' : undefined,
	}))
	if (!title)
		process.exit(0)

	if (usePermalink) {
		if (fs.existsSync(join(dir, `${title}.md`))) {
			log.error('❌ 文件已存在')
			title = undefined
		}
	}
} while (!title)
// #endregion

// #region 生成路径
const mdPath = join(dir, `${usePermalink ? title : fileName}.md`)
if (!process.argv[2])
	log.info(`文件名: ${mdPath}`)

if (fs.existsSync(mdPath)) {
	log.error('❌ 文件已存在')
	process.exit(1)
}

// #region 分类
let category = normalize(await select({
	message: '请选择分类',
	options: [
		...Object.keys(blogConfig.article.categories).map(c => ({ value: c })),
		{ value: '自定义' },
	],
}))
if (!category)
	process.exit(0)
// #endregion

// #region 自定义分类
if (category === '自定义') {
	const customCategory = normalize(await text({
		message: '请输入自定义分类',
		validate: val => val?.trim() === '' ? '分类不能为空' : undefined,
	}))
	if (!customCategory)
		process.exit(0)
	category = customCategory
}
// #endregion

// #region 标签
const tagsInput = normalize(await text({
	message: '请输入标签（多个用中英文逗号或空格分隔）',
	placeholder: 'Vue, Vite, TypeScript',
}))
const tags = tagsInput?.split(/[\s,，]+/).map(t => t.trim()).filter(Boolean)
// #endregion

// #region 样式类型
let type = normalize(await select({
	message: '选择文章版式',
	options: [
		{ value: 'tech', label: '技术 (tech)' },
		{ value: 'story', label: '故事 (story)' },
		{ value: 'custom', label: '自定义' },
	],
	initialValue: 'tech',
}))
if (!type)
	process.exit(0)
if (type === 'custom') {
	const customType = normalize(await text({
		message: '请输入自定义类型',
		validate: val => val?.trim() === '' ? '类型不能为空' : undefined,
	}))
	if (!customType)
		process.exit(0)

	log.warn('⚠️ 新建分类后，建议在 blog.config.ts 中添加对应配置')
	type = customType
}
// #endregion

// #region frontmatter
const frontmatter = {
	title,
	description: `讲述关于${title}的故事，并根据${tags?.join('、')}给出${category}。`,
	date: dateStr,
	updated: dateStr,
	image: '# 封面图推荐 2:1，不含与标题重复的文字',
	permalink,
	type: type === 'tech' ? undefined : type,
	categories: category === blogConfig.defaultCategory ? undefined : `[${category}]`,
	tags: tags ? `[${tags.join(', ')}]` : undefined,
	// draft: 'true # 撰写完成后，请删除此行',
}
// #endregion

// #region 写文件
fs.writeFileSync(mdPath, `---\n${Object.entries(frontmatter)
	.filter(([, value]) => value !== undefined)
	.map(([key, value]) => `${key}: ${value}`)
	.join('\n')}
---

## 从${title}说起

`, 'utf8')

log.info(`✅ 已创建: ${resolve(mdPath)}`)
if (permalink)
	log.info(`🔗 文章链接: ${new URL(permalink, blogConfig.url)}`)

// #region 打开 VS Code
const s = spinner()
s.start('正在打开 VS Code...')
exec(`code "${mdPath}"`, (error) => {
	if (!error)
		return
	s.stop('⚠️ 无法打开 VS Code，请确认已通过命令面板注册 code 命令到 PATH')
	log.error(error.message)
	process.exit(1)
})
s.stop('⌨️ 已通过 VS Code 打开文件')
// #endregion

outro(`🎉 开始书写吧！`)
