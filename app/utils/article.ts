/** 查询列表需要的轻量文章字段；useAsyncData 的缓存键由页面持有。 */
export function queryArticleIndex(path = 'posts/%') {
	return queryCollection('content')
		.where('stem', 'LIKE', path)
		.select('categories', 'date', 'description', 'image', 'path', 'readingTime', 'recommend', 'tags', 'title', 'type', 'updated')
		.all()
}

interface GetPostTypeClassNameOptions {
	prefix?: string
}

export function getPostTypeClassName(type = 'tech', options?: GetPostTypeClassNameOptions) {
	const { prefix = 'text' } = options || {}
	return `${prefix}-${type}`
}

/** 在组件 setup/render 上下文中读取当前应用配置。 */
export function getCategoryIcon(category?: string) {
	return useAppConfig().article.categories[category ?? '']?.icon ?? 'tabler:folder'
}

export function getCategoryColor(category?: string) {
	return useAppConfig().article.categories[category ?? '']?.color
}
