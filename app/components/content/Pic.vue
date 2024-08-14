<script setup lang="ts">
const props = defineProps<{
    src: string
    mirror?: boolean
    caption?: string
    width?: string
    fancybox?: boolean
}>()

const src = (props.mirror ? 'https://image.baidu.com/search/down?url=' : '') + props.src
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
