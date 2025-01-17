<script setup lang="ts">
defineProps<{ to?: string }>()
</script>

<template>
    <!-- 若使用 NuxtLink 则 # 开头的链接键盘焦点不会切换 -->
    <a v-if="to?.startsWith('#')" :href="to"><slot /></a>
    <NuxtLink v-else :to :target="isExtLink(to) ? '_blank' : undefined">
        <slot />
    </NuxtLink>
</template>
