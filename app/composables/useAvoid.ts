import type { UseElementBoundingReturn } from '@vueuse/core'

export type AvoidTarget = Ref<HTMLElement | null | undefined>

export function useAvoidTransform(
	originRef: AvoidTarget,
	targets: Ref<AvoidTarget[]>,
) {
	const targetBounds = shallowRef<UseElementBoundingReturn[]>([])
	const originRect = shallowRef({ top: 0, bottom: 0, left: 0, right: 0 })

	function updateOriginPosition() {
		const origin = originRef.value
		if (!origin)
			return
		const style = getComputedStyle(origin)
		const rect = origin.getBoundingClientRect()
		// 扣除当前避让位移，避免移动地址栏和动画中的坐标被重复计入。
		const { m41: x, m42: y } = new DOMMatrixReadOnly(style.transform === 'none' ? undefined : style.transform)
		originRect.value = {
			top: rect.top - y,
			bottom: rect.bottom - y,
			left: rect.left - x,
			right: rect.right - x,
		}
	}

	function update() {
		updateOriginPosition()
		targetBounds.value.forEach(bounds => bounds.update())
	}

	useEventListener('resize', update)
	useEventListener('scroll', update, { capture: true, passive: true })
	if (import.meta.client)
		useEventListener(window.visualViewport, ['resize', 'scroll'], update, { passive: true })
	useResizeObserver(originRef, updateOriginPosition)
	onMounted(updateOriginPosition)

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
		const { bottom: originBottom, left: originLeft, right: originRight, top: originTop } = originRect.value

		const shifts = targetBounds.value
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
