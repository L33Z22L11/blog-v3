import type { Article, ArticleSlug } from 'postme'
import { readFile } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
	const slug = getRouterParam(event, 'slug') as string
	const slugs = await readFile('.data/slugs.json', 'utf-8').then(JSON.parse) as ArticleSlug

	const { path } = slugs[slug]!

	const article = await readFile(path, 'utf-8').then(JSON.parse).catch(() => {}) as Article
	return article
})
