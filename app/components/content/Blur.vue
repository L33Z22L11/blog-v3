<script setup lang="ts">
defineProps<{
    text?: string
}>()
</script>

<template>
    <span class="blur">
        {{ text }}
        <slot />
    </span>
</template>

<style scoped lang="scss">
.blur {
    transition: filter 0.2s;
    filter: blur(0.5em);

    &:hover {
        filter: blur(0);
    }
}
</style>
