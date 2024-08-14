<script setup lang="ts">
defineProps<{
    excerpt: string
}>()
</script>

<template>
    <div class="md-excerpt">
        <Icon name="ph:highlighter-bold" size="1.2em" /> {{ excerpt }}
    </div>
</template>

<style lang="scss" scoped>
.md-excerpt {
    margin: 1rem;
    font-size: 0.9em;
    color: var(--c-text-2);
    transition: 0.2s;
    user-select: none;

    &:hover {
        color: inherit;
    }
}
</style>
