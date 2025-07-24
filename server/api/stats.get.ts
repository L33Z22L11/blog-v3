interface StatsEntry {
	posts: number
	words: number
}

interface CategoryEntry {
	name: string
	posts: number
	children?: CategoryEntry[]
}

export default defineEventHandler(async (event) => {
	const stats = {
		total: { posts: 0, words: 0 },
		annual: <Record<number, StatsEntry>>{},
		categories: <CategoryEntry[]>[],
		tags: <string[]>[],
	}

	const posts = await queryCollection(event, 'content').all()

	const findOrCreateCategory = (
		name: string,
		tree: CategoryEntry[],
	): CategoryEntry => {
		let category = tree.find(entry => entry.name === name)
		if (!category) {
			category = { name, posts: 0 }
			tree.push(category)
		}
		return category
	}

	for (const post of posts) {
		stats.total.posts++
		stats.total.words += post.readingTime?.words || 0

		if (!post.date)
			continue

		const year = new Date(post.date).getFullYear()
		if (!stats.annual[year]) {
			stats.annual[year] = { posts: 0, words: 0 }
		}

		stats.annual[year].posts++
		stats.annual[year].words += post.readingTime?.words

		const categories = post.categories || []
		let currentLevel = stats.categories

		for (const [index, categoryName] of categories.entries()) {
			if (typeof categoryName !== 'string')
				continue

			const category = findOrCreateCategory(categoryName, currentLevel)
			category.posts++

			if (index < categories.length - 1) {
				if (!category.children)
					category.children = []
				currentLevel = category.children
			}
		}

		const tags = post.tags || []
		tags.filter((tag: any): tag is string => typeof tag === 'string')
			.forEach((tag: string) => {
				if (!stats.tags.includes(tag))
					stats.tags.push(tag)
			})
	}

	return stats
})
