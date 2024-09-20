<script setup lang="ts">
defineProps<{
    to?: string
    rel?: string
}>()
</script>

<template>
    <!-- TODO: 根据链接添加合适的图标 -->
    <ZRawLink class="z-link" :to :rel>
        <slot />
    </ZRawLink>
    <Icon v-if="isExtLink(to)" class="external" name="ph:arrow-up-right" />
</template>

<style scoped lang="scss">
.z-link {
    background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
    color: var(--c-primary);
    transition: all 0.2s;

    @supports (color: color-mix(in srgb, transparent, transparent)) {
        --c-primary-soft: color-mix(in srgb, var(--c-primary) 15%, transparent);
    }

    &:hover {
        border-radius: 0.3em;
        background-size: 100% 100%;
    }
}

.iconify.external {
    font-size: 0.8em;
    vertical-align: text-top;
    color: var(--c-primary);
}
</style>
