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
	title="可访问性"
	content-class="seasonal"
	:style="contentStyle"
>
	<!-- TODO: 优化技术架构展示 -->
	<p>域名迁移到 .site，备案并续费到 2035年7月，托管于 Vercel；博客由 Nuxt Content v3 驱动，使用去图图床。</p>
	<p>
		获得省级、国家级认证如下：<br>
		江苏:<span class="seasonal-emoji">跳转反诈宣传</span><br>
		重庆:<span class="seasonal-emoji">DNS污染</span><br>
		移动:<span class="seasonal-emoji">多省阻断解析</span>
	</p>
</ZWidget>
</template>

<style lang="scss" scoped>
:deep(.seasonal) {
	position: relative;
	z-index: 0;

	&::before {
		content: "";
		position: absolute;
		opacity: 0.2;
		inset: 0;
		border-radius: 0.8rem;
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
