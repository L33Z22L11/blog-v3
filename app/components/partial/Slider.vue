<script setup lang="ts">
const props = defineProps<{
	label?: string
	springMin?: number
	springMax?: number
	list?: (string | { value: string, label?: string })[]
}>()

const modelValue = defineModel<number>({ required: true })
const id = useId()
const list = computed(() => props.list?.map(v => typeof v === 'string' ? { value: v } : v))

function handleRelease() {
	if (props.springMin !== undefined && modelValue.value < props.springMin) {
		modelValue.value = props.springMin
	}
	if (props.springMax !== undefined && modelValue.value > props.springMax) {
		modelValue.value = props.springMax
	}
}
</script>

<template>
<label class="z-slider">
	{{ label }}

	<input
		v-bind="$attrs"
		v-model.number="modelValue"
		class="input"
		type="range"
		:list="id"
		@pointerup="handleRelease"
	>

	<datalist v-if="list" :id>
		<option v-for="{ value, label } in list" :key="value" :value :label />
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

.input {
	flex-grow: 1;
	accent-color: var(--c-primary);
}
</style>
