import type { TocLink } from '@nuxt/content'

interface TocOffset {
    id: string
    offsetTop: number
}

export function useTocAutoHighlight(toc: MaybeRefOrGetter<TocLink[]>) {
    const activeTocItem = ref<string | null>(null)

    const flattenToc = (toc: TocLink[], offsetList: TocOffset[] = []) => {
        toc.forEach((item) => {
            const element = document.getElementById(item.id)
            if (element)
                offsetList.push({ id: item.id, offsetTop: element.offsetTop })
            if (item.children)
                flattenToc(item.children, offsetList)
        })
        return offsetList
    }

    const tocOffsets = computedWithControl(
        () => toValue(toc),
        () => flattenToc(toValue(toc)),
    )

    const updateActiveToc = () => {
        const scrollMargin = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('scroll-margin-top'))

        const scrollPosition = window.scrollY + (scrollMargin || 64)

        // 使用副本而不是直接 reverse
        const currentItem = [...tocOffsets.value]
            .reverse()
            .find(item => item.offsetTop <= scrollPosition)

        activeTocItem.value = currentItem?.id || null

        // TODO: 滚动到当前 item，这样写不够优雅
        // const activeElement = document.querySelector(`#z-aside a[href="#${activeTocItem.value}"]`)
        // if (activeElement) {
        //     // 使用 `scrollIntoView` 或此函数有小概率触发文章持续缓慢滚动
        //     // 触发目录滚动时会打断文章滚动
        //     activeElement.scrollIntoViewIfNeeded({ behavior: 'smooth', block: 'center' })
        // }
    }

    useEventListener('scroll', autoThrottle(() => updateActiveToc()), { passive: true })

    const { height: bodyHeight } = useElementSize(document?.body)
    debouncedWatch(bodyHeight, tocOffsets.trigger)

    return {
        activeTocItem,
    }
}
