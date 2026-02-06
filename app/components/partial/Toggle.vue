<script setup lang="ts">
defineProps<{
	label?: string
}>()

const modelValue = defineModel<boolean>()
</script>

<template>
<label class="z-toggle">
	<input v-model="modelValue" class="input-toggle" name="toggle" type="checkbox" @keypress.enter="modelValue = !modelValue">
	<slot><span v-if="label" v-text="label" /></slot>
</label>
</template>

<style lang="scss" scoped>
.z-toggle {
	user-select: none;
}

.input-toggle {
	position: relative;
	appearance: none;

	&::before {
		content: "";
		display: inline-block;
		position: relative;
		width: 2em;
		height: 1.2em;
		border-radius: 1em;
		outline: 1px solid var(--c-text-1);
		outline-offset: -1px;
		vertical-align: text-bottom;
		transition: background-color 0.2s, outline-color 0.2s;
	}

	&::after {
		content: "";
		position: absolute;
		inset-inline-start: 0.2em;
		top: calc(50% - 0.4em);
		height: 0.8em;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: var(--c-text-1);
		transition: all 0.2s;

		:hover > & {
			filter: contrast(0.6);
		}
	}

	&:not(:last-child) {
		margin-inline-end: 0.5em;
	}

	&:checked {
		&::before {
			outline-color: transparent;
			background-color: var(--c-primary);
		}

		&::after {
			background-color: var(--c-bg-1);
			transform: var(--transform-end-far);
		}
	}
}
</style>
