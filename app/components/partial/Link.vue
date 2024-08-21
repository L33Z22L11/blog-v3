<script setup lang="ts">
defineProps<{ to?: string }>()
</script>

<template>
    <ZRawLink class="z-link" :to="to">
        <slot />
        <Icon v-if="isExtLink(to)" class="external" name="ph:arrow-up-right" />
    </ZRawLink>
</template>

<style scoped lang="scss">
.z-link {
    border-radius: 0.3em;
    background: linear-gradient(var(--c-primary-3), var(--c-primary-3)) no-repeat center bottom / 100% 0.1em;
    text-decoration: none;
    color: var(--c-primary-1);
    transition: background-size 0.2s;

    &:hover {
        background-size: 100% 100%;
    }
}

.iconify.external {
    font-size: 0.8em;
    vertical-align: text-top;
    color: var(--c-primary-2);
}
</style>
