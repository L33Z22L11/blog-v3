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

const src = computed(() => getImgUrl(props.src, props.mirror))
const pic = ref()
const picEl = useCurrentElement<HTMLImageElement>(pic)

const popoverStore = usePopoverStore()

const { open } = popoverStore.use(() => h(LazyPopoverLightbox, {
	el: picEl.value,
	caption: props.caption,
}))
</script>

<template>
<!-- <ProseImg> 被 <p> 包裹，若内含块级元素会自动关闭，导致水合不匹配 -->
<figure class="image">
	<NuxtImg
		ref="pic"
		class="image"
		:style="{ cursor: zoom && 'zoom-in' }"
		:src :alt="caption" :width :height
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
