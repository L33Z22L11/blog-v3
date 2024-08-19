<script setup lang="ts">
import { ZLink, ZhiluIcon, ZhiluIconOld } from '#components'

const props = defineProps<{
    tag?: string
    content: string
}>()

function render() {
    const { tag = 'div', content } = props
    return h({
        template: `<${tag}>${content}</${tag}>`,
        components: { ZhiluIcon, ZhiluIconOld, ZLink },
    })
}
</script>

<template>
    <render />
</template>
