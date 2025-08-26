<script setup lang="ts">
const props = withDefaults(defineProps<{
	type?: 'bilibili' | 'youtube' | 'raw' | 'douyin' | 'tiktok'// 使用 douyin 或 tiktok 时请为 id 添加双引号
	id: string
	autoplay?: boolean
	/** 视频长宽比，如 `16 / 9` `1.6` */
	ratio?: string | number
	/** 仅 type 为 `raw` 时可用 */
	poster?: string
	width?: string
}>(), {
	type: 'raw',
})

const ratio = computed(() => props.ratio || props.type === 'raw' ? undefined : '16 / 9')

const src = computed(() => {
	switch (props.type) {
		case 'bilibili':
			return `https://player.bilibili.com/player.html?bvid=${props.id}&autoplay=${props.autoplay}`
		case 'youtube':
			return `https://www.youtube.com/embed/${props.id}?rel=0&disablekb=1&playsinline=1&autoplay=${props.autoplay}`
		case 'douyin':
			return `https://open.douyin.com/player/video?vid=${props.id}`
		case 'tiktok':
			return `https://www.tiktok.com/embed/v3/${props.id}`
		default:
			return props.id
	}
})
</script>

<template>
<div
	:class="['video', { 'dy-video': type === 'douyin' }]"
	:style="{
		aspectRatio: ratio,
		maxWidth: width,
	}"
>
	<video
		v-if="type === 'raw'"
		:poster
		:src
		controls
	/>
	<iframe
		v-else
		:src
		scrolling="no"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	/>
</div>
</template>

<style lang="scss" scoped>
.video {
	overflow: hidden;
	margin: 2rem auto;
	border-radius: 0.8rem;
	box-shadow: 0 2px 0.5rem var(--ld-shadow);
}

.dy-video {
	@extend .video;
	width: 100%;
	height: 452.75px;
	@media (max-width: 1367px) {
	width: 324px;
	height: 672px;
	}
}

iframe, video {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
