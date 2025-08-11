<script setup lang="ts">
import type { CSSProperties } from 'vue'

const appConfig = useAppConfig()

const contentStyle = computed<CSSProperties>(() => ({
	'--seasonal-bg': appConfig.seasonal.widgetBackground
		? `url(${appConfig.seasonal.widgetBackground})`
		: undefined,
	'--seasonal-emoji': appConfig.seasonal.emoji,
}))
</script>

<template>
<ZWidget
	card
	title="架构展示"
	content-class="seasonal"
	:style="contentStyle"
>
	<!-- TODO: 优化技术架构展示 -->
	<p>站点由 Nuxt Content v3 进行驱动，部署于 Vercel；通过 MasterGo 设计封面，图床为 Bitiful S4 与 Cloudflare R2。</p>
	<!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
	<p>更多信息：查看<ProseA href="https://blog.zhilu.site/theme">主题介绍</ProseA>。</p>
</ZWidget>
</template>

<style lang="scss" scoped>
.seasonal {
	position: relative;
	overflow: hidden;
	z-index: 0;

	&::before {
		content: "";
		position: absolute;
		opacity: 0.2;
		inset: 0;
		background: center / cover;
		background-image: var(--seasonal-bg);
		z-index: -1;
	}
}

.seasonal-emoji::before, .seasonal-emoji::after {
	// 文明用语😋
	content: var(--seasonal-emoji, "\1F595");
}
</style>
