<script setup lang="ts">
import { createPlainShiki, type MountPlainShikiOptions } from 'plain-shiki'
import { useTippy } from 'vue-tippy'

const props = withDefaults(defineProps<{
    /* noprompt?: boolean */
    prompt?: string | boolean
    command?: string
    language?: string
}>(), {
    prompt: '$',
})

// prompt 传入空字符串会变成 true
const showPrompt = computed(() => /* !props.noprompt && */ props.prompt as unknown !== true)
const language = computed(() => props.language ?? getPromptLanguage(props.prompt))

const showUndo = ref(false)
const commandInput = useTemplateRef('command-input')
const copyBtn = useTemplateRef('copy-btn')

useTippy(commandInput, { content: '可以修改命令后再复制', trigger: 'focus' })
useCopy(copyBtn, commandInput)

function undo() {
    commandInput.value!.textContent = props.command ?? ''
    // 触发 shiki 高亮
    commandInput.value?.dispatchEvent(new Event('input'))
    showUndo.value = false
}

function beforeInput(event: InputEvent) {
    const { data, inputType } = event
    if (data?.includes('\n') || inputType === 'insertLineBreak') {
        event.preventDefault()
        showTooltipMessage(event.target as Element, '不支持换行')
    }
}

function onInput(event: InputEvent) {
    showUndo.value = props.command !== (event.target as Element).textContent
}

onMounted(async () => {
    const shiki = await getShikiHighlighter()
    // BUG: 无法高亮特定语言 PowerShell
    const shikiOptions = await resolveShikiOptions({ lang: language.value })
    createPlainShiki(shiki).mount(commandInput.value!, shikiOptions as MountPlainShikiOptions)
})
</script>

<template>
    <code class="command">
        <span v-if="showPrompt" class="prompt">{{ prompt }}</span>
        <div
            ref="command-input"
            contenteditable="plaintext-only"
            class="code"
            @beforeinput="beforeInput($event as InputEvent)"
            @input="onInput($event as InputEvent)"
            v-text="command"
        />
        <div class="mask" />
        <button v-if="showUndo" v-tippy="'恢复原始内容'" class="operation" aria-label="恢复原始内容" @click="undo">
            <Icon name="ph:arrow-u-up-left-bold" />
        </button>
        <button ref="copy-btn" v-tippy="'复制'" class="operation" aria-label="复制">
            <Icon name="ph:copy-bold" />
        </button>
    </code>
</template>

<style lang="scss" scoped>
.command {
    display: flex;
    margin: 0.5rem 0;
    border: 1px solid var(--c-border);
    border-radius: 4px;
    background-color: var(--ld-bg-card);
    font-size: 0.8rem;
    line-height: 2.5;
    transition: border-color 0.2s;

    &:focus-within {
        border-color: var(--c-primary);

        .prompt {
            border-right-color: var(--c-primary);
            background-color: var(--c-primary-soft);
            color: var(--c-primary);
        }
    }

    .prompt {
        flex-shrink: 0;
        padding: 0 1em;
        border-right: 1px solid var(--c-border);
        border-radius: 3px 0 0 3px;
        background-color: var(--c-bg-2);
        color: var(--c-text-2);
        transition: all 0.2s;
    }

    .code {
        flex-grow: 1;
        position: relative;
        overflow-x: auto;
        padding: 0 1em;
        outline: none;
        white-space: nowrap;
        scrollbar-color: initial;
        scrollbar-width: initial;

        &::-webkit-scrollbar {
            height: 4px;
            cursor: default;
        }

        &::-webkit-scrollbar-thumb {
            background-color: var(--c-border);
            cursor: pointer;
        }
    }

    .mask {
        flex-shrink: 0;
        width: 1em;
        height: 2.5em;
        margin-left: -1em;
        border-radius: 2px;
        background-image: linear-gradient(to right, transparent, var(--ld-bg-card));
        pointer-events: none;
        z-index: 0;
    }

    .operation {
        flex-shrink: 0;
        position: relative;
        height: 2.5em;
        margin-left: -0.5em;
        padding: 0.5em;
        color: var(--c-text-2);
        transition: color, 0.2s;
        z-index: 0;

        &:hover {
            color: var(--c-primary);
        }
    }
}
</style>
