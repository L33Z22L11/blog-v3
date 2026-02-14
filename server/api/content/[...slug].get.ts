import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
	const path = `.data/content/${getRouterParam(event, 'slug')}.json`
	const posts = existsSync(path)
		? await readFile(path, 'utf-8').then(data => JSON.parse(data))
		: ''

	return posts
})
