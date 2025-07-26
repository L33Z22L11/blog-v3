<script setup lang="ts">
const scroll = ref(true)
</script>

<template>
<div class="md-table">
	<div class="table-header">
		<ZButton @click="scroll = !scroll">
			<Icon :name="scroll ? 'ph:arrow-u-down-left-bold' : 'ph:arrows-out-line-horizontal-bold'" />
			<span class="tooltip">{{ scroll ? '自动换行' : '横向滚动' }}</span>
		</ZButton>
	</div>
	<table class="scrollcheck-x" :class="{ scroll }">
		<slot />
	</table>
</div>
</template>

<style lang="scss" scoped>
.md-table {
	position: relative;
	margin: 1rem 0;
	font-feature-settings: "tnum";
	font-size: 0.9em;
	line-height: 1.4;
	word-break: break-all;

	table.scroll {
		display: block;
		overflow: auto;
		max-width: fit-content;
		white-space: nowrap;
		word-break: normal;
	}
}

.table-header {
	position: sticky;
	opacity: 0;
	top: 0;
	height: 0;
	text-align: right;
	transition: opacity 0.2s;
	z-index: 1;

	.tooltip {
		display: none;
	}

	:hover > & {
		opacity: 1;

		&:hover .tooltip {
			display: revert;
		}
	}
}

:deep(table) {
	max-height: 80vh;
	max-height: 80dvh;
	margin: auto;
	border-collapse: collapse;

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
