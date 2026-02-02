<script setup lang="ts">
import type { CSSProperties } from 'vue'

const layoutStore = useLayoutStore()
const { asideWidgets, panelTranslate: translate } = storeToRefs(layoutStore)

const panelTranslateStyle = computed<CSSProperties>(() => ({
	transform: Object.values(translate.value).map(v => v ? `translate(${v})` : '').join(' '),
}))
</script>

<template>
<div
	id="blog-panel"
	:class="{ 'has-active': layoutStore.state !== 'none' }"
	:style="panelTranslateStyle"
>
	<button
		class="toggle-sidebar mobile-only"
		:class="{ active: layoutStore.state === 'sidebar' }"
		aria-label="切换菜单"
		@click="layoutStore.toggle('sidebar')"
	>
		<Icon class="rtl-flip" name="ph:sidebar-duotone" />
	</button>

	<button
		v-if="asideWidgets.length"
		class="toggle-aside widescreen-only"
		:class="{ active: layoutStore.state === 'aside' }"
		aria-label="切换侧边栏"
		@click="layoutStore.toggle('aside')"
	>
		<Icon class="rtl-flip" name="ph:align-right-duotone" />
	</button>
</div>
</template>

<style lang="scss" scoped>
#blog-panel {
	contain: paint;
	position: fixed;
	inset-inline-end: min(1rem, 5%);
	bottom: min(2rem, 5%);
	border-radius: 0.5rem;
	background-color: var(--c-bg-a50);
	backdrop-filter: blur(0.5rem);
	font-size: 1.4rem;
	transition: transform 0.1s;
	z-index: var(--z-index-popover);

	@media (max-height: $breakpoint-phone) {
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
</style>
