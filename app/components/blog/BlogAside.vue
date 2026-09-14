<script setup lang="ts">
const layoutStore = useLayoutStore()

// 页面异步数据完成后才会注册具名插槽；水合时必须保留原有 SSR 侧栏。
const layoutSlots = useLayoutSlotProvider()
if (layoutSlots)
	await layoutSlots.ready

const hasAside = computed(() => !!layoutSlots?.slots.value?.aside)
const desktop = useMediaQuery('not (max-width: 1080px)')
const reducedMotion = usePreferredReducedMotion()
const retainedSlots = shallowRef(layoutSlots?.slots.value ?? null)
if (layoutSlots) {
	provide(Symbol.for('dxup:layout-slots'), { ...layoutSlots, slots: retainedSlots })
	watch(layoutSlots.slots, (slots) => {
		if (slots?.aside)
			retainedSlots.value = slots
	}, { flush: 'sync' })
}

function beforeLeave(element: Element) {
	if (desktop.value) {
		const { top, left, width } = element.getBoundingClientRect()
		Object.assign((element as HTMLElement).style, { position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${width}px` })
	}
	element.classList.add('is-empty')
	element.setAttribute('inert', '')
}

function cancelLeave(element: Element) {
	element.classList.remove('is-empty')
	element.removeAttribute('inert')
	const style = (element as HTMLElement).style
	for (const property of ['position', 'top', 'left', 'width'])
		style.removeProperty(property)
}

function animateAside() {
	return desktop.value && reducedMotion.value !== 'reduce'
		&& !document.documentElement.hasAttribute('data-article-transition')
}

function afterEnter(element: Element) {
	element.querySelectorAll<HTMLElement>(':scope > .blog-widget')
		.forEach(widget => widget.dataset.nativeEntered = '')
}
</script>

<template>
<BlogMask
	:show="layoutStore.state === 'aside'"
	class="hide-above-tablet"
	@click="layoutStore.close()"
/>

<!-- 页面侧栏退场时脱离布局；窄屏抽屉仍由 show 控制。 -->
<Transition
	name="aside"
	:css="animateAside()"
	@after-enter="afterEnter"
	@before-leave="beforeLeave"
	@leave-cancelled="cancelLeave"
	@after-leave="!hasAside && (retainedSlots = null)"
>
	<aside
		v-if="hasAside"
		id="blog-aside" :class="{ 'show': layoutStore.state === 'aside', 'is-empty': !hasAside }"
		:inert="!hasAside"
		@click.self="layoutStore.close()"
	>
		<slot />
	</aside>
</Transition>
</template>

<style scoped>
#blog-aside {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow: hidden auto;
	padding: 0.5rem;
	z-index: var(--z-index-popover);

	:root[data-article-transition] & {
		transition: none !important;

		@media not (max-width: 1080px) {
			&:not(.is-empty) { view-transition-name: article-aside; }
		}
	}

	@media (max-width: 1080px) {
		position: fixed;
		inset-inline-end: 0;
		top: 0;
		width: 320px;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		/* 为底部悬浮面板的双按钮及底边距留出滚动空间。 */
		padding-bottom: 9rem;
		transform: var(--transform-end-far);
		transition: transform 0.2s;

		/* 平板只有一个按钮；矮屏时双按钮横排，只需留一行高度。 */
		@media (min-width: 769px), (max-height: 528px) {
			padding-bottom: 6rem;
		}

		> :deep(.blog-widget) {
			padding: 0.5rem;
			border-radius: 1rem;
			box-shadow: var(--box-shadow-1), var(--box-shadow-2);
			background-color: var(--ld-bg-blur);
			backdrop-filter: blur(0.5rem);
		}

		&.show {
			transform: none;
		}
	}

	&.aside-enter-active, &.aside-leave-active {
		transition: translate var(--motion-duration) var(--motion-easing), opacity var(--motion-duration) var(--motion-easing);
	}

	&.aside-enter-from, &.aside-leave-to {
		opacity: 0;
		translate: 2rem 0;
	}

	&.aside-leave-active {
		pointer-events: none;
	}
}
</style>
