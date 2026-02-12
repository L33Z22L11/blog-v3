<script setup lang="ts">
import { useColorMode } from '#imports'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type Theme = 'default' | 'base' | 'dark' | 'forest' | 'neutral' | 'null'

interface Props {
	code: string
	theme?: Theme
}

const props = withDefaults(defineProps<Props>(), {
	theme: 'default',
})

const container = ref<HTMLElement | null>(null)
const mermaidWrapper = ref<HTMLElement | null>(null)
const colorMode = useColorMode()

const actualTheme = computed(() => {
	const preference = colorMode.value
	return preference === 'dark' ? 'dark' : 'default'
})

// 渲染状态
type RenderStatus = 'idle' | 'loading' | 'success' | 'error' | 'fallback'
const status = ref<RenderStatus>('idle')

// 渲染令牌
let renderToken = 0

// SVG 缓存
const svgCache = new Map<string, string>()
const CACHE_MAX_SIZE = 50

let mermaidModule: typeof import('mermaid') | null = null

// 并行渲染限制
let activeRenderCount = 0
const MAX_CONCURRENT_RENDERS = 2

// cache key 生成
function getCacheKey(code: string, theme: string): string {
	let hash = 0
	for (let i = 0; i < code.length; i++) {
		const char = code.charCodeAt(i)
		hash = ((hash << 5) - hash) + char
		hash = hash & hash
	}
	return `${hash}-${theme}`
}

async function getMermaid() {
	if (!mermaidModule) {
		mermaidModule = await import('mermaid')
	}
	return mermaidModule
}

function shouldContinue(token: number): boolean {
	return token === renderToken
		&& !!container.value
		&& !!container.value.parentNode
}

// 是否为 Mermaid 自身的可忽略错误
function isMermaidLayoutError(err: unknown): boolean {
	const message = err instanceof Error ? err.message : String(err)
	return message.includes('Could not find a suitable point')
		|| message.includes('Cannot get CSS layout')
}

async function renderMermaid() {
	const token = ++renderToken

	if (!shouldContinue(token))
		return

	// 并行渲染限制
	if (activeRenderCount >= MAX_CONCURRENT_RENDERS) {
		// 延迟执行
		setTimeout(() => {
			if (shouldContinue(token + 1)) {
				void renderMermaid()
			}
		}, 100)
		return
	}

	activeRenderCount++
	status.value = 'loading'

	try {
		const mermaid = await getMermaid()
		const code = props.code
		const theme = String(actualTheme.value)
		const cacheKey = getCacheKey(code, theme)

		// 检查缓存
		const cachedSvg = svgCache.get(cacheKey)
		if (cachedSvg && shouldContinue(token)) {
			mermaidWrapper.value!.innerHTML = cachedSvg
			status.value = 'success'
			return
		}

		mermaid.default.initialize({
			startOnLoad: false,
			theme: theme as 'default' | 'dark',
			securityLevel: 'loose',
			fontFamily: 'inherit',
		})

		if (!shouldContinue(token))
			return

		if (mermaidWrapper.value) {
			mermaidWrapper.value.innerHTML = `<div class="mermaid">${code}</div>`
		}

		if (!shouldContinue(token))
			return

		const mermaidDiv = mermaidWrapper.value?.querySelector('.mermaid') as HTMLElement | null | undefined
		if (mermaidDiv) {
			await mermaid.default.run({
				nodes: [mermaidDiv],
			})
		}

		if (!shouldContinue(token))
			return

		// 获取渲染后的 SVG
		const svgElement = mermaidWrapper.value?.querySelector('svg') as HTMLElement | null
		if (svgElement) {
			const svgHtml = svgElement.outerHTML

			// 存入缓存
			if (svgCache.size >= CACHE_MAX_SIZE) {
				// 清理最旧的缓存
				const firstKey = svgCache.keys().next().value
				if (firstKey !== undefined) {
					svgCache.delete(firstKey)
				}
			}
			svgCache.set(cacheKey, svgHtml)

			status.value = 'success'
		}
		else {
			status.value = 'fallback'
		}
	}
	catch (err) {
		console.error('Mermaid render error:', err)

		if (!shouldContinue(token))
			return

		if (isMermaidLayoutError(err)) {
			status.value = 'fallback'
		}
		else {
			status.value = 'error'
		}
	}
	finally {
		activeRenderCount--
	}
}

function retry() {
	void renderMermaid()
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let intersectionObserver: IntersectionObserver | null = null
let isVisible = false

function debouncedRender() {
	if (debounceTimer) {
		clearTimeout(debounceTimer)
	}
	debounceTimer = setTimeout(() => {
		void renderMermaid()
	}, 200)
}

onMounted(() => {
	// 创建 Intersection Observer 实现懒加载
	intersectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					isVisible = true
					void renderMermaid()
					intersectionObserver?.disconnect()
				}
			})
		},
		{
			rootMargin: '200px', // 提前 200px 开始加载
			threshold: 0,
		},
	)

	if (container.value) {
		intersectionObserver.observe(container.value)
	}
})

onUnmounted(() => {
	renderToken++
	if (debounceTimer) {
		clearTimeout(debounceTimer)
	}
	intersectionObserver?.disconnect()
})

// 监听主题变化
watch(actualTheme, () => {
	// 主题变化时，如果有缓存则直接使用
	const code = props.code
	const theme = String(actualTheme.value)
	const cacheKey = getCacheKey(code, theme)

	const cachedSvg = svgCache.get(cacheKey)
	if (cachedSvg && mermaidWrapper.value) {
		mermaidWrapper.value.innerHTML = cachedSvg
		status.value = 'success'
	}
	else {
		debouncedRender()
	}
})

watch(() => props.code, () => {
	debouncedRender()
})
</script>

<template>
<div ref="container" class="mermaid-container">
	<!-- loading -->
	<div v-show="status === 'loading' && isVisible" class="mermaid-loading">
		<div class="mermaid-loading-spinner" />
		<span class="mermaid-loading-text">Rendering...</span>
	</div>

	<!-- 错误状态 -->
	<div v-show="status === 'error' && isVisible" class="mermaid-error">
		<p class="mermaid-error-text">
			Render failed
		</p>
		<button class="mermaid-retry-btn" @click="retry">
			Retry
		</button>
		<pre class="mermaid-error-code">{{ props.code }}</pre>
	</div>

	<!-- 降级显示 -->
	<div v-show="status === 'fallback' && isVisible" class="mermaid-fallback">
		<pre class="mermaid-fallback-code">{{ props.code }}</pre>
	</div>

	<!-- mermaid 渲染区 -->
	<div ref="mermaidWrapper" class="mermaid-wrapper" />
</div>
</template>

<style lang="scss" scoped>
.mermaid-container {
	overflow-x: auto;
	width: 100%;
	margin: 1em 0;
	text-align: center;
	min-height: 40px;

	:deep(svg) {
		height: auto;
		max-width: 100%;
	}
}

.mermaid-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.75rem;
	padding: 1rem;
}

.mermaid-loading-spinner {
	width: 24px;
	height: 24px;
	border: 3px solid #e5e7eb;
	border-top-color: #3b82f6;
	border-radius: 50%;
	animation: spin 0.8s linear infinite;
}

.mermaid-loading-text {
	color: #6b7280;
	font-size: 0.875rem;
}

.mermaid-error {
	padding: 1.25em;
	border-radius: 8px;
	background: var(--color-danger-bg);
	color: var(--color-danger);
	width: 100%;
	text-align: left;

	.mermaid-error-text {
		margin-bottom: 0.75rem;
		font-size: 0.875rem;
	}

	.mermaid-error-code {
		margin-top: 1rem;
		padding: 0.75rem;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.05);
		font-size: 0.75rem;
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.mermaid-retry-btn {
		padding: 0.5em 1em;
		border: 1px solid var(--color-danger);
		border-radius: 4px;
		background: transparent;
		color: var(--color-danger);
		cursor: pointer;
		font-size: 0.875rem;

		&:hover {
			background: var(--color-danger);
			color: var(--color-bg);
		}
	}
}

.mermaid-fallback {
	padding: 1em;
	background: var(--color-code-bg);
	border-radius: 4px;
	text-align: left;
	overflow-x: auto;

	.mermaid-fallback-code {
		margin: 0;
		font-size: 0.75rem;
		white-space: pre;
		word-break: break-all;
	}
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
