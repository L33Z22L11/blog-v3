<script setup lang="ts">
const props = withDefaults(defineProps<{
    noprompt?: boolean
    prompt?: string
    command?: string
}>(), {
    prompt: '$',
})

// FIXME: Slot "default" invoked outside of the render function
const slot = defineSlots()
const command = computed(() => slot.default?.()[0]?.children ?? props.command)
const commandInputValue = ref(command.value)
const showUndo = ref(false)
const commandInput = ref<HTMLInputElement>()
const copyBtn = ref<HTMLElement>()

useTooltip(commandInput, '可以修改命令后再复制', { trigger: 'focus' })
useCopy(copyBtn, commandInput)

watch(commandInputValue, (newVal) => {
    showUndo.value = newVal !== command.value
})
function undo() {
    commandInputValue.value = command.value
    showUndo.value = false
}
</script>

<template>
    <code class="command">
        <span v-if="!noprompt" class="prompt">{{ prompt }}</span>
        <input ref="commandInput" v-model="commandInputValue" class="code">
        <button v-if="showUndo" class="operation" @click="undo">
            <Icon name="ph:arrow-u-up-left-bold" />
        </button>
        <button ref="copyBtn" class="operation">
            <Icon name="ph:copy-bold" />
        </button>
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

    .operation {
        height: 2.5em;
        padding: 0.5em 0.2em;
        color: var(--c-text-2);
        transition: color, 0.2s;

        &:last-child {
            padding-right: 0.5em;
        }

        &:hover {
            color: var(--c-primary);
        }
    }
}
</style>
