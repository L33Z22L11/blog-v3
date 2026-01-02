<script setup lang="ts">
const props = withDefaults(defineProps<{
	code?: string
	language?: string
	filename?: string
	/** @deprecated Use `transformerNotationHighlight` instead */
	highlights?: number[]
	meta?: string
	class?: string
}>(), {
	code: '',
	language: 'text', // Nuxt Content 已经做了此处理
})

interface CodeblockMeta {
	icon?: string
	wrap?: boolean
	[meta: string]: string | boolean | undefined
}

const meta = computed(() => {
	if (!props.meta)
		return {}

	return props.meta.split(' ').reduce((acc: CodeblockMeta, item) => {
		const [key, value] = item.split('=')
		acc[key!] = value ?? true
		return acc
	}, {})
})

const appConfig = useAppConfig()
const compConf = computed(() => appConfig.component.codeblock)

const rows = computed(() => props.code.split('\n').length - 1)
const collapsible = computed(() => !meta.value.expand && rows.value > compConf.value.triggerRows)
const [isCollapsed, toggleCollapsed] = useToggle(collapsible.value)

const icon = computed(() => meta.value.icon || getFileIcon(props.filename) || getLangIcon(props.language))
const isWrap = ref(meta.value.wrap)
const byteSize = computed(() => formatBytes(new TextEncoder().encode(props.code).length))

const codeblock = useTemplateRef('codeblock')
const { copy, copied } = useCopy(codeblock)

const shikiStore = useShikiStore()
const rawHtml = ref(escapeHtml(props.code))

function getIndent() {
	if (meta.value.indent)
		return meta.value.indent

	if (['json', 'jsonc', 'yaml', 'yml'].includes(props.language))
		return 2

	return compConf.value.indent
}

onMounted(async () => {
	const shiki = await shikiStore.load()
	await shikiStore.loadLang(props.language)
	// 处理 Markdown 高亮内代码块中的语言
	// 加载 TeX 语言有概率导致 LaTeX 语言高亮炸掉
	if (props.language === 'markdown' || props.language.startsWith('md')) {
		const mdLangRegex = /^\s*`{3,}(\S+)/gm
		const langs = Array
			.from(props.code.matchAll(mdLangRegex))
			.map(match => match[1])
			.filter(lang => lang !== undefined)
		await shikiStore.loadLang(...langs)
	}

	rawHtml.value = shiki.codeToHtml(
		props.code.trimEnd(),
		shikiStore.getOptions(
			props.language,
			[compConf.value.enableIndentGuide ? 'ignoreRenderWhitespace' : 'ignoreRenderIndentGuides'],
			{ meta: { indent: getIndent() } },
		),
	)
})
</script>

<template>
<figure
	class="z-codeblock"
	:class="{ collapsed: collapsible && isCollapsed, collapsible }"
	:style="{
		'--collapsed-rows': compConf.collapsedRows,
		'--tab-size': meta.indent as string || compConf.tabSize,
	}"
>
	<figcaption>
		<span v-if="filename" class="filename">
			<Icon :name="icon" /> {{ filename }}
		</span>
		<span v-else />
		<!-- 语言不采用绝对定位，因为和文件名占据互斥空间 -->
		<span v-if="language" class="language">{{ language }}</span>
		<div class="operations">
			<button @click="isWrap = !isWrap">
				{{ isWrap ? '横向滚动' : '自动换行' }}
			</button>
			<button @click="copy()">
				{{ copied ? '已复制' : '复制' }}
			</button>
		</div>
	</figcaption>

	<!-- 嘿嘿，不要换行 -->
	<pre
		ref="codeblock"
		class="shiki scrollcheck-x"
		:class="[props.class, { wrap: isWrap }]"
		v-html="rawHtml"
	/>

	<button
		v-if="collapsible"
		class="toggle-btn"
		:aria-label="isCollapsed ? '展开代码块' : '折叠代码块'"
		@click="toggleCollapsed()"
	>
		<Icon
			class="toggle-icon"
			:class="{ 'is-collapsed': isCollapsed }"
			name="ph:caret-double-up-bold"
		/>
		<span>{{ rows }} lines, {{ props.code.length }} chars, {{ byteSize }}</span>
	</button>
</figure>
</template>

<style lang="scss" scoped>
.z-codeblock {
	--line-height: 1.4;

	contain: paint;
	margin: 0.5em 0;
	border-radius: 0.5em;
	background-color: var(--c-bg-2);
	font-size: 0.8125rem;
	line-height: 1.4;
	tab-size: var(--tab-size, 4);

	&.collapsed > pre {
		overflow: hidden;
		max-height: calc(var(--line-height) * var(--collapsed-rows) * 1em + 2rem);
		mask-image: linear-gradient(to top, transparent 1em, #FFF 4em);
		animation: none;
	}
}

figcaption {
	display: flex;
	justify-content: space-between;
	gap: 1em;
	position: sticky;
	top: 0;
	padding: 0 1em;
	z-index: 2;

	> .filename {
		padding: 0.2em 0.8em;
		border-radius: 0 0 0.5em 0.5em;
		background-color: var(--c-border);
		word-break: break-all;
	}

	> .language {
		opacity: 0.4;
		height: 0;
		transform: translateY(0.2em);
	}

	> .operations {
		position: absolute;
		opacity: 0;
		inset-inline-end: 0;
		padding: 0 0.6em;
		border-end-start-radius: 0.5em;
		background-color: var(--c-bg-2);
		transition: opacity 0.2s;

		:hover > & {
			opacity: 1;
		}

		> button {
			opacity: 0.4;
			padding: 0.2em 0.4em;
			transition: opacity 0.2s;

			&:hover {
				opacity: 1;
			}
		}
	}
}

pre {
	// 如果填写 0 会在 calc() 时出错
	--start-offset: 4em;

	padding: 1rem;
	padding-inline-start: var(--start-offset);

	&.wrap {
		white-space: pre-wrap;
	}
}

:deep(.line) {
	&.diff {
		background-color: var(--ld-bg-active);

		&.add {
			--line-indicator: "+ ";
			--line-indicator-color: var(--c-success);
			--ld-bg-active: var(--c-success-soft);
		}

		&.remove {
			--line-indicator: "- ";
			--line-indicator-color: var(--c-error);
			--ld-bg-active: var(--c-error-soft);
		}
	}

	&.highlighted {
		--line-indicator-color: var(--c-text-1);

		background-color: var(--ld-bg-active);

		&.error {
			--line-indicator-color: var(--c-error);
			--ld-bg-active: var(--c-error-soft);
		}

		&.warning {
			--line-indicator-color: var(--c-warning);
			--ld-bg-active: var(--c-warning-soft);
		}
	}

	&.focused {
		--line-indicator: "→ ";
		--line-indicator-color: var(--c-text-1);

		display: inline-block;
		position: relative;
		box-shadow: 0 0 10rem 4rem var(--c-bg-2);
		transition: box-shadow 0.2s;

		@supports (color: color-mix(in srgb, transparent, transparent)) {
			box-shadow: 0 0 0 100vmax color-mix(in srgb, transparent, var(--c-bg-2));
		}

		pre:hover > & {
			box-shadow: none;
		}
	}

	// 行指示器
	&::before {
		content: var(--line-indicator, "") attr(data-line);
		position: fixed;
		inset-inline-start: 0;
		width: var(--start-offset);
		padding-inline-end: 1em;
		background-color: var(--c-bg-2);
		text-align: end;
		color: var(--line-indicator-color, var(--c-text-3));
		z-index: 1;
	}

	> .highlighted-word {
		border-radius: 0.2em;
		box-shadow: inset 0 0 0 1em var(--ld-bg-active);
	}
}

.toggle-btn {
	display: block;
	position: relative; // 移动到 pre 上方
	opacity: 0.3;
	width: 100%;
	margin-top: -1em;
	padding: 0.2em;
	background-color: var(--c-bg-3);
	transition: opacity 0.2s;

	&:hover {
		opacity: 1;
	}
}

.toggle-icon {
	transition: all 0.2s;
	margin-inline-end: 0.2em;

	&.is-collapsed {
		transform: rotate(180deg);
	}
}
</style>
