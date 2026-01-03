<script setup lang="ts">
const layoutStore = useLayoutStore()
const { asideWidgets } = storeToRefs(layoutStore)

const { widgets } = useWidgets(asideWidgets)
</script>

<template>
<BlogMask
	v-model:show="layoutStore.open.aside"
	class="widescreen-only"
	@click="layoutStore.toggle('aside')"
/>

<!-- 不能用 Transition 实现弹出收起动画，因为宽屏状态始终显示 -->
<!-- 如果为空数组则隐藏 -->
<aside v-if="asideWidgets?.length" id="blog-aside" :class="{ show: layoutStore.open.aside }">
	<TransitionGroup name="float-in">
		<!-- 更换页面时相同 key 的组件不会更新 -->
		<component :is="widget.comp" v-for="widget in widgets" :key="widget.name" />
	</TransitionGroup>
</aside>
</template>

<style lang="scss" scoped>
#blog-aside {
	overflow: auto;
	padding: 0.5rem;
	z-index: var(--z-index-popover);

	@media (max-width: $breakpoint-widescreen) {
		position: fixed;
		top: 0;
		inset-inline-end: 0;
		width: 320px;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		transform: var(--transform-end-far);
		transition: transform 0.2s;

		:deep(.blog-widget) {
			padding: 0.5rem;
			border-radius: 1rem;
			box-shadow: 0 0 1rem var(--ld-shadow);
			background-color: var(--ld-bg-blur);
			backdrop-filter: blur(0.5rem);
		}

		&.show {
			transform: none;
		}
	}
}
</style>
