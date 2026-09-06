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
<style lang="scss">
@use 'sass:math';

$sidebar-width: 280px;
$sidebar-weight: $sidebar-width * 0.2;
#blog-root {
	--aside-width: #{$sidebar-width};
	--sidebar-width: var(--aside-width);

	display: grid;
	// 显式间隔轨道使右栏收起时只关闭右侧间隔，左右栏均保持独立。
	grid-template-columns: var(--sidebar-width) 1rem minmax(0, 1fr) 1rem var(--aside-width);
	align-items: start;
	width: 100%;
	max-width: calc(var(--aside-width) + 1rem + $breakpoint-widescreen);
	min-width: 0;
	margin-inline: auto;

	&:has(> #blog-aside.is-empty) {
		grid-template-columns: var(--sidebar-width) 1rem minmax(0, 1fr) 0px 0px;
	}

	@media (max-width: $breakpoint-widescreen) {
		// 保留原 flex-shrink: .2，按左右两部分的加权基准宽度分摊收缩。
		--sidebar-width: calc(var(--aside-width) - (var(--aside-width) + 1rem + #{$breakpoint-widescreen} - 100%) * #{math.div($sidebar-weight, $sidebar-weight + $breakpoint-widescreen)});

		&, &:has(> #blog-aside.is-empty) {
			grid-template-columns: var(--sidebar-width) 1rem minmax(0, 1fr) 0px 0px;
		}
	}

	@media (max-width: $breakpoint-mobile) {
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
	// 保留语义 main 和可见溢出，不影响正文内的 sticky 元素。
	min-width: 0;
}

#blog-aside {
	grid-area: 1 / 5;
}
</style>
