<script setup lang="ts">
const props = withDefaults(defineProps<{
	code?: string
	language?: string
	filename?: string
	highlights?: number[]
	meta?: string
	class?: string
}>(), {
	code: '',
	language: 'text', // Nuxt Content 已经做了此处理
	highlights: () => [],
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

const rows = computed(() => props.code.split('\n').length - 1)
const collapsible = computed(() => !meta.value.expand && rows.value > appConfig.content.codeblockCollapsibleRows)
const [isCollapsed, toggleCollapsed] = useToggle(collapsible.value)

const icon = computed(() => meta.value.icon || getFileIcon(props.filename) || getLangIcon(props.language))
const isWrap = ref(meta.value.wrap)

const codeblock = useTemplateRef('codeblock')
const { copy, copied } = useCopy(codeblock)

const shikiStore = useShikiStore()
const rawHtml = ref(escapeHtml(props.code))

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
		shikiStore.getOptions(props.language),
	)
})
</script>

<template>
<figure
	class="z-codeblock"
	:class="{ collapsed: collapsible && isCollapsed, collapsible }"
	:style="{ '--collapsible-height': `${appConfig.content.codeblockCollapsibleRows}em` }"
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
		<span class="toggle-tip">{{ rows }} 行</span>
	</button>
</figure>
</template>

<style lang="scss" scoped>
.z-codeblock {
	position: relative;
	overflow: clip;
	border-radius: 0.5em;
	background-color: var(--c-bg-2);
	font-size: 0.8125rem;
	line-height: 1.4;

	&.collapsed {
		pre {
			overflow: hidden;
			max-height: var(--collapsible-height);
			mask-image: linear-gradient(to top, transparent 2rem, #FFF 4rem);
			animation: none;
		}

		.toggle-btn {
			margin: 0.5em;
		}
	}

	&.collapsible pre {
		padding-bottom: 2rem;
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
		top: 0;
		right: 0;
		padding: 0 0.6em;
		border-bottom-left-radius: 0.5em;
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
	--left-offset: 4em;

	overflow: auto;
	padding: 1rem;
	padding-left: var(--left-offset);

	&.wrap {
		white-space: pre-wrap;
	}
}

:deep(.line) {
	&::before {
		content: attr(data-line);
		position: absolute;
		left: 0;
		width: var(--left-offset);
		padding-right: 1em;
		background-color: var(--c-bg-2);
		text-align: right;
		color: var(--c-text-3);
		z-index: 1;
	}

	&.highlight {
		&::before {
			color: inherit;
		}

		outline: 0.2em solid var(--ld-bg-active);
		background-color: var(--ld-bg-active);
	}
}

.toggle-btn {
	position: absolute;
	inset: auto 0 0;
	margin: 0.8em;
	padding: 0.2em;
	border-radius: 0.5em;
	background-color: var(--c-bg-3);
	text-align: center;
	color: var(--c-text-2);
}

.toggle-icon {
	transition: all 0.2s;

	&.is-collapsed {
		transform: rotate(180deg);
	}

	:hover > & {
		opacity: 0;
	}
}

.toggle-tip {
	position: absolute;
	opacity: 0;
	inset: auto 0;
	transition: opacity 0.2s;

	:hover > & {
		opacity: 1;
	}
}
</style>
