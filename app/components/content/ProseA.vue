<script setup lang="ts">
defineProps<{ href: string }>()
</script>

<template>
    <ZLink :to="href">
        <slot />
    </ZLink>
</template>
