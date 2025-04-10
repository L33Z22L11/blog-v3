<script setup lang="ts">
const props = defineProps<{
    icon?: string
}>()

const icon = computed(() => props.icon || 'ph:chat-centered-text-duotone')
</script>

<template>
    <div class="quote title-like">
        <div class="icon-line">
            <slot name="icon">
                <Icon :name="icon" />
            </slot>
        </div>
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.quote {
    font-size: 1.2rem;
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
    color: var(--c-text-2);

    :deep(p) {
        margin: 0;
    }
}

.icon-line {
    position: relative;
    opacity: 0.5;
    min-height: 0.5em;
    margin-bottom: -0.5em;
    mask: linear-gradient(#fff, transparent);
    font-size: 4rem;
    transition: all 0.2s;
    z-index: -1;

    :hover > & {
        opacity: 1;
        transform: translateY(-0.5rem);
    }
}
</style>
