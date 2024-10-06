<script setup lang="ts">
import type { Element } from 'hast'
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
    transformers: [{
        root(hast) {
            const pre = hast.children[0]! as Element
            const code = pre.children[0]! as Element
            code.properties.class = pre.properties.class
            hast.children[0] = code
            return hast
        },
    }],
})
</script>

<template>
    <div class="error">
        <Icon class="error-icon" :name="icon" />
        <div class="error-title" v-html="title" />

        <ProsePre
            v-if="code"
            :filename="message"
            :language="language"
            meta="wrap"
        >
            <code v-html="codeHighlighted" />
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

    .error-icon {
        font-size: 5rem;
        color: var(--c-text-3);
    }

    .error-title {
        font-size: 1.5rem;
        color: var(--c-text-3);
    }

    .z-codeblock {
        max-width: 100%;
    }
}
</style>
