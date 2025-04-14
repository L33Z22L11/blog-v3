<script setup lang="ts">
import type { BundledLanguage } from 'shiki'

const props = withDefaults(defineProps<{
    icon?: string
    title?: string
    message?: string
    code?: string
    language?: BundledLanguage
}>(), {
    icon: 'solar:siren-rounded-bold-duotone',
    language: 'log',
})

const codeHighlighted = await useShikiHighlighted(() => props.code, {
    lang: props.language,
    unwrap: true,
})
</script>

<template>
    <div class="error">
        <div />
        <Icon class="error-icon" :name="icon" />
        <div class="error-title" v-html="title" />

        <ProsePre
            v-if="code"
            :filename="message"
            :language="language"
            meta="wrap"
        >
            <span v-html="codeHighlighted" />
        </ProsePre>

        <slot />
    </div>
</template>

<style lang="scss" scoped>
.error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    min-height: calc(100vh - 16rem);

    > .error-icon {
        font-size: 5rem;
        color: var(--c-text-3);
    }

    > .error-title {
        font-size: 1.5rem;
        word-break: break-all;
        color: var(--c-text-3);

        > :deep(pre) {
            font-size: 1rem;
            white-space: pre-wrap;
        }
    }

    > .z-codeblock {
        max-width: 100%;

        :deep(.shiki) {
            background-color: transparent !important; /* stylelint-disable-line declaration-no-important */
        }
    }
}
</style>
