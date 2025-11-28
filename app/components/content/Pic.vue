<script setup lang="ts">
import { LazyPopoverLightbox } from '#components'

const props = withDefaults(defineProps<{
	src: string
	mirror?: ImgService
	caption?: string
	width?: string | number
	height?: string | number
	zoom?: boolean
}>(), {
	caption: '',
	zoom: true,
})

const pic = ref()
const picEl = useCurrentElement<HTMLImageElement>(pic)

const popoverStore = usePopoverStore()

const { open } = popoverStore.use(
	() => h(LazyPopoverLightbox, {
		el: picEl.value,
		caption: props.caption,
	}),
	{ unique: true },
)
</script>

<template>
<!-- <ProseImg> 被 <p> 包裹，服务端渲染时若内含块级元素会自动关闭，导致水合不匹配 -->
<figure class="image">
	<UtilImg
		ref="pic"
		class="image"
		:style="{ cursor: zoom && 'zoom-in' }"
		:src :alt="caption" :width :height :mirror
		@click="zoom && open()"
	/>
	<figcaption v-if="caption" aria-hidden v-text="caption" />
</figure>
</template>

<style lang="scss" scoped>
figcaption {
	margin-top: -0.5em;
	font-size: 0.8em;
	text-align: center;
	color: var(--c-text-2);
}
</style>
