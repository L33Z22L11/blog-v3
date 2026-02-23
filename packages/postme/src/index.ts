import { readFile } from 'node:fs/promises'
import { createKerria, useLoad, useSource } from 'kerria'
import { relative, resolve } from 'pathe'
import blogConfig from '../../../blog.config'
import { parseArticle } from './remark'

export * from './types'

export const article = createKerria('article', () => {
	const collections = useLoad('collections', {
		dist: '.data/collections.json',
	})

	const slugs = useLoad('slugs', {
		dist: '.data/slugs.json',
	})

	useSource(0, {
		base: 'content',
		dist: '.data/content',
		ext: '.md',

		async parse(path, info) {
			const file = await readFile(path)
			const text = file.toString()
			const { result, data } = await parseArticle(text)

			const unstrippedSlug = relative(resolve('content'), path).replace(/.md$/, '')
			const collection = unstrippedSlug.split('/')[0]

			const slug = blogConfig.article.hidePostPrefix && unstrippedSlug.startsWith('posts/')
				? unstrippedSlug.slice('posts/'.length)
				: unstrippedSlug

			const frontmatter = {
				...data.frontmatter,
				readingTime: data.readingTime,
				slug,
			}

			await info.output(path, {
				body: result,
				frontmatter,
				slots: data.slots,
			})

			return {
				collection,
				slug,
				path: `.data/content/${unstrippedSlug}.json`,
				frontmatter,
			}
		},

		cache(cache) {
			const { frontmatter, collection, slug, path } = cache
			collections.value[collection] ??= {}
			collections.value[collection][slug] = frontmatter
			slugs.value[slug] = { collection, path, frontmatter }
		},

		unlink(cache) {
			const { collection, slug } = cache
			delete collections.value[collection][slug]
			delete slugs.value[slug]
		},
	})
})
