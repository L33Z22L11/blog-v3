<script setup lang="ts">
const layoutStore = useLayoutStore()

const { widgets } = useWidgets(() => layoutStore.asideWidgets)
</script>

<template>
<Transition>
	<div v-if="layoutStore.isOpen('aside')" id="z-aside-bgmask" @click="layoutStore.toggle('aside')" />
</Transition>
<!-- 此处不能使用 Transition，因为宽屏状态始终显示 -->
<!-- 如果为空数组则隐藏 -->
<Transition>
	<aside v-if="layoutStore.asideWidgets?.length" id="z-aside" :class="{ show: layoutStore.isOpen('aside') }">
		<TransitionGroup name="float-in">
			<!-- 更换页面时相同 key 的组件不会更新 -->
			<component :is="widget.comp" v-for="widget in widgets" :key="widget.name" />
		</TransitionGroup>
	</aside>
</Transition>
</template>

<style lang="scss" scoped>
#z-aside {
	overflow: auto;
	padding: 0.5rem;

	@media (max-width: $breakpoint-widescreen) {
		position: fixed;
		top: 0;
		right: 0;
		width: 320px;
		height: auto;
		max-width: 100%;
		max-height: 100%;
		transform: translateX(100%);
		transition: transform 0.2s;
		z-index: 100;

		:deep(.widget) {
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

#z-aside-bgmask {
	position: fixed;
	inset: 0;
	background-color: #0003;
	transition: opacity 0.2s;
	z-index: 100;

	@media (min-width: $breakpoint-widescreen) {
		display: none;
	}
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.v-enter-active,
.v-leave-active {
	transition: all 0.2s;
}
</style>
