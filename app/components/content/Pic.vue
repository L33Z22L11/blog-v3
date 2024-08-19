<script setup lang="ts">
import type { ImgService } from '~/composables/useImg'

const props = defineProps<{
    src: string
    mirror?: ImgService
    caption?: string
    width?: string
    fancybox?: boolean
}>()

const src = useImgService(props.src, props.mirror)
</script>

<template>
    <figure class="image">
        <NuxtImg :src :width :alt="caption" />
        <figcaption v-if="caption">
            {{ caption }}
        </figcaption>
    </figure>
</template>

<style lang="scss" scoped>
.image {
    text-align: center;

    img {
        max-width: 100%;
        border-radius: 0.5em;
    }

    figcaption {
        font-size: 0.8rem;
    }
}
</style>
