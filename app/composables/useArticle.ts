import type { ArticleSchema } from 'postme'
import type { ArticleOrderType } from '~/types/article'
import { alphabetical } from 'radash'

interface UseCategoryOptions {
	bindQuery?: string
}

export function useCategory(list: MaybeRefOrGetter<ArticleSchema[]>, options?: UseCategoryOptions) {
	const { bindQuery } = options || {}

	const category = bindQuery
		? useRouteQuery(bindQuery, undefined)
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

interface UseArticleSortOptions {
	bindDirectionQuery?: string
	bindOrderQuery?: string
	initialAscend?: boolean
	initialOrder?: ArticleOrderType
}

export function useArticleSort(list: MaybeRefOrGetter<ArticleSchema[]>, options?: UseArticleSortOptions) {
	const appConfig = useAppConfig()
	const {
		bindDirectionQuery,
		bindOrderQuery,
		initialAscend = false,
		initialOrder = appConfig.pagination.sortOrder || 'date',
	} = options || {}

	const sortOrder = bindOrderQuery
		? useRouteQuery(bindOrderQuery, initialOrder)
		: ref<ArticleOrderType>(initialOrder)

	const booleanQueryTransformer = {
		get: (val: string) => val === 'true',
		set: (val: boolean) => val.toString(),
	}

	const isAscending = bindDirectionQuery
		? useRouteQuery(bindDirectionQuery, initialAscend.toString(), { transform: booleanQueryTransformer })
		: ref<boolean>(initialAscend)

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

interface GetPostTypeClassNameOptions {
	prefix?: string
}

export function getPostTypeClassName(type = 'tech', options?: GetPostTypeClassNameOptions) {
	const { prefix = 'text' } = options || {}
	return `${prefix}-${type}`
}
