<script setup lang="ts">
const props = withDefaults(defineProps<{
    noprompt?: boolean
    prompt?: string
    command?: string
}>(), {
    prompt: '$',
})

const slot = defineSlots()
const command = computed(() => slot.default?.()[0].children ?? props.command)

const commandInput = ref<HTMLInputElement>()
const copyBtn = ref<HTMLElement>()

useCopy(copyBtn, commandInput)
</script>

<template>
    <code class="command">
        <span v-if="!noprompt" class="prompt">{{ prompt }}</span>
        <input ref="commandInput" class="code check-x" :value="command">
        <button ref="copyBtn" class="copy"><Icon name="ph:copy-bold" /></button>
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

        &:hover {
            color: var(--c-primary);
        }
    }
}
</style>
