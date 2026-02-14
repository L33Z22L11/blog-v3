import { readFile } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
	const collection = getQuery(event).collection ?? 'posts'
	const posts = await readFile('.data/article.json', 'utf-8')
		.then(data => JSON.parse(data))

	return posts
})
