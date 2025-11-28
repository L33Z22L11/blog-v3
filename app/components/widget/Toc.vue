<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const contentStore = useContentStore()
const { toc } = storeToRefs(contentStore)
const { activeTocItem } = useTocAutoHighlight(() => toc.value?.links ?? [])

function hasActiveChild(entry: TocLink, activeId: string | null): boolean {
	if (entry.id === activeId)
		return true
	return entry.children?.some(child => hasActiveChild(child, activeId)) ?? false
}
</script>

<template>
<BlogWidget>
	<template #title>
		<span class="title">文章目录</span>
		<!-- use <a> for anchor -->
		<a href="#main-content" aria-label="返回开头">
			<Icon name="ph:arrow-circle-up-bold" />
		</a>

		<a href="#twikoo" aria-label="评论区">
			<Icon name="ph:chat-circle-text-bold" />
		</a>
	</template>

	<!-- 放在顶层会导致 Transition 失效 -->
	<DefineTemplate v-slot="{ tocItem }">
		<ol>
			<li
				v-for="(entry, index) in tocItem as TocLink[]"
				:key="index"
				:class="{
					'has-active': hasActiveChild(entry, activeTocItem),
					'active': entry.id === activeTocItem,
				}"
			>
				<!-- 使用 <a> 确保键盘焦点切换 -->
				<a :href="`#${entry?.id}`" :title="entry.text">{{ entry.text }}</a>
				<ReuseTemplate v-if="entry.children" :toc-item="entry.children" />
			</li>
		</ol>
	</DefineTemplate>

	<UtilHydrateSafe>
		<ReuseTemplate v-if="toc?.links.length" :toc-item="toc.links" />
		<p v-else class="no-toc">
			暂无目录信息
		</p>
	</UtilHydrateSafe>
</BlogWidget>
</template>

<style lang="scss" scoped>
:deep(.widget-body) {
	position: relative;

	&::before {
		content: "";
		position: absolute;
		inset: 0.3rem;
		width: 3px;
		border-radius: 1rem;
		background-color: var(--c-bg-3);
	}

	li {
		opacity: 0.6;
		margin-inline-start: 0.8rem;
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

		a {
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
}

.title {
	flex-grow: 1;
}

.no-toc {
	padding: 1em;
	text-align: center;
	color: var(--c-text-3);
}
</style>
