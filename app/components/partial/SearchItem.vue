<script setup lang="ts">
import type { SearchResult } from 'minisearch'

interface SearchItem extends SearchResult {
	title: string
	content: string
	titles: string[]
	level: number
}

const props = defineProps<Partial<SearchItem>>()

const title = computed(() => [...props.titles ?? [], props.title].join(' > '))
const word = computed(() => props.queryTerms?.[0] ?? '')

const highlightTitle = computed(() => highlightHtml(title.value, word.value))
const highlightContent = computed(() => highlightHtml(props.content ?? '', word.value))
</script>

<template>
<ZRawLink :to="id" class="search-item">
	<div class="title text-creative">
		<Badge round :class="{ primary: level === 1 }">
			{{ level === 1 ? '文章' : `H${level}` }}
		</Badge>
		<span v-html="highlightTitle" />
	</div>
	<p class="content" v-html="highlightContent" />
</ZRawLink>
</template>

<style lang="scss" scoped>
.search-item {
	display: block;
	margin: 0.5em;
	padding: 0.5em 0.8em;
	border-radius: 0.5em;
	transition: background-color 0.2s;

	&.active {
		background-color: var(--c-bg-soft);
	}

	> .title {
		font-size: 1em;

		> .badge {
			margin-inline-end: 0.5em;
			font-size: 0.8em;

			&.primary {
				color: var(--c-primary);
			}
		}

		& + .content {
			margin-top: 0.2em;
		}
	}

	> .content {
		font-size: 0.8em;
		white-space: pre-wrap;
		color: var(--c-text-2);
	}
}

:deep(.highlight) {
	color: var(--c-primary);
}
</style>
