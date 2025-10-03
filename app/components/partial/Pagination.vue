<script setup lang="ts">
const props = defineProps<{
	totalPages: number
	expandPages?: number
	sticky?: boolean
}>()

const page = defineModel<number>({ required: true })
const pageArr = computed(() => genPageArr(page.value, props.totalPages, props.expandPages ?? 2))

const layoutStore = useLayoutStore()
const anchorEl = useTemplateRef('pagination-anchor')
const expand = useElementVisibility(anchorEl)

onMounted(() => {
	layoutStore.setTranslate('pagination', '0, -2em')
	page.value = Number(page.value)
})

onUnmounted(() => {
	layoutStore.setTranslate('pagination', '')
})
</script>

<template>
<nav
	class="pagination"
	:class="{ sticky, expand }"
	:aria-label="`第${page}页，共${totalPages}页`"
	:style="{ '--collapsed-width': `${pageArr.length * 2.5 + 4}em` }"
>
	<ZButton
		:disabled="page <= 1"
		class="pagination-button rtl-flip"
		icon="ph:arrow-fat-left-duotone"
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
		icon="ph:arrow-fat-right-duotone"
		aria-label="下一页"
		@click="page++"
	/>
</nav>
<div ref="pagination-anchor" />
</template>

<style lang="scss" scoped>
.pagination {
	display: flex;
	overflow: hidden;
	overflow: clip;
	max-width: calc(100vw);
	margin: 1rem auto;
	border: 1px solid var(--c-border);
	border-radius: 0.5rem;
	box-shadow: 0 0.1em 0.2em var(--ld-shadow);
	background-color: var(--ld-bg-card);
	transition: max-width 0.2s var(--max-bezier-to-full);
	font-variant-numeric: tabular-nums;

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

		&:first-child { margin-inline-end: auto; }
		&:last-child { margin-inline-start: auto; }
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
</style>
