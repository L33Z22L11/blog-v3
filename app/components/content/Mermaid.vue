<script setup lang="ts">
import { useColorMode } from '#imports'
import { useDark } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

type MermaidTheme = 'default' | 'base' | 'dark' | 'forest' | 'neutral' | 'null'

interface Props {
	code: string
	theme?: MermaidTheme
}

const props = withDefaults(defineProps<Props>(), {
	theme: 'default',
})

const container = ref<HTMLElement | null>(null)
const colorMode = useColorMode()
const isDark = useDark()

const actualTheme = computed(() => {
	const preference = colorMode.preference

	if (preference === 'system')
		return isDark.value ? 'dark' : 'default'

	return preference === 'dark' ? 'dark' : 'default'
})

let renderId = 0

async function renderMermaid() {
	if (!container.value)
		return

	const currentId = ++renderId
	const theme = actualTheme.value || 'default'

	try {
		const mermaid = await import('mermaid')
		mermaid.default.initialize({
			startOnLoad: false,
			theme,
		})

		const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`
		container.value.innerHTML = `<div class="mermaid" id="${id}">${props.code}</div>`

		await nextTick()

		const targetNode = container.value.querySelector(`#${id}`) as HTMLElement | null
		if (!targetNode)
			return

		if (renderId !== currentId)
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

onMounted(async () => {
	await nextTick()
	await renderMermaid()
})

watch(actualTheme, async () => {
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
