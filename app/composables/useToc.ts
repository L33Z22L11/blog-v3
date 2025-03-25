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
        // 此处不需担心 reverse 改变原数组
        () => flattenToc(toValue(toc)).reverse(),
    )

    const updateActiveToc = () => {
        const scrollMargin = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('scroll-margin-top'))

        const scrollPosition = window.scrollY + (scrollMargin || 64)

        // 为兼容性不使用 findLast
        const currentItem = tocOffsets.value.find(item => item.offsetTop <= scrollPosition)

        activeTocItem.value = currentItem?.id || null

        // 滚动到当前 item
        const scrollContainer = document.querySelector('#z-aside')
        const activeElement = document.querySelector(`#z-aside a[href="#${activeTocItem.value}"]`) as HTMLElement | null
        // scrollIntoView 触发目录滚动时导致文章持续缓慢滚动并打断正常滚动
        scrollContainer?.scroll({ top: activeElement?.offsetTop || 0 })
    }

    useEventListener('scroll', autoThrottleAndDebounce(() => updateActiveToc()), { passive: true })

    const { height: bodyHeight } = useElementSize(document?.body)
    debouncedWatch(bodyHeight, tocOffsets.trigger)

    return {
        activeTocItem,
    }
}
