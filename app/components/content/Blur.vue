<script setup lang="ts">
defineProps<{
    text?: string
}>()
</script>

<template>
    <span class="blur">
        <slot>{{ text }}</slot>
    </span>
</template>

<style lang="scss" scoped>
.blur {
    transition: filter 0.2s;
    filter: blur(4px);

    &:hover {
        filter: blur(0);
    }
}
</style>
