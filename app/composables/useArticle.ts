import type ArticleProps from '~/types/article'
import type { ArticleOrderType } from '~/types/article'
import { alphabetical } from 'radash'

interface UseCategoryOptions {
    bindQuery?: string | false
}

export function useCategory(list: MaybeRefOrGetter<ArticleProps[]>, options?: UseCategoryOptions) {
    // BUG: 首次访问时无法绑定分类到查询参数
    const { bindQuery } = options ?? {}
    const category = bindQuery
        ? useRouteQuery(bindQuery, undefined, { transform: (value?: string) => value })
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

export function getPostTypeClassName(type?: string, options?: { prefix?: string }) {
    if (!type)
        type = 'tech'

    const {
        prefix = 'text',
    } = options ?? {}

    return `${prefix}-${type}`
}
