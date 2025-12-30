import type { Toc, TocLink } from '@nuxt/content'

interface TocList {
	id: string
	offsetTop: number
}

export function useToc(toc: MaybeRefOrGetter<Toc | undefined>) {
	const { height: bodyHeight } = useElementSize(document?.body)

	function flattenToc(tocTree: TocLink[], tocList: TocList[] = []) {
		tocTree.forEach((item) => {
			const headingEl = document.getElementById(item.id)
			if (headingEl)
				tocList.push({ id: item.id, offsetTop: headingEl.offsetTop })
			if (item.children)
				flattenToc(item.children, tocList)
		})
		return tocList
	}

	const tocOffsets = computedWithControl(
		refDebounced(bodyHeight),
		() => flattenToc(toValue(toc)?.links || []).reverse(),
	)

	const { y: windowScrollY } = useWindowScroll()

	function getActiveHeading() {
		const scrollMargin = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('scroll-margin-top'))
		const scrollPosition = windowScrollY.value + (scrollMargin || 64)
		// 为兼容性不使用 findLast，而是使用倒序的 tocOffsets
		return tocOffsets.value.find(item => item.offsetTop <= scrollPosition)?.id
	}

	const activeHeadingId = computedWithControl(
		refThrottled(windowScrollY, undefined, true),
		() => document && getActiveHeading(),
	)

	function scrollToActiveTocItem() {
		const tocContainerEl = document.querySelector('#blog-aside')
		const activeTocEl = document.querySelector(`#blog-aside a[href="#${activeHeadingId.value}"]`) as HTMLElement | null
		// scrollIntoView 触发目录滚动时导致文章持续缓慢滚动并打断正常滚动
		tocContainerEl?.scroll({ top: activeTocEl?.offsetTop || 0 })
	}

	watch(activeHeadingId, scrollToActiveTocItem)

	return {
		tocOffsets,
		activeHeadingId,
	}
}
