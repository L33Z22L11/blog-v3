import type { UseElementBoundingReturn } from '@vueuse/core'

export type AvoidTarget = Ref<HTMLElement | null | undefined>

export function useAvoidTransform(
	originRef: AvoidTarget,
	targets: Ref<AvoidTarget[]>,
) {
	const { height: windowHeight, width: windowWidth } = useWindowSize()
	const targetBounds = shallowRef(new Map<AvoidTarget, UseElementBoundingReturn>())
	const originRect = shallowRef({ top: 0, bottom: 0, left: 0, right: 0 })

	function updateOriginPosition() {
		const origin = originRef.value
		if (!origin)
			return
		const style = getComputedStyle(origin)
		const bottom = Number.parseFloat(style.bottom) || 0
		const right = Number.parseFloat(style.insetInlineEnd || style.right) || 0
		originRect.value = {
			top: windowHeight.value - bottom - origin.offsetHeight,
			bottom: windowHeight.value - bottom,
			left: windowWidth.value - right - origin.offsetWidth,
			right: windowWidth.value - right,
		}
	}

	watch([windowHeight, windowWidth], updateOriginPosition)
	onMounted(updateOriginPosition)

	watchImmediate(targets, (list) => {
		const newMap = new Map<AvoidTarget, UseElementBoundingReturn>()
		for (const target of list) {
			if (target.value)
				newMap.set(target, targetBounds.value.get(target) ?? useElementBounding(target))
		}
		targetBounds.value = newMap
	}, { deep: true })

	const transform = computed(() => {
		if (!originRef.value)
			return ''
		const { bottom: originBottom, left: originLeft, right: originRight, top: originTop } = originRect.value

		const shifts = Array.from(targetBounds.value.values())
			.filter(({ top, bottom, left, right }) => {
				const hasHOverlap = originLeft < right.value && originRight > left.value
				const hasVOverlap = top.value < originBottom && bottom.value > originTop
				return hasHOverlap && hasVOverlap
			})
			.map(({ top }) => originBottom - top.value)

		const maxShift = Math.max(...shifts)
		return maxShift > 0 ? `translateY(-${maxShift + 16}px)` : ''
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
