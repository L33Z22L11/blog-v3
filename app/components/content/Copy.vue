<script setup lang="ts">
defineProps<{
    prefix?: string
    code: string
}>()
const text = ref<HTMLInputElement>()
function copy() {
    navigator.clipboard.writeText(text.value!.value)
}
</script>

<template>
    <code class="copy">
        <span v-if="prefix" class="snippet-prefix">{{ prefix }}</span>
        <input ref="text" class="code check-x" :value="code">
        <div class="copy-btn" @click="copy"><Icon name="ph:copy-bold" size="1.2em" /></div>
    </code>
</template>

<style lang="scss" scoped>
.copy {
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    margin: 0.5rem 0;
    border: 1px solid var(--c-border);
    border-radius: 0.5em;
    background-color: var(--c-bg-1);
    font-size: 0.8125em;
    line-height: 2.5;

    .snippet-prefix {
        padding: 0 1em;
        border-right: 1px solid var(--c-border);
        background-color: var(--c-bg-3);
        color: var(--c-text-2);
    }

    .code {
        flex: 1;
        white-space: nowrap;
        text-indent: 1em;
    }

    .copy-btn {
        display: inline-flex;
        align-items: center;
        height: 2.5em;
        margin: 0 0.2em;
        padding: 0.5em;
        color: var(--c-text-2);
        transition: 0.2s;
        cursor: pointer;

        &:hover {
            color: var(--c-primary-1);
        }
    }
}
</style>
