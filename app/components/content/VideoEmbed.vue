<script setup lang="ts">
const props = withDefaults(defineProps<{
	/** 视频类型，数字过长时需通过双引号传入字符串 */
	type?: 'raw' | 'bilibili' | 'bilibili-nano' | 'youtube' | 'douyin' | 'douyin-wide' | 'tiktok'
	id: string
	autoplay?: boolean
	/** 视频宽高比，如 `16 / 9` `1.6` */
	ratio?: string | number
	/** 仅 type 为 `raw` 时可用 */
	poster?: string
	/** 视频宽度 */
	width?: string
	/** 视频高度 */
	height?: string
	/** CSS Zoom 比例 */
	zoom?: number
}>(), {
	type: 'raw',
	height: '80vh',
})

const ratio = computed(() => {
	if (props.ratio) {
		return props.ratio
	}
	switch (props.type) {
		case 'raw':
			return undefined
		case 'douyin':
			return '27 / 56'
		case 'douyin-wide':
			return '1198 / 731'
		default:
			return '16 / 9'
	}
})

const src = computed(() => {
	switch (props.type) {
		case 'bilibili':
			return `https://player.bilibili.com/player.html?bvid=${props.id}&autoplay=${props.autoplay}`
		case 'bilibili-nano':
			return `https://www.bilibili.com/blackboard/newplayer.html?bvid=${props.id}&autoplay=${props.autoplay}`
		case 'youtube':
			return `https://www.youtube.com/embed/${props.id}?rel=0&disablekb=1&playsinline=1&autoplay=${props.autoplay}`
		case 'douyin':
			return `https://open.douyin.com/player/video?vid=${props.id}`
		case 'douyin-wide':
			return `https://open.douyin.com/player/video?vid=${props.id}`
		case 'tiktok':
			return `https://www.tiktok.com/embed/v3/${props.id}`
		default:
			return props.id
	}
})

const videoPlayer = useTemplateRef('video-player')

// 抖音会预检测宽度是否小于 730px，再返回竖屏或横屏模式
// douyin-wide 需要阻塞加载，等进入视口后通过 zoom: 0.1 触发横屏模式
// 已优化为 loading="lazy"
const zoom = ref<number>()
const zoomFactorForFixed = {
	'douyin': 0.0031,
	'douyin-wide': 0.00134,
}

function useZoomHelper(resizeType: keyof typeof zoomFactorForFixed) {
	useResizeObserver(videoPlayer, ([entry]) => {
		if (!entry)
			return
		const { width } = entry.contentRect
		const zoomFactor = zoomFactorForFixed[resizeType]
		zoom.value = width * zoomFactor
	})
}

onMounted(() => {
	if (props.type in zoomFactorForFixed)
		useZoomHelper(props.type as keyof typeof zoomFactorForFixed)
})
</script>

<template>
<div
	ref="video-player"
	class="video"
	:style="{
		aspectRatio: ratio,
		maxWidth: width,
		maxHeight: height,
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
		:style="{ zoom }"
		scrolling="no"
		loading="lazy"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
	/>
</div>
</template>

<style lang="scss" scoped>
.video {
	contain: paint;
	border-radius: 0.8rem;
	box-shadow: 0 2px 0.5rem var(--ld-shadow);

	article & {
		margin: 2rem auto;
	}
}

iframe, video {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
