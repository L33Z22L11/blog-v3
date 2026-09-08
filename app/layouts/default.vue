<script setup lang="ts">
const { slots } = provideLayoutSlots()
const main = useTemplateRef('main')

const unhook = useNuxtApp().hook('page:finish', async () => {
	await nextTick()

	// Nuxt 随后才会触发 page:loading:end 并恢复滚动，确保锚点按最终列宽定位。
	await Promise.allSettled(main.value?.parentElement?.getAnimations()
		.filter(anim => anim instanceof CSSTransition)
		.map(anim => anim.finished) ?? [])
})
onScopeDispose(unhook)
</script>

<template>
<NuxtLoadingIndicator />
<NuxtRouteAnnouncer :style="{ position: 'absolute' }" />
<BlogSkipToContent />
<BlogSidebar />
<main id="main-content" ref="main">
	<slot />
	<BlogFooter />
</main>
<BlogAside>
	<slot name="aside" />
</BlogAside>
<BlogPanel :has-aside="!!slots?.aside" />
<BikariyaModals />
</template>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style>
#blog-root {
	--aside-width: 280px;
	--sidebar-width: var(--aside-width);

	display: grid;
	/* 显式间隔轨道使右栏收起时只关闭右侧间隔，左右栏均保持独立。 */
	grid-template-columns: var(--sidebar-width) 1rem minmax(0, 1fr) 1rem var(--aside-width);
	align-items: start;
	width: 100%;
	min-width: 0;
	max-width: calc(var(--aside-width) + 1rem + 1080px);
	margin-inline: auto;

	&:has(> #blog-aside.is-empty) {
		grid-template-columns: var(--sidebar-width) 1rem minmax(0, 1fr) 0px 0px;
	}

	@media (max-width: 1080px) {
		/* 保留原 flex-shrink: .2，按加权宽度分摊收缩：56 = 280 × .2，1136 = 56 + 1080。 */
		--sidebar-width: calc(var(--aside-width) - (var(--aside-width) + 1rem + 1080px - 100%) * 56 / 1136);

		&, &:has(> #blog-aside.is-empty) {
			grid-template-columns: var(--sidebar-width) 1rem minmax(0, 1fr) 0px 0px;
		}
	}

	@media (max-width: 768px) {
		&, &:has(> #blog-aside.is-empty) {
			grid-template-columns: 0px 0px minmax(0, 1fr) 0px 0px;
		}
	}
}

#blog-sidebar, #blog-aside {
	position: sticky;
	top: 0;
	height: 100vh;
	height: 100dvh;
	min-width: 0;
	scrollbar-width: thin;
}

#blog-sidebar {
	grid-area: 1 / 1;
}

#main-content {
	grid-area: 1 / 3;
	/* 保留语义 main 和可见溢出，不影响正文内的 sticky 元素。 */
	min-width: 0;
}

#blog-aside {
	grid-area: 1 / 5;
}
</style>
