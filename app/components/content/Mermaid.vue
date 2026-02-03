<script setup lang="ts">
import { useColorMode } from '#imports'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

type Theme = 'default' | 'base' | 'dark' | 'forest' | 'neutral' | 'null'

interface Props {
	code: string
	theme?: Theme
}

const props = withDefaults(defineProps<Props>(), {
	theme: 'default',
})

const container = ref<HTMLElement | null>(null)
const colorMode = useColorMode()

const actualTheme = computed(() => {
	const preference = colorMode.value
	return preference === 'dark' ? 'dark' : 'default'
})

let renderId = 0
let renderTimeout: ReturnType<typeof setTimeout> | null = null
let mermaidModule: typeof import('mermaid') | null = null

async function getMermaid() {
	if (!mermaidModule) {
		mermaidModule = await import('mermaid')
	}
	return mermaidModule
}

async function renderMermaid() {
	if (!container.value)
		return

	const currentId = ++renderId
	const theme = actualTheme.value

	try {
		const mermaid = await getMermaid()
		mermaid.default.initialize({
			startOnLoad: false,
			theme,
		})

		const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`
		container.value.innerHTML = `<div class="mermaid" id="${id}">${props.code}</div>`

		await nextTick()

		const targetNode = container.value.querySelector(`#${id}`) as HTMLElement | null
		if (!targetNode || renderId !== currentId)
			return

		await mermaid.default.run({
			nodes: [targetNode],
		})
	}
	catch (error) {
		console.error('Mermaid render error:', error)
		if (renderId === currentId) {
			container.value.innerHTML = `<pre class="mermaid-error">${props.code}</pre>`
		}
	}
}

function debouncedRender() {
	if (renderTimeout) {
		clearTimeout(renderTimeout)
	}
	renderTimeout = setTimeout(() => {
		renderMermaid()
	}, 100)
}

onMounted(async () => {
	await nextTick()
	await renderMermaid()
})

onUnmounted(() => {
	if (renderTimeout) {
		clearTimeout(renderTimeout)
	}
})

watch(actualTheme, debouncedRender)

watch(() => props.code, async () => {
	await nextTick()
	await renderMermaid()
})
</script>

<template>
<div ref="container" class="mermaid-container" />
</template>

<style lang="scss" scoped>
.mermaid-container {
	overflow-x: auto;
	width: 100%;
	margin: 1em 0;
	text-align: center;

	:deep(svg) {
		height: auto;
		max-width: 100%;
	}
}

.mermaid-error {
	padding: 1em;
	border-radius: 4px;
	background: var(--color-danger-bg);
	color: var(--color-danger);
}
</style>
