<script setup lang="ts">
defineProps<{
    icon?: string
    center?: boolean
}>()
</script>

<template>
    <h2 class="z-title" :class="{ 'z-title-center': center }">
        <Icon v-if="icon?.match(':')" :name="icon" />
        <span v-else-if="icon">{{ icon }}</span>
        <div v-else-if="!center" class="title-mark" />
        <span class="title-content">
            <slot />
        </span>
    </h2>
</template>

<style scoped lang="scss">
.z-title {
    display: flex;
    align-items: center;
    gap: 1rem 0.5rem;
    margin: 2rem 0.5rem;
    font-size: 2rem;
    flex-wrap: wrap;
}

.z-title-center {
    justify-content: center;
    margin: 2rem;
    text-align: center;
}

.title-mark {
    width: 8px;
    height: 1em;
    margin-right: 4px;
    border-radius: 8px;
    background-color: var(--c-primary);
    vertical-align: middle;
}
</style>
