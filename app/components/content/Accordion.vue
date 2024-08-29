<script setup lang="ts">
defineProps<{
    summary: string
    open?: boolean
    nopadding?: boolean
}>()
</script>

<template>
    <details :open>
        <summary v-html="summary" />
        <div class="detail" :class="{ nopadding }">
            <slot />
        </div>
    </details>
</template>

<style lang="scss">
details {
    border: 1px solid var(--c-border);
    border-radius: 0.5em;
    background-color: var(--c-bg-2);
    font-size: 0.9em;
    transition: height 0.2s;

    &[open] {
        summary {
            font-weight: 600;
            color: inherit;

            &::before {
                content: "收起";
            }
        }
    }

    summary {
        padding: 0.5em 0.8em;
        color: var(--c-text-2);
        transition: all 0.2s;
        cursor: pointer;

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
        padding: 0 0.8em;

        &.nopadding {
            padding: 0;

            > * {
                /* stylelint-disable-next-line declaration-no-important */
                margin: 0 !important;
            }
        }
    }
}
</style>
