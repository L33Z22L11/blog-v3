<script setup lang="ts">
const props = withDefaults(defineProps<{
    src: string
    mirror?: ImgService
    caption?: string
    zoom?: boolean
}>(), {
    // zoom: true,
})

const src = computed(() => getImgUrl(props.src, props.mirror))
</script>

<template>
    <ProseImg :src :alt="caption" :zoom />
</template>
