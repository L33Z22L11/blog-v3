<script setup lang="ts">
const layoutStore = useLayoutStore()

// 页面异步数据完成后才会注册具名插槽；水合时必须保留原有 SSR 侧栏。
const layoutSlots = useLayoutSlotProvider()
if (layoutSlots)
	await layoutSlots.ready

const hasAside = computed(() => !!layoutSlots?.slots.value?.aside)
</script>

<template>
<BlogMask
	:show="layoutStore.state === 'aside'"
	class="hide-above-tablet"
	@click="layoutStore.close()"
/>

<!-- 不能用 Transition 实现弹出收起动画，因为宽屏状态始终显示 -->
<!-- 空侧栏保留 Grid 轨道，由轨道宽度过渡完成收起。 -->
<aside
	id="blog-aside" :class="{ 'show': layoutStore.state === 'aside', 'is-empty': !hasAside }"
	:inert="!hasAside"
>
	<slot />
</aside>
</template>

<style scoped>
#blog-aside {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	overflow: hidden auto;
	padding: 0.5rem;
	z-index: var(--z-index-popover);

	@media (max-width: 1080px) {
		position: fixed;
		inset-inline-end: 0;
		top: 0;
		width: 320px;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		transform: var(--transform-end-far);
		transition: transform 0.2s;

		/* TODO 留 padding-bottom 避让 BlogPanel */

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

	@media (width > 1080px) {
		/* 轨道伸缩时保持卡片排版宽度，避免内容挤成窄条后再次展开。 */
		> :deep(*) {
			width: calc(var(--aside-width) - 1rem);
		}
	}

	&.is-empty {
		visibility: hidden;
		padding-inline: 0;
	}
}
</style>
