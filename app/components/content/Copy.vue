<script setup lang="ts">
defineProps<{
    prompt?: string
    command: string
}>()
const text = ref<HTMLInputElement>()
function copy() {
    try {
        navigator.clipboard.writeText(text.value!.value)
    }
    catch (e) {
        text.value!.select()
        document.execCommand('copy')
    }
}
</script>

<template>
    <code class="command">
        <span v-if="prompt" class="prompt">{{ prompt }}</span>
        <input ref="text" class="code check-x" :value="command">
        <div class="copy" @click="copy"><Icon name="ph:copy-bold" size="1.2em" /></div>
    </code>
</template>

<style lang="scss" scoped>
.command {
    display: flex;
    overflow: hidden;
    margin: 0.5rem 0;
    border: 1px solid var(--c-border);
    border-radius: 0.5em;
    background-color: var(--ld-bg-card);
    font-size: 0.8125em;
    line-height: 2.5;

    .prompt {
        flex-shrink: 0;
        padding: 0 1em;
        border-right: 1px solid var(--c-border);
        background-color: var(--c-bg-2);
        color: var(--c-text-2);
    }

    .code {
        // flex-grow: 1 会在窄宽度下溢出
        width: 100%;
        background-color: var(--ld-bg-card);
        white-space: nowrap;
        text-indent: 1em;
    }

    .copy {
        display: inline-flex;
        align-items: center;
        height: 2.5em;
        margin: 0 0.2em;
        padding: 0.5em;
        color: var(--c-text-2);
        transition: color, 0.2s;
        cursor: pointer;

        &:hover {
            color: var(--c-primary-1);
        }
    }
}
</style>
