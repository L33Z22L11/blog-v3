import type { UseElementBoundingReturn } from '@vueuse/core'

export type AvoidTarget = Ref<HTMLElement | null | undefined>

export function useAvoidTransform(
	panelRef: AvoidTarget,
	targets: Ref<AvoidTarget[]>,
) {
	const { height: windowHeight, width: windowWidth } = useWindowSize()
	const targetBounds = shallowRef(new Map<AvoidTarget, UseElementBoundingReturn>())
	const originalPosition = shallowRef({ top: 0, bottom: 0, left: 0, right: 0 })

	function updateOriginalPosition() {
		const panel = panelRef.value
		if (!panel)
			return
		const style = getComputedStyle(panel)
		const bottom = Number.parseFloat(style.bottom) || 0
		const right = Number.parseFloat(style.insetInlineEnd || style.right) || 0
		originalPosition.value = {
			top: windowHeight.value - bottom - panel.offsetHeight,
			bottom: windowHeight.value - bottom,
			left: windowWidth.value - right - panel.offsetWidth,
			right: windowWidth.value - right,
		}
	}

	watch([windowHeight, windowWidth], updateOriginalPosition)
	onMounted(updateOriginalPosition)

	watchImmediate(targets, (list) => {
		const newMap = new Map<AvoidTarget, UseElementBoundingReturn>()
		for (const target of list) {
			if (target.value)
				newMap.set(target, targetBounds.value.get(target) ?? useElementBounding(target))
		}
		targetBounds.value = newMap
	}, { deep: true })

	const transform = computed(() => {
		if (!panelRef.value)
			return ''
		const { top, bottom, left, right } = originalPosition.value
		let maxOverlap = 0
		for (const [target, bounds] of targetBounds.value) {
			if (!target.value)
				continue
			const hOverlap = Math.min(right, bounds.right.value) - Math.max(left, bounds.left.value)
			if (hOverlap <= 0)
				continue
			const vOverlap = Math.min(bottom, bounds.bottom.value) - Math.max(top, bounds.top.value)
			if (vOverlap > 0)
				maxOverlap = Math.max(maxOverlap, vOverlap)
		}
		return maxOverlap > 0 ? `translateY(-${maxOverlap.toFixed(2) + 16}px)` : ''
	})

	return {
		transform,
	}
}

export function useAvoidTarget(
	targetRef: AvoidTarget,
	active?: MaybeRefOrGetter<boolean>,
) {
	const layoutStore = useLayoutStore()

	function add() {
		if (!layoutStore.avoidTargets.includes(targetRef))
			layoutStore.avoidTargets.push(targetRef)
	}

	function remove() {
		const idx = layoutStore.avoidTargets.indexOf(targetRef)
		if (idx > -1)
			layoutStore.avoidTargets.splice(idx, 1)
	}

	watchImmediate([toRef(active), targetRef], ([isActive]) => {
		if (isActive ?? true)
			add()
		else
			remove()
	})

	onUnmounted(remove)
}
