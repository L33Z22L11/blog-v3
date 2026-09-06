import blogConfig from '~~/blog.config'

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

	const existedPaths = new Set<string>()

	const query = queryCollection(event, 'content')
	if (blogConfig.stats.includePaths.length) {
		query.orWhere(group => blogConfig.stats.includePaths.reduce(
			(group, path) => group.where('stem', 'LIKE', path),
			group,
		))
	}
	const posts = await query.all()

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
		// 重复路径检测
		if (existedPaths.has(post.path))
			console.warn('文章存在重复路径', post.path)
		existedPaths.add(post.path)

		// 文章/总字数计数
		stats.total.posts++
		stats.total.words += post.readingTime.words

		// 年文章/年字数计数
		try {
			const year = toZonedTemporal(post.date || '').year
			if (!stats.annual[year]) {
				stats.annual[year] = { posts: 0, words: 0 }
			}

			stats.annual[year].posts++
			stats.annual[year].words += post.readingTime.words
		}
		catch (e) {
			console.warn(post.date
				? `${post.path} 文章日期 ${post.date} 格式错误: "${e}"`
				: `${post.path} 文章日期为空`)
		}

		// 分类文章计数
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

		// 标签统计
		const tags = post.tags || []
		tags.filter((tag: any): tag is string => typeof tag === 'string')
			.forEach((tag: string) => {
				if (!stats.tags.includes(tag))
					stats.tags.push(tag)
			})
	}

	return stats
})
