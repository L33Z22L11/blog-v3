<script setup lang="ts">
import { ZhiluIcon, ZhiluIconOld, ZLink } from '#components'

const props = defineProps<{
    tag?: string
    content: string
}>()

function el() {
    const { tag = 'div', content } = props
    return h({
        template: `<${tag}>${content}</${tag}>`,
        components: { ZhiluIcon, ZhiluIconOld, ZLink },
    })
}
</script>

<template>
    <el />
</template>
