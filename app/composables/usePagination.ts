interface UsePaginationOptions {
    initialPage?: number
    perPage?: number
}

export default function<T>(list: MaybeRefOrGetter<T[]>, options?: UsePaginationOptions) {
    const {
        initialPage = 1,
        perPage = 10,
    } = options ?? {}
    const page = ref(initialPage)
    const totalPages = Math.ceil(toValue(list).length / perPage)
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
