<script setup lang="ts">
import { computed, resolveComponent, useRuntimeConfig } from '#imports'
import { joinURL, withLeadingSlash, withTrailingSlash } from 'ufo'

const props = defineProps<{
    src?: string
    alt?: string
    width?: string | number
    height?: string | number
    zoom?: boolean
}>()

const imgComponent = useRuntimeConfig().public.mdc.useNuxtImage ? resolveComponent('NuxtImg') : 'img'

const src = computed(() => {
    if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
        const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
        if (_base !== '/' && !props.src.startsWith(_base)) {
            return joinURL(_base, props.src)
        }
    }
    return props.src
})

const layoutStore = useLayoutStore()
const lightboxStore = useLightboxStore()
function handleZoom() {
    layoutStore.toggle('lightbox')
    lightboxStore.setState({
        url: src.value,
        caption: props.alt,
    })
}
</script>

<template>
    <figure class="image">
        <component
            :is="imgComponent" :alt :style="{ cursor: zoom && 'zoom-in' }"
            :src :width :height
            @click="zoom && handleZoom()"
        />
        <figcaption v-if="alt" aria-hidden v-text="alt" />
    </figure>
</template>

<style lang="scss" scoped>
.image {
    margin-block: 1em;
    text-align: center;

    img {
        max-width: 100%;
        border-radius: 0.2em;
    }

    figcaption {
        font-size: 0.8em;
        color: var(--c-text-3);
    }
}
</style>
