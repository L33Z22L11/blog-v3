<script setup lang="ts">
defineProps<{
    img?: string
    text?: string
    square?: boolean
}>()
</script>

<template>
    <ZRawLink class="badge" :class="{ 'badge-img': img, 'badge-square': square }">
        <NuxtImg v-if="img" class="badge-icon" :src="img" alt="avatar" />
        <span class="badge-text">
            {{ text }}
            <slot />
        </span>
    </ZRawLink>
</template>

<style scoped lang="scss">
.badge {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--c-border);
    border-radius: 4px;
    background-color: var(--c-bg-3);
    font-size: 0.9em;
    line-height: normal;
    color: var(--c-text-2);
    transition: color 0.2s;

    & + & {
        margin-left: 1em;
    }

    &[href]:hover {
        color: var(--c-text);
    }
}

.badge-img {
    margin-block: 2px;
    border-radius: 1em;
    font-size: 0.8em;

    .badge-icon {
        height: 1.8em;
        aspect-ratio: 1;
        border-radius: 1em;
        object-fit: cover;
    }
}

.badge-square {
    border-radius: 4px;

    .badge-icon {
        border-radius: 3px;
    }
}

.badge-text {
    margin: 0 0.4em;
}
</style>
