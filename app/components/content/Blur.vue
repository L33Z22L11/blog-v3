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

<style scoped lang="scss">
.blur {
    transition: filter 0.2s;
    filter: blur(4px);

    &:hover {
        filter: blur(0);
    }
}
</style>
