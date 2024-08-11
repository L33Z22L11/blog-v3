<script setup lang="ts">
withDefaults(defineProps<{
    code?: string
    language?: string
    filename?: string
    highlights?: () => number[]
    meta?: string
}>(), {
    code: '',
    highlights: () => [],
})
</script>

<template>
    <figure class="z-codeblock">
        <pre><slot /></pre>
    </figure>
</template>

<style lang="scss" scoped>
.z-codeblock {
    overflow: auto;
    margin-block: 1em;
    padding: 1em;
    border-radius: 8px;
    background-color: var(--c-bg-3);
    font-size: 0.9em;
    line-height: 1.4;
}

:deep(.line) {
    padding-inline-start: 1.8rem;
    position: relative;

    &::before {
        content: attr(line);
        position: absolute;
        left: 0;
        width: 1rem;
        text-align: right;
        color: var(--c-text-3);
    }
}
</style>
