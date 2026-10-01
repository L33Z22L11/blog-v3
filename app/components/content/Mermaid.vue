<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = defineProps<{
	code: string
	caption?: string
	meta?: string
}>()

const colorMode = useColorMode()
const container = useTemplateRef('mermaid')
const modalContent = useTemplateRef('modalContent')
const [DefineModal, Modal] = createReusableTemplate<{ open: boolean, style: CSSProperties }>({ inheritAttrs: false })
const { open, close, status } = useModalStore().use(() => h(Modal), { unique: true })
const expanded = computed(() => !!modalContent.value)
const placeholderHeight = ref(0)
const rotation = ref(0)

function expand() {
	if (status.value !== 'closed')
		return
	placeholderHeight.value = container.value?.offsetHeight ?? 0
	rotation.value = 0
	open()
}

onKeyStroke('Escape', () => status.value === 'open' && close())
onScopeDispose(() => status.value !== 'closed' && close())

const id = useId()
// Mermaid 会移除同 id 的旧 SVG，主题重绘时使用新 id。
let renderCount = 0
const isVisible = useElementVisibility(container, { rootMargin: '50%' })
const shouldRender = ref(false)
whenever(isVisible, () => shouldRender.value = true, { once: true })

const diagram = computedAsync<{ svg?: string, error?: string }>(async () => {
	const { code } = props
	const darkMode = colorMode.value === 'dark'
	if (!shouldRender.value)
		return {}

	try {
		const { default: mermaid } = await import('mermaid')
		await Promise.all([nextTick(), document.fonts.ready])
		mermaid.initialize({
			fontFamily: 'inherit',
			flowchart: { padding: 8, minNodeWidth: 0 },
			sequence: { width: 100 },
			theme: darkMode ? 'redux-dark-color' : 'redux-color',
			startOnLoad: false,
			suppressErrorRendering: true,
		})
		const { svg } = await mermaid.render(`${id}-${renderCount++}`, code)
		const element = new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('svg')!
		element.setAttribute('width', String(element.viewBox.baseVal.width))
		element.style.removeProperty('max-width')
		return { svg: element.outerHTML }
	}
	catch (error) {
		return { error: error instanceof Error ? error.message : String(error) }
	}
}, {})

const displaySvg = computed(() => {
	if (!expanded.value || !rotation.value || !diagram.value.svg)
		return diagram.value.svg

	const svg = new DOMParser().parseFromString(diagram.value.svg, 'image/svg+xml').querySelector('svg')!
	const { x, y, width, height } = svg.viewBox.baseVal
	const cx = x + width / 2
	const cy = y + height / 2
	const [w, h] = rotation.value % 180 ? [height, width] : [width, height]
	const group = svg.ownerDocument.createElementNS(svg.namespaceURI, 'g')
	group.setAttribute('transform', `rotate(${rotation.value} ${cx} ${cy})`)
	group.append(...svg.childNodes)
	svg.append(group)
	svg.setAttribute('viewBox', `${cx - w / 2} ${cy - h / 2} ${w} ${h}`)
	svg.setAttribute('width', String(w))
	svg.setAttribute('height', String(h))
	return svg.outerHTML
})
</script>

<template>
<DefineModal v-slot="{ open: visible, style }">
	<Transition name="float-in">
		<Tab v-if="visible" class="mermaid-modal" :style :tabs="['图表', '源代码']" role="dialog" aria-modal="true" :aria-label="caption || meta || 'Mermaid 图表'">
			<template #prefix>
				<button type="button" class="rotate" aria-label="顺时针旋转图表" title="顺时针旋转 90°" @click="rotation = (rotation + 90) % 360">
					<Icon name="tabler:rotate-clockwise" />
				</button>
			</template>
			<template #suffix>
				<button type="button" class="close" aria-label="关闭图表" @click="close()">
					<Icon name="tabler:x" />
				</button>
			</template>
			<template #tab1>
				<div ref="modalContent" />
			</template>
			<template #tab2>
				<ProsePre :code language="mermaid" meta="expand" />
			</template>
		</Tab>
	</Transition>
</DefineModal>

<figure ref="mermaid" class="mermaid-diagram" :style="{ minHeight: expanded ? `${placeholderHeight}px` : undefined }">
	<!-- SVG 只在一处显示，保留选字和样式继承，避免重复 SVG id。 -->
	<Teleport v-if="diagram.svg" :to="modalContent || 'body'" :disabled="!expanded">
		<div
			class="mermaid-content"
			:class="{ preview: !expanded }"
			:tabindex="expanded ? undefined : 0"
			:role="expanded ? undefined : 'button'"
			:aria-label="expanded ? undefined : '放大Mermaid 图表'"
			@click="expand()"
			@keydown.enter="expand()"
			@keydown.space.prevent="expand()"
			v-html="displaySvg"
		/>
	</Teleport>
	<template v-else-if="diagram.error">
		<details class="mermaid-error">
			<summary>图表渲染失败，查看错误详情</summary>
			<pre>{{ diagram.error }}</pre>
		</details>
		<ProsePre :code language="mermaid" meta="wrap" />
	</template>
	<figcaption v-if="caption || meta">
		{{ caption || meta }}
	</figcaption>
</figure>
</template>

<style scoped>
/* 不可命名为 .mermaid：mermaid 会按此类名自动扫描并接管元素 */
.mermaid-diagram {
	margin: 0.5em 0;
}

.mermaid-diagram > figcaption {
	margin-top: 0.5em;
	font-size: 0.8em;
	text-align: center;
	color: var(--c-text-2);
}

.mermaid-content {
	width: fit-content;
	margin-inline: auto;
	line-height: 1.4;

	&.preview {
		max-width: 100%;
		cursor: zoom-in;
		user-select: none;
	}

	&:not(.preview) {
		padding: 1rem;
	}

	:deep(svg) {
		display: block;
		height: auto;
		max-width: none;
	}

	&.preview :deep(svg) {
		max-width: 100%;
	}
}

.mermaid-modal {
	position: fixed;
	overflow: clip;
	inset: 0;
	width: fit-content;
	height: fit-content;
	min-width: min(24rem, 90vw);
	max-width: 90vw;
	max-height: 90dvh;
	margin: auto;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	box-shadow: var(--box-shadow-2), var(--box-shadow-3);
	background-color: var(--c-bg);

	&.float-in-leave-active {
		position: fixed !important;
	}

	.close,
	.rotate {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		inset: 0.5rem 0.5rem auto auto;
		width: 2rem;
		height: 2rem;
		border-radius: 0.4em;
		color: var(--c-text-3);
		cursor: pointer;

		&:hover,
		&:focus-visible {
			background-color: var(--c-bg-soft);
			color: var(--c-primary);
		}
	}

	.rotate {
		inset-inline: 0.5rem auto;
	}

	:deep(.tabs) {
		align-items: center;
		width: auto;
		height: 3rem;
		padding-inline: 3rem;

		> button {
			margin-bottom: 0;
		}
	}

	:deep(.tab-content) {
		overflow: auto;
		max-height: calc(90dvh - 3rem);
		margin: 0;
		scrollbar-width: thin;
	}

	:deep(.z-codeblock) {
		margin: 0;
		border-radius: 0;
	}
}

.mermaid-error {
	font-size: 0.85em;
	color: var(--c-text-2);

	summary {
		color: var(--c-error);
		cursor: pointer;
	}

	pre {
		overflow-wrap: anywhere;
		white-space: pre-wrap;
	}
}
</style>
