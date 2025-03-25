<script setup lang="ts">
const props = defineProps<{
    link: string
    title: string
    description?: string
    icon?: string
    mirror?: ImgService
}>()

const src = computed(() => getImgUrl(props.icon, props.mirror))
</script>

<template>
    <ZRawLink :to="link" class="link-card card" :title="`${title}\n${description || ''}\n${link}`">
        <div class="link-card-info">
            <div class="link-card-title">
                {{ title }}
            </div>
            <div class="link-card-description">
                {{ description ?? getDomain(link) }}
            </div>
        </div>
        <slot name="icon" class="link-card-icon-slot">
            <NuxtImg v-if="src" class="link-card-icon" :src :alt="title" />
        </slot>
    </ZRawLink>
</template>

<style lang="scss" scoped>
.link-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 20rem;
    max-width: 90%;
    margin: 2rem auto;
    padding: 0.5em 0.8em;
    font-size: 0.9em;
    line-height: initial;

    // 溢出显示省略号
    .link-card-info {
        flex-grow: 1;
        overflow: hidden;
    }

    .link-card-title {
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
    }

    // 内部需要是块元素
    .link-card-description {
        overflow: hidden;
        opacity: 0.5;
        margin-top: 0.2em;
        font-size: 0.9em;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .link-card-icon {
        flex-shrink: 0;
        height: 3rem;
        max-width: 5rem;
        border-radius: 0.5rem;
        object-fit: cover;
    }
}
</style>
