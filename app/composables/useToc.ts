import type { TocLink } from '@nuxt/content'

interface TocOffset {
    id: string
    offsetTop: number
}

export function useTocAutoHighlight(toc: MaybeRefOrGetter<TocLink[]>) {
    const activeTocItem = ref<string | null>(null)

    const flattenToc = (toc: TocLink[], offsetList: TocOffset[] = []) => {
        toc.forEach((item) => {
            const element = document?.getElementById(item.id)
            if (element)
                offsetList.push({ id: item.id, offsetTop: element.offsetTop })
            if (item.children?.length)
                flattenToc(item.children, offsetList)
        })
        return offsetList
    }

    const tocOffsets = computedWithControl(() => toValue(toc), () => {
        return flattenToc(toValue(toc))
    })

    const updateActiveToc = () => {
        const scrollPosition = window.scrollY // 添加偏移量？

        // 使用副本而不是直接 reverse
        const currentItem = [...tocOffsets.value]
            .reverse()
            .find(item => item.offsetTop <= scrollPosition)

        activeTocItem.value = currentItem?.id || null

        // TODO: 滚动到当前 item
        // const activeElement = document.querySelector(`#toc a[href="#${activeTocItem.value}"]`)
        // if (activeElement) {
        //     activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // }
    }

    useEventListener('scroll', updateActiveToc, { passive: true })
    useEventListener('resize', () => tocOffsets.trigger())

    return {
        activeTocItem,
    }
}
