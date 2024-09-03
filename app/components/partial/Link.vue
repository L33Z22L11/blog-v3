<script setup lang="ts">
defineProps<{
    to?: string
    rel?: string
}>()
</script>

<template>
    <ZRawLink class="z-link" :to :rel>
        <slot />
    </ZRawLink>
    <Icon v-if="isExtLink(to)" class="external" name="ph:arrow-up-right" />
</template>

<style scoped lang="scss">
.z-link {
    background: linear-gradient(var(--c-primary-2), var(--c-primary-2)) no-repeat center bottom / 100% 0.1em;
    color: var(--c-primary);
    transition: background-size 0.2s;

    &:hover {
        border-radius: 0.3em;
        background-size: 100% 100%;
    }
}

.iconify.external {
    font-size: 0.8em;
    vertical-align: text-top;
    color: var(--c-primary-1);
}
</style>
