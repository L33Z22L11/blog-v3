<script setup lang="ts">
const [scroll, toggleScroll] = useToggle(true)
</script>

<template>
<Tooltip class="md-table" tag="figure" interactive :delay="500">
	<template #content>
		<Icon v-show="false" :name="scroll ? 'tabler:text-wrap-disabled' : 'tabler:text-wrap'" />
		<ZButton
			:icon="scroll ? 'tabler:text-wrap' : 'tabler:text-wrap-disabled'"
			:text="scroll ? '自动换行' : '横向滚动'"
			@click="toggleScroll()"
		/>
	</template>
	<table class="scrollcheck-x" :class="{ scroll }">
		<slot />
	</table>
</Tooltip>
</template>

<style lang="scss" scoped>
.md-table {
	position: relative;
	margin: 1rem 0;
	font-variant-numeric: tabular-nums;
	font-size: 0.9em;
	line-height: 1.4;
	word-break: break-all;

	table.scroll {
		contain: layout; // KaTeX 撑开宽度
		display: block;
		white-space: nowrap;
		word-break: normal;
	}
}

:deep(table) {
	max-height: 80vh;
	max-height: 80dvh;
	margin: auto;
	border-collapse: collapse;

	> thead {
		position: sticky;
		top: 0;
	}

	th {
		background-color: var(--c-bg-2);
		font-weight: bold;
		text-align: center;
	}

	tr {
		transition: background-color 0.2s;

		&:hover {
			background-color: var(--c-bg-2);
		}
	}

	th, td {
		padding: 0.5em 0.8em;
		border: 1px solid var(--c-border);
	}
}
</style>
