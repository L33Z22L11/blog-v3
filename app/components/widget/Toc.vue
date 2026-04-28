<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate({
	props: {
		tocTree: { type: Array as PropType<TocLink[]> },
	},
})

const { toc } = useArticle()
const scrollableEl = useTemplateRef('toc')
const { tocOffsets, activeHeadingId } = useToc(toc, computed(() => scrollableEl.value?.body))

function hasHeading(tocTree: TocLink, heading?: string): boolean {
	return tocTree.id === heading || !!tocTree.children?.some(child => hasHeading(child, heading))
}
</script>

<template>
<BlogWidget
	ref="toc"
	title="文章目录"
	shrink
	:style="{ minHeight: `clamp(4rem, ${tocOffsets.length}rem, 20rem)` }"
>
	<template #action>
		<!-- use <a> for anchor -->
		<a href="#main-content" aria-label="返回开头">
			<Icon name="tabler:arrow-bar-to-up" />
		</a>

		<a href="#twikoo" aria-label="评论区">
			<Icon name="tabler:message-dots" />
		</a>
	</template>

	<!-- 放在顶层会导致 Transition 失效 -->
	<DefineTemplate v-slot="{ tocTree }">
		<ol>
			<li
				v-for="(entry, index) in tocTree"
				:key="index"
				:class="{
					'has-active': hasHeading(entry, activeHeadingId),
					'active': entry.id === activeHeadingId,
				}"
			>
				<!-- 使用 <a> 确保键盘焦点切换 -->
				<a :href="`#${entry?.id}`" :title="entry.text">{{ entry.text }}</a>
				<ReuseTemplate v-if="entry.children" :toc-tree="entry.children" />
			</li>
		</ol>
	</DefineTemplate>

	<ReuseTemplate
		v-if="toc?.links.length"
		class="toc"
		:toc-tree="toc.links"
	/>
	<p v-else class="no-toc">
		暂无目录信息
	</p>
</BlogWidget>
</template>

<style lang="scss" scoped>
.toc {
	position: relative;

	&::before {
		content: "";
		position: absolute;
		inset: 0.3rem;
		width: 3px;
		border-radius: 1rem;
		background-color: var(--c-bg-soft);
	}
}

ol {
	padding-inline-start: 0.8rem;
}

li {
	opacity: 0.6;
	font-size: 0.94em;
	color: var(--c-text);
	transition: opacity 0.2s;

	&:hover {
		opacity: 0.94;
	}

	&.has-active, &.active {
		opacity: 1;
		font-size: 1em;
	}

	&.active::before {
		content: "";
		position: absolute;
		inset-inline-start: 0.3rem;
		margin: 0.2rem 0;
		padding: 0.6rem 1.5px;
		border-radius: 1rem;
		background-color: var(--c-primary);
	}

	> a {
		display: block;
		overflow: hidden;
		padding: 0.2em 0.5em;
		border-radius: 0.5em;
		white-space: nowrap;
		text-overflow: ellipsis;
		transition: all 0.2s;

		&:hover {
			background-color: var(--c-bg-soft);
		}
	}
}

.no-toc {
	padding: 1em;
	text-align: center;
	color: var(--c-text-3);
}
</style>
