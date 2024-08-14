<script setup lang="ts">
defineProps<{
    excerpt: string
}>()
</script>

<template>
    <div class="md-excerpt gradient-card">
        <Icon name="ph:highlighter-bold" size="1.2em" /> {{ excerpt }}
    </div>
</template>

<style lang="scss" scoped>
.md-excerpt {
    margin: 1rem;
    padding: 0.5rem;
    font-size: 0.9em;
    color: var(--c-text-3);
    transition: all 0.2s;
    user-select: none;

    &:hover {
        background-color: var(--c-bg);
        color: inherit;
    }
}
</style>
