interface UseArticleCategoryOptions {
	bindQuery?: string
}

export function useArticleCategory<T extends { categories?: readonly string[] | null }>(list: MaybeRefOrGetter<readonly T[]>, options?: UseArticleCategoryOptions) {
	const { bindQuery } = options || {}

	const category = bindQuery
		? useHydratedQuery(bindQuery, useRouteQuery(bindQuery, undefined))
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
