<script setup lang="ts">
import type { UtilImgProps } from '../util/Img.vue'
import { LazyPopoverLightbox } from '#components'

const props = withDefaults(defineProps<UtilImgProps & {
	caption?: string
	zoom?: boolean
}>(), {
	caption: '',
	zoom: true,
})

const slots = defineSlots<{
	caption: () => any
}>()

const pic = ref()
const picEl = useCurrentElement<HTMLImageElement>(pic)

const modalStore = useModalStore()

const { open } = modalStore.use(
	() => h(LazyPopoverLightbox, {
		el: picEl.value,
		caption: props.alt || props.caption || slots.caption,
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
		:alt="caption || alt"
		:src :width :height :mirror :filter
		@click="zoom && open()"
	/>
	<figcaption v-if="caption || $slots.caption" aria-hidden>
		<slot name="caption">
			{{ caption }}
		</slot>
	</figcaption>
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
