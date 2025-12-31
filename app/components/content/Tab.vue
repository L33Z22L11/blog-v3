<script setup lang="ts">
const props = defineProps<{
	/** tab 下标从 1 开始 */
	tabs: string[]
	center?: boolean
	active?: string | number
}>()

// 使用 v-bind:active 以传递 Number 值
const activeTab = ref(Number(props.active) || 1)
</script>

<template>
<div :class="{ center }">
	<div class="tabs">
		<button
			v-for="(tab, tabIndex) in tabs"
			:key="tabIndex"
			:class="{ active: activeTab === tabIndex + 1 }"
			@click="activeTab = tabIndex + 1"
		>
			{{ tab }}
		</button>
	</div>
	<div v-for="tabIndex in tabs.length" v-show="activeTab === tabIndex" :key="tabIndex" class="tab-content">
		<slot :name="`tab${tabIndex}`" />
	</div>
</div>
</template>

<style lang="scss" scoped>
.float-in-leave-active {
	/* stylelint-disable-next-line declaration-no-important */
	position: revert !important;
}

.center {
	width: fit-content;
	max-width: 100%;
	margin-inline: auto;
}

.tabs {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 0.5em;
	position: relative;
	width: fit-content;
	margin: 0 auto;
	font-size: 0.9em;
	line-height: 1.4;
}

button {
	position: relative;
	margin-bottom: 0.5em;
	padding: 0.3em 0.5em;
	border-radius: 0.4em;
	color: var(--c-text-2);
	transition: all 0.2s;

	&:hover {
		background-color: var(--c-bg-soft);
		color: var(--c-text);
	}

	&::before, &::after {
		display: block;
		position: absolute;
		bottom: -0.5em;
		inset-inline: 0.8em;
		height: 2px;
		border-radius: 1em;
		pointer-events: none;
	}

	&::after {
		content: "";
		inset-inline: -0.8em;
		background-color: var(--c-border);
	}

	&.active {
		box-shadow: 0 1px 0.5em var(--ld-shadow);
		background-color: var(--ld-bg-card);
		color: var(--c-text);

		&::before {
			content: "";
			background-color: var(--c-primary);
			z-index: 1;
		}
	}
}

.tab-content {
	margin: 1em 0;
}
</style>
