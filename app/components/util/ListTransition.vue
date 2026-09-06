<script setup lang="ts" generic="T, S">
const props = defineProps<{ items: T[], state?: S }>()
const container = useTemplateRef('container')
const content = useTemplateRef('content')
const updated = ref(false)
let revision = 0
let animations: Animation[] = []

function cancel() {
	animations.forEach(animation => animation.cancel())
	animations = []
}

watch(() => [props.items, props.state] as const, async () => {
	const current = ++revision
	const outer = container.value
	const inner = content.value
	if (!outer || !inner)
		return
	// 先批量读取当前屏幕坐标，快速连续排序也从动画的当前位置接续。
	const elements = () => Array.from(inner.querySelectorAll<HTMLElement>('[data-list-key]'))
	const visible = (box: DOMRect) => box.bottom > 0 && box.top < window.innerHeight
	const before = new Map(elements().map(element => [element.dataset.listKey!, element.getBoundingClientRect()]))
	const height = outer.getBoundingClientRect().height
	cancel()
	const immediate = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		|| document.documentElement.hasAttribute('data-article-transition')
	updated.value = true
	if (immediate) {
		outer.style.height = ''
		delete outer.dataset.changing
		return
	}
	outer.style.height = `${height}px`
	outer.dataset.changing = ''
	// 内容立即更新；不把列表清空或等退场后再提交。
	await nextTick()
	if (current !== revision)
		return
	const target = inner.getBoundingClientRect().height
	const motion = getComputedStyle(outer)
	const timing = {
		duration: parseCssTime(motion.getPropertyValue('--motion-duration')),
		easing: motion.getPropertyValue('--motion-easing').trim(),
	}
	const after = elements().map(element => ({ element, rect: element.getBoundingClientRect() }))
	animations.push(outer.animate([{ height: `${height}px` }, { height: `${target}px` }], { ...timing, fill: 'forwards' }))
	for (const { element, rect } of after) {
		const previous = before.get(element.dataset.listKey!)
		// 离屏条目直接布局，进入视口的条目短距离浮现，避免从几屏外飞入。
		if (!visible(rect))
			continue
		if (previous && visible(previous)) {
			const x = previous.left - rect.left
			const y = previous.top - rect.top
			if (Math.abs(x) + Math.abs(y) > 0.5)
				animations.push(element.animate([{ translate: `${x}px ${y}px` }, { translate: '0 0' }], timing))
		}
		else {
			animations.push(element.animate([{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], timing))
		}
	}
	await Promise.allSettled(animations.map(animation => animation.finished))
	if (current !== revision)
		return
	outer.style.height = ''
	cancel()
	delete outer.dataset.changing
})

onBeforeUnmount(() => {
	revision++
	cancel()
})
</script>

<template>
<div ref="container" class="list-transition" :data-list-updated="updated || undefined">
	<div ref="content" class="list-transition-content">
		<slot :items :state />
	</div>
</div>
</template>

<style lang="scss" scoped>
.list-transition-content {
	// 包含首尾条目的 margin，测量高度与真实占位保持一致。
	display: flow-root;
}

.list-transition[data-changing] {
	overflow: clip;
	overflow-anchor: none;
}

.list-transition[data-list-updated] :deep(:is(.article-card, .article-item)) {
	animation: none;
}
</style>
