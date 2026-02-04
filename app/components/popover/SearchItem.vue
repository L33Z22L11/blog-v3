<script setup lang="ts">
import type { SearchResult } from 'minisearch'

interface SearchItem extends SearchResult {
	title: string
	content: string
	titles: string[]
	level: number
}

withDefaults(defineProps<Partial<SearchItem>>(), {
	titles: () => [],
	title: '',
})
</script>

<template>
<UtilLink :to="id" class="search-item">
	<hgroup class="text-creative">
		<span v-for="heading in [...titles, title]" :key="heading" class="title" v-html="highlightHtml(heading, queryTerms)" />
		<Icon v-if="level === 1" name="ph:file-text-bold" />
	</hgroup>
	<p v-if="content" class="content" v-html="highlightHtml(content, queryTerms)" />
</UtilLink>
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
}

.title:not(:first-child) {
	opacity: 0.5;
	transition: opacity 0.2s;

	.active & {
		opacity: 1;
	}

	&::before {
		content: " > ";
		opacity: 0.5;
	}
}

.title + .iconify {
	margin-inline-start: 0.2em;
}

.content {
	margin-top: 0.2em;
	font-size: 0.8em;
	white-space: pre-wrap;
	color: var(--c-text-2);
}
</style>
