<script setup lang="ts">
const props = defineProps<{
    link: string
    title: string
    description?: string
    icon?: string
}>()
</script>

<template>
    <ZRawLink :href="props.link" target="_blank" class="link-card">
        <div class="link-card-info">
            <div class="link-card-title">
                {{ props.title }}
            </div>
            <div class="link-card-description">
                {{ props.description || props.link }}
            </div>
        </div>
        <NuxtImg v-if="props.icon" class="link-card-icon" :src="props.icon" alt="icon" />
    </ZRawLink>
</template>

<style lang="scss" scoped>
.link-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 25em;
    max-width: 90%;
    margin: 1rem auto;
    padding: 0.5rem 0.8rem;
    border-radius: 0.5rem;
    box-shadow: 2px 4px 0.5em var(--c-border);
    background-color: var(--c-bg-1);
    font-size: 0.9em;
    line-height: initial;
    transition: 0.2s;

    &:hover {
        box-shadow: 2px 1em 1em var(--c-border);
        transform: translateY(-2px);
    }
}

// 溢出显示省略号
.link-card-info {
    flex-grow: 1;
    overflow: hidden;
}

.link-card-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    -webkit-line-clamp: 2;
}

// 内部需要是块元素
.link-card-description {
    overflow: hidden;
    margin-top: 0.2em;
    font-size: 0.9em;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--c-text-3);
}

.link-card-icon {
    height: 3rem;
    max-width: 5rem;
    border-radius: 0.5rem;
    object-fit: cover;
}
</style>
