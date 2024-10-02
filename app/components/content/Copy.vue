<script setup lang="ts">
import { createPlainShiki, type MountPlainShikiOptions } from 'plain-shiki'
import { useTippy } from 'vue-tippy'

const props = defineProps<{
    code?: string
    noprompt?: boolean
    prompt?: string
    command?: string
    language?: string
}>()

// FIXME: Slot "default" invoked outside of the render function
const slots = defineSlots()

const prompt = computed(() => props.noprompt ? '' : props.prompt ?? '$')
const language = computed(() => props.language ?? getPromptLanguage(prompt.value))

const initialCommand = computed(() => slots.default?.()[0]?.children ?? props.command)
const command = ref(initialCommand.value)
const showUndo = ref(false)
const commandInput = useTemplateRef('command-input')
const copyBtn = useTemplateRef('copy-btn')

useTippy(commandInput as Ref<Element>, { content: '可以修改命令后再复制', trigger: 'focus' })
useCopy(copyBtn, commandInput)

watch(command, (newVal) => {
    showUndo.value = newVal !== initialCommand.value
})

function undo() {
    commandInput.value!.textContent = initialCommand.value
    commandInput.value?.dispatchEvent(new Event('input'))
    showUndo.value = false
}

function beforeInput(event: InputEvent) {
    const { data, inputType } = event
    if (data?.includes('\n') || inputType === 'insertLineBreak') {
        event.preventDefault()
        showTooltipMessage(event.target as HTMLElement, '不支持换行')
    }
}

function onInput(event: InputEvent) {
    command.value = (event.target as HTMLElement).textContent
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
        <span v-if="!noprompt" class="prompt">{{ prompt }}</span>
        <div
            ref="command-input"
            contenteditable="plaintext-only"
            class="code scrollcheck-x"
            @beforeinput="beforeInput($event as InputEvent)"
            @input="onInput($event as InputEvent)"
            v-text="initialCommand"
        />
        <button v-if="showUndo" class="operation" @click="undo">
            <Icon name="ph:arrow-u-up-left-bold" />
        </button>
        <button ref="copy-btn" v-tippy="'复制'" class="operation">
            <Icon name="ph:copy-bold" />
        </button>
    </code>
</template>

<style scoped lang="scss">
.command {
    display: flex;
    overflow: hidden;
    margin: 0.5rem 0;
    border: 1px solid var(--c-border);
    border-radius: 0.5em;
    background-color: var(--ld-bg-card);
    font-size: 0.8rem;
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
        padding: 0 0.8em;
        background-color: var(--ld-bg-card);
        white-space: nowrap;
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
