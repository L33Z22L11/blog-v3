import type { Toc, TocLink } from '@nuxt/content'
import type { MaybeComputedElementRef } from '@vueuse/core'

interface TocList {
	id: string
	offsetTop: number | undefined
}

export function useToc(toc: MaybeRefOrGetter<Toc | undefined>, scrollableEl?: MaybeComputedElementRef) {
	const { height: bodyHeight } = useElementSize(document?.body)
	const { y: scrollY } = useWindowScroll()

	function flattenToc(tocTree: TocLink[], tocList: TocList[] = []) {
		tocTree.forEach(({ id, children }) => {
			const headingOffset = document?.getElementById(id)?.offsetTop
			tocList.push({ id, offsetTop: headingOffset })
			children && flattenToc(children, tocList)
		})
		return tocList
	}

	const tocOffsets = computedWithControl(
		refDebounced(bodyHeight),
		() => flattenToc(toValue(toc)?.links || []).reverse(),
	)

	function getActiveHeading() {
		const scrollMargin = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('scroll-margin-top'))
		const scrollOffset = scrollY.value + (scrollMargin || 64)
		// 为兼容性不使用 findLast，而是使用倒序的 tocOffsets
		return tocOffsets.value.find(item => item.offsetTop && item.offsetTop <= scrollOffset)?.id
	}

	const activeHeadingId = computedWithControl(
		refThrottled(scrollY, undefined, true),
		() => document && getActiveHeading(),
	)

	function scrollToActiveTocItem() {
		const el = unrefElement(scrollableEl)
		const active = el?.querySelector<HTMLLinkElement>(`a[href="#${activeHeadingId.value}"]`)

		if (el && active) {
			el.scrollTo({
				top: active.offsetTop - el.clientHeight / 4,
				behavior: 'smooth',
			})
		}
	}

	watch(activeHeadingId, scrollToActiveTocItem)

	return {
		tocOffsets,
		activeHeadingId,
	}
}
