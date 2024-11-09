<script setup lang="ts">
const props = defineProps<{
    banner?: string
    mirror?: ImgService
    title?: string
    description?: string
    link: string
}>()

const src = computed(() => getImgUrl(props.banner, props.mirror))
</script>

<template>
    <ZRawLink :to="link" class="link-banner card" :title>
        <NuxtImg v-if="banner" class="link-banner-bg" :src :alt="title" />
        <div class="link-banner-header" />
        <div class="link-banner-info">
            <div class="link-banner-title">
                {{ title }}
            </div>
            <div class="link-banner-desc">
                {{ description ?? getDomain(link) }}
            </div>
        </div>
    </ZRawLink>
</template>

<style lang="scss" scoped>
.link-banner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: $breakpoint-phone;
    margin: 2rem auto;
    line-height: initial;

    .link-banner-bg {
        aspect-ratio: 2.4;
        margin-bottom: -5%;
        mask: linear-gradient(#fff 50%, transparent);
        object-fit: cover;
    }

    .link-banner-info {
        padding: 0.5em 1em;
    }

    .link-banner-title {
        font-size: 1.2em;
        color: var(--c-text);
    }

    .link-banner-desc {
        margin-top: 0.5em;
        font-size: 0.8em;
        color: var(--c-text-2);
    }
}
</style>
