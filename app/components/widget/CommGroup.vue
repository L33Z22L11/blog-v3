<template>
<ZWidget
	card
	dim
	title="博客/技术社区"
	bg-img="https://p.qlogo.cn/gh/169994096/169994096/100/"
	bg-right
>
	<div class="title">
		纸网接入点
	</div>

	<Tip copy icon="oui:empty" :tip-options="{ placement: 'left' }">
		<Icon name="ri:qq-fill" />169994096
	</Tip>
</ZWidget>
</template>

<style lang="scss" scoped>
.title {
	background-clip: text;
	background-image: linear-gradient(60deg, var(--c-accent) -30%, var(--c-primary), var(--c-text-1));
	background-position: 100% 0;
	background-size: 200%;
	font-size: 1.8em;
	font-weight: 800;
	letter-spacing: 0.05em;
	color: transparent;
	transition: background-position 0.2s;

	.widget:hover & {
		background-position: 0 0;
	}
}

.tip {
	margin: 0.2em 0;
	font-size: 0.9em;
}

:deep(.bg-img).bg-img.bg-img {
	opacity: 0.5;
}
</style>
