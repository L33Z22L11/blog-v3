import type { ArticleCollection } from 'postme'
import { readFile } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
	const collection = getQuery(event).collection as string
	const collections = await readFile('.data/collections.json', 'utf-8').then(JSON.parse) as ArticleCollection

	return Object.values(collections[collection]!)
})
