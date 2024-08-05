<script setup lang="ts">
import { ZLIcon, ZLIconOld, ZLink } from '#components'

const props = defineProps<{
    tag?: string
    content: string
}>()

function render() {
    const { tag = 'div', content } = props
    return h({
        template: `<${tag}>${content}</${tag}>`,
        components: { ZLIcon, ZLIconOld, ZLink },
    })
}
</script>

<template>
    <render />
</template>
