<script setup lang="ts">
const props = defineProps<{
	label?: string
	springMin?: number
	springMax?: number
	list?: (string | { value: string, label?: string })[]
}>()

const modelValue = defineModel<number>({ required: true })
const initialValue = modelValue.value
const id = useId()
const list = computed(() => props.list?.map(v => typeof v === 'string' ? { value: v } : v))

function spring() {
	if (props.springMin !== undefined && modelValue.value < props.springMin) {
		modelValue.value = props.springMin
	}
	if (props.springMax !== undefined && modelValue.value > props.springMax) {
		modelValue.value = props.springMax
	}
}
const debounceSpring = useDebounceFn(spring, 500)
</script>

<template>
<label class="z-slider">
	<slot><span v-if="label" v-text="label" /></slot>

	<input
		v-bind="$attrs"
		v-model.number="modelValue"
		class="input-slider"
		type="range"
		:list="id"
		@change="debounceSpring"
		@dblclick="modelValue = initialValue"
	>

	<data class="data-value" :value="modelValue" v-text="modelValue" />

	<datalist v-if="list" :id="id">
		<option v-for="{ value, label: text } in list" :key="value" :value :label="text" />
	</datalist>
</label>
</template>

<style lang="scss" scoped>
.z-slider {
	display: flex;
	align-items: center;
	gap: 0.5em;
	user-select: none;
}

.input-slider[type="range"] {
	flex-grow: 1;
	overflow: hidden;
	height: 1.2em;
	border-radius: 1em;
	background-color: var(--c-bg-soft);
	appearance: none;

	@supports (-moz-appearance: auto) {
		accent-color: var(--c-primary);
		appearance: auto;
	}

	&::-webkit-slider-container {
		min-block-size: auto;
	}

	&::-webkit-slider-runnable-track {
		height: 100%;
	}

	&::-webkit-slider-thumb {
		height: 100%;
		aspect-ratio: 1;
		border: 0.2em solid var(--c-primary);
		border-radius: 50%;
		box-shadow: -100vw 0 0 calc(100vw - 0.6em) var(--c-primary);
		background-color: var(--c-bg-1);
		transition: all 0.2s;
		appearance: none;

		:hover > & {
			background-color: var(--c-bg-3);
		}
	}
}

.data-value {
	min-width: var(--slider-value, 3ch);
	text-align: right;
}
</style>
