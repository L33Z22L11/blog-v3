<script setup lang="ts">
defineProps<{
	hasAside?: boolean
}>()

const layoutStore = useLayoutStore()
const { avoidTargets } = storeToRefs(layoutStore)

const panelRef = useTemplateRef('panel-anchor')
const { transform } = useAvoidTransform(panelRef, avoidTargets)
</script>

<template>
<!-- 固定外层提供不受避让动画影响的测量位置。 -->
<div ref="panel-anchor" class="panel-anchor">
	<div
		id="blog-panel"
		:class="{ 'has-active': layoutStore.state !== 'none' }"
		:style="{ transform }"
	>
		<button
			v-if="hasAside"
			class="toggle-aside hide-above-tablet"
			:class="{ active: layoutStore.state === 'aside' }"
			aria-label="切换侧边栏"
			@click="layoutStore.toggle('aside')"
		>
			<Icon class="rtl-flip" name="tabler:align-right" />
		</button>

		<Icon v-show="false" name="tabler:layout-sidebar-filled" />
		<button
			class="toggle-sidebar hide-above-mobile"
			:class="{ active: layoutStore.state === 'sidebar' }"
			aria-label="切换菜单"
			@click="layoutStore.toggle('sidebar')"
		>
			<Icon class="rtl-flip" :name="layoutStore.state === 'sidebar' ? 'tabler:layout-sidebar-filled' : 'tabler:layout-sidebar'" />
		</button>
	</div>
</div>
</template>

<style scoped>
.panel-anchor {
	position: fixed;
	inset-inline-end: min(1rem, 5%);
	bottom: min(2rem, 5%);
	pointer-events: none;
	z-index: var(--z-index-popover);
}

#blog-panel {
	contain: paint;
	border-radius: 0.5rem;
	background-color: var(--c-bg-a50);
	backdrop-filter: blur(0.5rem);
	font-size: 1.4rem;
	transition: transform 0.1s;
	pointer-events: auto;

	:root[data-article-transition] & {
		transition: none !important;
		view-transition-name: article-panel;
	}

	@media (max-height: 528px) {
		display: flex;
	}

	&.has-active {
		box-shadow: var(--box-shadow-1), var(--box-shadow-3);
	}
}

button {
	display: block;
	padding: 0.5rem;
	transition: all 0.2s;

	&:hover {
		background-color: var(--c-bg-a80);
		color: var(--c-primary);
	}

	&.active {
		background-color: var(--ld-bg-active);
		color: var(--c-primary);
	}
}

/* 正文有独立快照，在 Panel 的快照层重新合成磨砂背景。 */
:global(::view-transition-group(article-panel)) {
	border-radius: 0.5rem;
	backdrop-filter: blur(0.5rem);
	/* 元素先完成避让定位，由快照在新旧位置之间播放位移动画。 */
	animation-duration: 0.1s;
	animation-timing-function: ease;
	z-index: 1;
}

:global(::view-transition-new(article-panel)) {
	animation: none;
}

:global(::view-transition-old(article-panel)) {
	display: none;
}
</style>
