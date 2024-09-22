interface UsePaginationOptions {
    initialPage?: number
    perPage?: number
    bindParam?: string | false
}

export default function<T> (list: MaybeRefOrGetter<T[]>, options?: UsePaginationOptions) {
    const {
        initialPage = 1,
        perPage = 10,
        bindParam = false,
    } = options ?? {}

    const totalPages = Math.ceil(toValue(list).length / perPage) || initialPage

    const page = bindParam
        ? useRouteParams(
            bindParam,
            initialPage,
            {
                transform(val) {
                    const page = Number(val)
                    return page >= 1 && page <= totalPages ? page : initialPage
                },
            },
        )
        : ref(initialPage)

    const listPaged = computed(() => {
        const start = (page.value - 1) * perPage
        return toValue(list).slice(start, start + perPage)
    })

    // 不应在此处 watch list

    return {
        totalPages,
        page,
        listPaged,
    }
}
