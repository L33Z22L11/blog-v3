import type ArticleProps from '~/types/article'
import type { ArticleOrderType } from '~/types/article'
import { alphabetical } from 'radash'

// TODO 支持分页/分类筛选
export function useArticleIndex(path = 'posts/%') {
	return useAsyncData(
		// https://github.com/nuxt/nuxt/pull/33505
		// key 不能包含 %，否则会导致多处共用数据时随机产生空 payload
		`index_${path.replaceAll('%', '__percent__')}`,
		() => queryCollection('content')
			.where('stem', 'LIKE', path)
			.select('categories', 'date', 'description', 'image', 'path', 'readingTime', 'recommend', 'title', 'type', 'updated')
			.all(),
		{ default: () => [] }, // 不返回 undefined
	)
}

interface UseCategoryOptions {
	bindQuery?: string | false
}

export function useCategory(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseCategoryOptions) {
	const { bindQuery } = options ?? {}
	const category = bindQuery
		? useRouteQuery(bindQuery, undefined, { transform: (value?: string) => value, mode: 'push' })
		: ref<string | undefined>()
	const categories = computed(() => [...new Set(toValue(list).map(item => item.categories?.[0]))])
	const listCategorized = computed(
		() => toValue(list).filter(
			item => !category.value || item.categories?.[0] === category.value,
		),
	)

	return {
		category,
		categories,
		listCategorized,
	}
}

export function useArticleSort(list: MaybeRefOrGetter<ArticleProps[]>) {
	const appConfig = useAppConfig()
	const sortOrder = ref<ArticleOrderType>(appConfig.pagination.sortOrder || 'date')
	const isAscending = ref<boolean>()
	const listSorted = computed(() => alphabetical(
		toValue(list),
		item => item[sortOrder.value] || '',
		isAscending.value ? 'asc' : 'desc',
	))
	return {
		sortOrder,
		isAscending,
		listSorted,
	}
}

export function getCategoryIcon(category?: string) {
	const appConfig = useAppConfig()
	return appConfig.article.categories[category!]?.icon ?? 'ph:folder-bold'
}

export function getPostTypeClassName(type?: string, options = {
	prefix: 'text',
}) {
	if (!type)
		type = 'tech'

	const { prefix } = options

	return `${prefix}-${type}`
}
