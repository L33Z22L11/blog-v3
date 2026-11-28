import type { ReadTimeResults } from 'reading-time'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { env } from 'node:process'
import { defineCollection } from '@nuxt/content'
import { defineSitemapSchema } from '@nuxtjs/sitemap/content'
import { parseFrontMatter } from 'remark-mdc'
import { z } from 'zod'
import blogConfig from './blog.config'

type ArticleType = keyof typeof blogConfig.article.types
// 文章类型已在 blog.config 中定义，此处使用 any 类型绕过 zod 类型验证
const articleTypes = Object.keys(blogConfig.article.types) as any

export interface ArticleSchema {
	title?: string
	description?: string
	date?: string
	updated?: string
	published?: string
	categories?: string[]
	tags?: string[]
	type?: ArticleType

	image?: string
	recommend?: number
	references?: { title?: string, link?: string }[]
	/** 草稿默认不进入生产构建。 */
	draft?: boolean
	permalink?: string

	readingTime?: ReadTimeResults
}

const articleSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	date: z.string().optional(),
	updated: z.string().optional(),
	published: z.string().optional(),
	categories: z.array(z.string()).default([blogConfig.defaultCategory]),
	tags: z.array(z.string()).default([]),
	type: z.enum(articleTypes).optional().default(articleTypes[0]),

	image: z.string().optional(),
	recommend: z.number().optional(),
	references: z.array(z.object({
		title: z.string().optional(),
		link: z.string().optional(),
	})).optional(),
	draft: z.boolean().default(false),
	permalink: z.string().optional(),

	readingTime: z.object({
		text: z.string(),
		minutes: z.number(),
		time: z.number(),
		words: z.number(),
	}),
}) satisfies z.ZodType<ArticleSchema>

const contentDir = resolve(import.meta.dirname, 'content')
const excludeDrafts: string[] = []
if (env.NODE_ENV === 'production' && !env.NUXT_INCLUDE_DRAFTS) {
	for (const entry of readdirSync(contentDir, { recursive: true, withFileTypes: true })) {
		if (!entry.isFile() || !entry.name.endsWith('.md'))
			continue
		const fullPath = join(entry.parentPath, entry.name)
		const { data } = parseFrontMatter(readFileSync(fullPath, 'utf8').replace(/^\uFEFF/, ''))
		// exclude 接受 glob 模式，转义文件名中的通配符。
		if (data.draft === true)
			excludeDrafts.push(relative(contentDir, fullPath).replaceAll('\\', '/').replace(/[()[\]{}*?|]|^!|[!+@](?=\()/g, '\\$&'))
	}
}

export const collections = {
	content: defineCollection({
		source: { include: '**', exclude: excludeDrafts },
		type: 'page',
		schema: articleSchema.extend({
			sitemap: defineSitemapSchema({
				name: 'content',
				onUrl: (url, entry) => {
					const lastmod = (entry.updated || entry.published || entry.date) as string | undefined
					if (lastmod)
						url.lastmod = new Date(lastmod).toLocaleDateString('sv')
				},
				z,
			}),
		}),
	}),
}
