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

export function genPageArr(current: number, total: number, surrounding: number = 1) {
    const startPage = Math.max(2, current >= total - surrounding ? total - 2 * surrounding : current - surrounding)
    const endPage = Math.min(total - 1, current <= surrounding ? 1 + 2 * surrounding : current + surrounding)
    const pageArr = [
        1,
        ...Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index),
        total > 1 ? total : null,
    ].filter(Boolean)
    if (pageArr[1] !== 2)
        pageArr.splice(1, 0, null)
    if (pageArr[pageArr.length - 2] !== total - 1)
        pageArr.splice(pageArr.length - 1, 0, null)
    return pageArr
}
