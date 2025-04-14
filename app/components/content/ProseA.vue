<script setup lang="ts">
const props = defineProps<{
    href: string
    icon?: string
}>()

const icon = computed(() => props.icon || getDomainIcon(props.href))
const tip = computed(() => ({
    content: isExtLink(props.href) ? getDomain(props.href) : decodeURIComponent(props.href),
    inlinePositioning: true,
}))
</script>

<template>
    <ZRawLink v-tip="tip" class="z-link" :to="href">
        <Icon v-if="icon" class="domain-icon" :name="icon" />
        <slot />
    </ZRawLink>
</template>

<style lang="scss" scoped>
.z-link {
    margin: 0 -0.1em;
    padding: 0 0.1em;
    background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
    color: var(--c-primary);
    transition: all 0.2s;

    &:hover {
        border-radius: 0.3em;
        background-size: 100% 100%;
    }

    .domain-icon {
        margin-right: 0.1em;
    }
}
</style>
