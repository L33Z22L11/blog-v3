<script setup lang="ts">
defineProps<{
    title?: string
    open?: boolean
}>()
</script>

<template>
    <details :open>
        <summary>
            <slot name="title">
                {{ title }}
            </slot>
        </summary>
        <div class="detail">
            <slot />
        </div>
    </details>
</template>

<style lang="scss" scoped>
details {
    margin: 1em 0;
    border: 1px solid var(--c-border);
    border-radius: 0.5em;
    background-color: var(--c-bg-2);
    font-size: 0.9em;
    transition: height 0.2s;

    &[open] {
        summary {
            font-weight: var(--font-weight-bold);
            color: currentcolor;

            &::before {
                content: "收起";
            }
        }
    }

    summary {
        padding: 0.5em 0.8rem;
        color: var(--c-text-2);
        transition: all 0.2s;
        cursor: pointer;

        > :deep(p) {
            display: inline;
        }

        &::before {
            content: "展开";
            float: right;
            opacity: 0.5;
            margin-left: 0.5em;
            font-weight: normal;
            transition: color 0.2s;
        }

        &:hover {
            color: var(--c-text);
        }
    }

    .detail {
        position: relative;
        padding: 0 0.8rem 0.5rem;

        :deep(.z-codeblock) {
            margin: 0 -0.5rem -0.8rem;
        }
    }
}
</style>
