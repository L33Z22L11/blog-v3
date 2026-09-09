import type { UseElementBoundingReturn } from '@vueuse/core'

export type AvoidTarget = Ref<HTMLElement | null | undefined>

export function useAvoidTransform(
	originRef: AvoidTarget,
	targets: Ref<AvoidTarget[]>,
) {
	const targetBounds = shallowRef<UseElementBoundingReturn[]>([])
	// 测量未参与位移动画的外层容器。
	const originBounds = useElementBounding(originRef, { windowResize: false, windowScroll: false })

	function update() {
		originBounds.update()
		targetBounds.value.forEach(bounds => bounds.update())
	}

	useEventListener('resize', update)
	useEventListener('scroll', update, { capture: true, passive: true })
	if (import.meta.client)
		useEventListener(window.visualViewport, ['resize', 'scroll'], update, { passive: true })

	watch(() => targets.value.map(target => target.value), (_elements, _previous, onCleanup) => {
		// 新页面提交后测量目标；移除目标时一并释放其监听器。
		const scope = effectScope()
		onCleanup(() => scope.stop())
		targetBounds.value = scope.run(() => targets.value.map(target => useElementBounding(target, { windowResize: false, windowScroll: false }))) ?? []
		update()
	}, { immediate: true, flush: 'post' })

	const transform = computed(() => {
		if (!originRef.value)
			return ''
		const { bottom: originBottom, left: originLeft, right: originRight, top: originTop } = originBounds

		const shifts = targetBounds.value
			.filter(({ top, bottom, left, right }) => {
				const hasHOverlap = originLeft.value < right.value && originRight.value > left.value
				const hasVOverlap = top.value < originBottom.value && bottom.value > originTop.value
				return hasHOverlap && hasVOverlap
			})
			.map(({ top }) => originBottom.value - top.value)

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
