<script setup lang="ts">
const props = defineProps<{
    href: string
}>()

const icon = computed(() => getDomainIcon(props.href))
const tip = computed(() => isExtLink(props.href) && getDomain(props.href))
</script>

<template>
    <ZRawLink v-tippy="tip" class="z-link" :to="href">
        <Icon v-if="icon" class="domain-icon" :name="icon" />
        <slot />
    </ZRawLink>
</template>

<style lang="scss" scoped>
.z-link {
    background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
    color: var(--c-primary);
    transition: all 0.2s;

    &:hover {
        border-radius: 0.3em;
        background-size: 100% 100%;
    }

    .domain-icon {
        margin: 0 0.1em;
    }
}
</style>
