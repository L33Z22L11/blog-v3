<script setup lang="ts">
const props = defineProps<{
    icon?: string
}>()
const icon = props.icon || 'ph:chat-centered-text-duotone'
</script>

<template>
    <div class="quote title-like">
        <div class="icon-line">
            <Icon :name="icon" size="5rem" />
        </div>
        <slot />
    </div>
</template>

<style lang="scss" scoped>
.quote {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--c-text-2);

    &:hover {
        > .icon-line {
            transform: translateY(-0.5rem);
        }
    }

    > .icon-line {
        opacity: 0.2;
        width: 100%;
        margin-bottom: -2.5rem;
        mask: linear-gradient(#fff 50%, transparent);
        font: 5rem;
        transition: transform 0.2s;
        z-index: -1;
    }

    :deep(p) {
        flex-grow: 1;
        padding: 1rem;
        text-indent: 0;
    }
}
</style>
