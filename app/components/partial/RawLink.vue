<script setup lang="ts">
defineProps<{ to?: string }>()
// TODO: 鼠标悬浮外联展示小箭头
</script>

<template>
    <NuxtLink :to :target="isExtLink(to) ? '_blank' : undefined">
        <slot />
    </NuxtLink>
</template>
