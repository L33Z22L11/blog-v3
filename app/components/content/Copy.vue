<script setup lang="ts">
import type { MountPlainShikiOptions } from 'plain-shiki'
import { createPlainShiki } from 'plain-shiki'

const props = withDefaults(defineProps<{
	prompt?: string | boolean
	code?: string
	lang?: string
}>(), {
	prompt: '$',
})

// prompt 传入空字符串会变成 true
const showPrompt = computed(() => props.prompt !== true)
const language = computed(() => props.lang ?? getPromptLanguage(props.prompt))

const showUndo = ref(false)
const codeInput = useTemplateRef('code-input')
const shikiStore = useShikiStore()

const { copy, copied } = useCopy(codeInput)

function undo() {
	if (!codeInput.value)
		return
	codeInput.value.textContent = props.code ?? ''
	// 触发 shiki 高亮
	codeInput.value.dispatchEvent(new Event('input'))
	showUndo.value = false
}

function beforeInput(event: InputEvent) {
	const { data, inputType } = event
	if (data?.includes('\n') || inputType === 'insertLineBreak') {
		event.preventDefault()
	}
}

function onInput(event: InputEvent) {
	showUndo.value = props.code !== (event.target as Element).textContent
}

onMounted(async () => {
	const shiki = await shikiStore.load()

	await shikiStore.loadLang(language.value)
	createPlainShiki(shiki).mount(
		codeInput.value!,
		shikiStore.getOptions(language.value) as MountPlainShikiOptions,
	)
})
</script>

<template>
<code class="copy">
	<span v-if="showPrompt" class="prompt">{{ prompt }}</span>

	<div
		ref="code-input"
		contenteditable="plaintext-only"
		class="code scrollcheck-x"
		spellcheck="false"
		@beforeinput="beforeInput($event as InputEvent)"
		@input="onInput($event as InputEvent)"
		v-text="code"
	/>

	<button v-if="showUndo" class="operation" aria-label="恢复原始内容" @click="undo">
		<Icon name="ph:arrow-u-up-left-bold" />
	</button>

	<button class="operation" aria-label="复制" @click="copy()">
		<Icon :name="copied ? 'ph:check-bold' : 'ph:copy-bold'" />
	</button>
</code>
</template>

<style lang="scss" scoped>
.copy {
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
		outline: 0.2em solid var(--c-primary-soft);

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
		--fadeout-width: 3ch;
		--scrollbar-height: 4px;

		flex-grow: 1;
		position: relative;
		overflow-x: auto;
		padding: 0 1em;
		outline: none;
		white-space: nowrap;
		scrollbar-color: auto;
		scrollbar-width: auto;

		&::-webkit-scrollbar {
			height: 4px;
			background-color: transparent;
		}
	}

	.operation {
		flex-shrink: 0;
		height: 2.5em;
		margin-left: -0.5em;
		padding: 0.5em;
		color: var(--c-text-2);
		transition: color, 0.2s;

		&:hover {
			color: var(--c-primary);
		}
	}
}
</style>
