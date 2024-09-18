<script setup lang="ts">
const props = defineProps<{
    icon?: string
}>()
const icon = props.icon || 'ph:chat-centered-text-duotone'
</script>

<template>
    <div class="quote title-like">
        <div class="icon-line">
            <Icon :name="icon" />
        </div>
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.quote {
    font-size: 1.2rem;
    font-weight: var(--font-weight-medium);
    color: var(--c-text-2);

    &:hover {
        > .icon-line > .iconify {
            transform: translateY(-0.5rem);
        }
    }

    > .icon-line {
        position: relative;
        opacity: 0.5;
        min-height: 1rem;
        margin-bottom: -0.5em;
        mask: linear-gradient(#fff, transparent);
        font-size: 4rem;
        line-height: 1;
        z-index: -1;

        > .iconify {
            transition: transform 0.2s;
        }
    }

    :deep(p) {
        text-indent: 0;
    }
}
</style>
