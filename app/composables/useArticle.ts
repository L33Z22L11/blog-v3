import type ArticleProps from '~/types/article'
import { alphabetical } from 'radash'

export function useCategory(list: MaybeRefOrGetter<ArticleProps[]>) {
    // '' 代表全部分类，undefined 代表未分类
    const category = ref<string | undefined>('')
    const categories = computed(() => [...new Set(toValue(list).map(item => item.categories?.[0]))])
    const listCategorized = computed(
        () => toValue(list).filter(
            item => category.value === '' || item.categories?.[0] === category.value,
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
    const sortOrder = ref(appConfig.pagination.sortOrder || 'date')
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
    if (category === undefined)
        return 'ph:folder-dotted-bold'
    return Reflect.get(appConfig.article.categories, category!)?.icon ?? 'ph:folder-bold'
}
