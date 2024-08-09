interface UsePaginationOptions {
    initialPage?: number
    perPage?: number
    bindQuery?: boolean
}

export default function<T>(list: MaybeRefOrGetter<T[]>, options?: UsePaginationOptions) {
    const {
        initialPage = 1,
        perPage = 10,
        bindQuery = false,
    } = options ?? {}

    const totalPages = Math.ceil(toValue(list).length / perPage) || initialPage

    const page = bindQuery
        ? useRouteQuery(
            'page',
            initialPage,
            { transform: val => val >= 1 && val <= totalPages ? Number(val) : initialPage },
        )
        : ref(initialPage)

    const pagedList = computed(() => {
        const start = (page.value - 1) * perPage
        return toValue(list).slice(start, start + perPage)
    })

    watch(list, () => {
        page.value = initialPage
    })

    return {
        totalPages,
        page,
        pagedList,
    }
}
