<script setup lang="ts">
defineProps<{
    href: string
}>()
</script>

<template>
    <!-- TODO: 根据链接添加合适的图标 -->
    <ZRawLink class="z-link" :to="href">
        <slot />
    </ZRawLink>
    <Icon v-if="isExtLink(href)" class="external" name="ph:arrow-up-right" />
</template>

<style scoped lang="scss">
.z-link {
    background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
    color: var(--c-primary);
    transition: all 0.2s;

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
