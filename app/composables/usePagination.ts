interface UsePaginationOptions {
    initialPage?: number
    perPage?: number
    query?: boolean
}

export default function<T>(list: MaybeRefOrGetter<T[]>, options?: UsePaginationOptions) {
    const {
        initialPage = 1,
        perPage = 10,
        query = false,
    } = options ?? {}
    const totalPages = Math.ceil(toValue(list).length / perPage) || 1
    const page = query
        ? useRouteQuery(
            'page',
            initialPage,
            { transform: val => val < 1 || val > totalPages ? 1 : val },
        )
        : ref(initialPage)
    const pagedList = computed(() => {
        const start = (page.value - 1) * perPage
        return toValue(list).slice(start, start + perPage)
    })

    watch(list, () => {
        page.value = 1
    })

    return {
        totalPages,
        page,
        pagedList,
    }
}
