import { readFile } from 'node:fs/promises'
import { createKerria, useLoad, useSource } from 'kerria'
import { relative, resolve } from 'pathe'
import blogConfig from '../../../blog.config'
import { parseArticle } from './remark'

export const article = createKerria('article', () => {
	const meta = useLoad('meta', {
		dist: '.data/article.json',
	})

	useSource(0, {
		base: 'content',
		dist: '.data/content',
		ext: '.md',

		async parse(path, info) {
			const file = await readFile(path)
			const text = file.toString()
			const { body, frontmatter, slots } = await parseArticle(text)

			await info.output(path, { body, frontmatter, slots })

			function transformSlug(path: string) {
				path = relative(resolve('content'), path).slice(0, -'.md'.length)
				if (blogConfig.article.hidePostPrefix)
					path = path.replace(/^posts\//, '')
				return path
			}

			return {
				slug: transformSlug(path),
				path,
				frontmatter,
			}
		},

		cache(cache) {
			const { frontmatter, path } = cache
			meta.value.content ??= {}
			meta.value.content[path] = { frontmatter }
		},

		unlink(cache) {
			const { path } = cache
			delete meta.value.content[path]
		},
	})
})
