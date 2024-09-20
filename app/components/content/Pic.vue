<script setup lang="ts">
const props = defineProps<{
    src: string
    mirror?: ImgService
    caption?: string
    width?: string
    fancybox?: boolean
}>()

const src = getImgUrl(props.src, props.mirror)
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
    margin-block: 1em;
    text-align: center;

    img {
        max-width: 100%;
        border-radius: 0.5em;
    }

    figcaption {
        font-size: 0.8rem;
        color: var(--c-text-3);
    }
}
</style>
