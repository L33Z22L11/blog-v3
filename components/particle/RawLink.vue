<script setup lang="ts">
defineProps<{ to?: string }>()
</script>

<template>
    <NuxtLink :to="to" :target="isExtLink(to) ? '_blank' : undefined">
        <slot />
    </NuxtLink>
</template>
