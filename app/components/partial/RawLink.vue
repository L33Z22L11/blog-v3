<script setup lang="ts">
defineProps<{ to?: string }>()
</script>

<template>
    <a v-if="to === '#'" :href="to"><slot /></a>
    <NuxtLink v-else :to :target="isExtLink(to) ? '_blank' : undefined">
        <slot />
    </NuxtLink>
</template>
