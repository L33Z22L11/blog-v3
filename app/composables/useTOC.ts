import type { TocLink } from '@nuxt/content'

type TOCOffsetList = {
    id: string
    offsetTop: number
}[]

export function useTOCAutoHighlight(toc: TocLink[]) {
    const activeTocItem = ref<string | null>(null)
    const tocOffsets = ref<TOCOffsetList>([])
    const flattenTOC = (toc: TocLink[], offsetList: TOCOffsetList = []): TOCOffsetList => {
        toc.forEach((item) => {
            const element = document?.getElementById(item.id)
            if (element)
                offsetList.push({ id: item.id, offsetTop: element.offsetTop })
            if (item.children?.length)
                flattenTOC(item.children, offsetList)
        })
        return offsetList
    }

    const calculateOffsets = () => {
        tocOffsets.value = flattenTOC(toc)
    }

    const updateActiveTOC = () => {
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

    onMounted(() => {
        calculateOffsets()
        window.addEventListener('scroll', updateActiveTOC, { passive: true })
        window.addEventListener('resize', calculateOffsets)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('scroll', updateActiveTOC)
        window.removeEventListener('resize', calculateOffsets)
    })

    watch(
        () => toc,
        calculateOffsets,
        { deep: true, immediate: true },
    )

    return {
        activeTocItem,
    }
}
