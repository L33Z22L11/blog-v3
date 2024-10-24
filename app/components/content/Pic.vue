<script setup lang="ts">
import { ZLightbox } from '#components'

const props = withDefaults(defineProps<{
    src: string
    mirror?: ImgService
    caption?: string
    width?: string | number
    height?: string | number
    zoom?: boolean
}>(), {
    zoom: true,
})

const src = computed(() => getImgUrl(props.src, props.mirror))
const image = ref(null!)
const elImage = useCurrentElement<HTMLImageElement>(image)

const popoverStore = usePopoverStore()

const { open, close } = popoverStore.use(() => h(ZLightbox, {
    el: elImage.value,
    caption: props.caption,
    onClose() {
        close()
    },
}), {
    duration: 200,
})
</script>

<template>
    <!-- <ProseImg> 被 <p> 包裹，若内含块级元素会自动关闭，导致水合不匹配 -->
    <figure class="image">
        <NuxtImg
            ref="image"
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
