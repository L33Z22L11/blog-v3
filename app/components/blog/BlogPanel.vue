<script setup lang="ts">
const layoutStore = useLayoutStore()
const { asideWidgets, isAnyOpen, translate } = storeToRefs(layoutStore)

const panelTranslateStyle = computed(() => ({
	transform: Object.values(translate.value).map(v => v ? `translate(${v})` : '').join(' '),
}))

useEventListener('keydown', (e) => {
	if (isAnyOpen.value && e.key === 'Escape') {
		e.preventDefault()
		layoutStore.closeAll()
	}
})
</script>

<template>
<div id="blog-panel" :class="{ 'has-active': layoutStore.isAnyOpen }" :style="panelTranslateStyle">
	<button
		class="toggle-sidebar mobile-only"
		:class="{ active: layoutStore.isOpen('sidebar') }"
		aria-label="切换菜单"
		@click="layoutStore.toggle('sidebar')"
	>
		<Icon class="rtl-flip" name="ph:sidebar-duotone" />
	</button>

	<button
		v-if="asideWidgets.length"
		class="toggle-aside widescreen-only"
		:class="{ active: layoutStore.isOpen('aside') }"
		aria-label="切换侧边栏"
		@click="layoutStore.toggle('aside')"
	>
		<Icon class="rtl-flip" name="ph:align-right-duotone" />
	</button>
</div>
</template>

<style lang="scss" scoped>
#blog-panel {
	position: fixed;
	overflow: hidden;
	overflow: clip;
	bottom: min(2rem, 5%);
	border-radius: 0.5rem;
	background-color: var(--c-bg-a50);
	backdrop-filter: blur(0.5rem);
	font-size: 1.4rem;
	transition: transform 0.1s;
	z-index: var(--z-index-popover);
	inset-inline-end: min(1rem, 5%);

	@media (max-height: $breakpoint-phone) {
		display: flex;
	}

	&.has-active {
		box-shadow: 0 0 0.5rem var(--ld-shadow);
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
</style>
