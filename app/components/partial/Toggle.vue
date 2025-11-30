<script setup lang="ts">
defineProps<{
	label?: string
}>()

const modelValue = defineModel<boolean>()

function toggle() {
	modelValue.value = !modelValue.value
}
</script>

<template>
<label
	class="z-toggle"
	tabindex="0"
	role="switch"
	:aria-checked="modelValue"
	@keypress.space.prevent="toggle"
	@keypress.enter="toggle"
>
	<input v-model="modelValue" name="toggle" type="checkbox" hidden>
	<span class="toggle-slider" />
	<slot><span>{{ label }}</span></slot>
</label>
</template>

<style lang="scss" scoped>
.z-toggle {
	user-select: none;
}

.toggle-slider {
	display: inline-block;
	position: relative;
	width: 2.1em;
	height: 1.2em;
	border: 0.2em solid transparent;
	border-radius: 1em;
	outline: 1px solid var(--c-text-1);
	outline-offset: -1px;
	vertical-align: text-bottom;
	transition: background-color 0.2s, outline-color 0.2s;

	&::after {
		content: "";
		position: absolute;
		height: 100%;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: var(--c-text-1);
		transition: transform 0.2s, background-color 0.2s;
	}

	&:not(:last-child) {
		margin-inline-end: 0.5em;
	}

	input:checked + & {
		outline-color: var(--c-primary);
		background-color: var(--c-primary);

		&::after {
			background-color: var(--c-bg-1);
			transform: var(--transform-end-far);
		}
	}
}
</style>
