<script setup lang="ts">
const props = defineProps<{
	totalPages: number
	expandPages?: number
	sticky?: boolean
	avoid?: boolean
}>()

const page = defineModel<number>({ required: true })
const pageArr = computed(() => getPaginationIndicator(page.value, props.totalPages, props.expandPages ?? 2))

const paginationEl = useTemplateRef('pagination')
const anchorEl = useTemplateRef('pagination-anchor')
const expand = useElementVisibility(anchorEl)

if (props.avoid) {
	useAvoidTarget(paginationEl, toRef(props, 'avoid'))
}

if (import.meta.client) {
	useEventBus<'capture' | 'finish'>('page-transition').on((phase) => {
		const element = paginationEl.value
		if (!element)
			return
		if (phase === 'finish') {
			delete element.dataset.paginationSnapshot
			element.style.removeProperty('--pagination-offset')
		}
		else if (props.sticky && window.matchMedia('(max-width: 768px)').matches) {
			const { top } = element.getBoundingClientRect()
			element.dataset.paginationSnapshot = ''
			element.style.setProperty('--pagination-offset', `${top - element.getBoundingClientRect().top}px`)
		}
	})
}
</script>

<template>
<nav
	ref="pagination"
	class="pagination"
	:class="{ sticky, expand }"
	:aria-label="`第${page}页，共${totalPages}页`"
	:style="{ '--collapsed-width': `${pageArr.length * 2 + 6}em` }"
>
	<ZButton
		:disabled="page <= 1"
		class="pagination-button rtl-flip"
		icon="tabler:arrow-left"
		aria-label="上一页"
		@click="page--"
	/>
	<template v-for="i in pageArr" :key="i">
		<button
			v-if="Number.isFinite(i)"
			class="pagination-num"
			:class="{ active: i === page }"
			:aria-label="`第${i}页`"
			@click="page = i"
			v-text="i"
		/>
		<!-- TODO: 点击后自主选择目标页面 -->
		<button v-else disabled class="pagination-num">
			…
		</button>
	</template>
	<ZButton
		:disabled="page >= totalPages"
		class="pagination-button rtl-flip"
		icon="tabler:arrow-right"
		aria-label="下一页"
		@click="page++"
	/>
</nav>
<div ref="pagination-anchor" />
</template>

<style scoped>
.pagination {
	display: flex;
	max-width: calc(100vw);
	margin: 1rem auto;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	box-shadow: var(--box-shadow-1);
	background-color: var(--ld-bg-card);
	transition: max-width 0.2s var(--max-bezier-to-full);
	font-variant-numeric: tabular-nums;

	:root[data-article-transition] & {
		transition: none !important;
		view-transition-name: article-pagination;

		/* 保留布局占位，避免移动端快照按大视口重新定位 sticky。 */
		&[data-pagination-snapshot] {
			position: relative;
			bottom: auto;
			translate: 0 var(--pagination-offset, 0px);
		}
	}

	&.sticky {
		position: sticky;
		bottom: min(2em, 5%);

		&:not(.expand) {
			max-width: var(--collapsed-width);
			transition-timing-function: var(--max-bezier-to-collapse);
		}
	}

	> .pagination-button {
		border: none;
		border-radius: 0;
		box-shadow: none;

		&:first-child {
			margin-inline-end: auto;
			border-radius: 0.5rem 0 0 0.5rem;
		}

		&:last-child {
			margin-inline-start: auto;
			border-radius: 0 0.5rem 0.5rem 0;
		}
	}

	> .pagination-num {
		width: 3em;
		transition: background-color 0.2s;

		&:hover { background-color: var(--c-border); }

		&:disabled { pointer-events: none; }

		&.active {
			background-color: var(--c-primary-soft);
			color: var(--c-primary);
		}
	}
}

:global(::view-transition-group(article-pagination)),
:global(::view-transition-new(article-pagination)) {
	animation: none;
}

:global(::view-transition-old(article-pagination)) {
	display: none;
}
</style>
