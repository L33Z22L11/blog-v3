<script setup lang="ts">
import type { CSSProperties } from 'vue'

const props = defineProps<{
	blur?: boolean | string
	zIndex?: number
}>()

const show = defineModel<boolean>('show')
const style = computed<CSSProperties>(() => ({
	'--z-index-popover': props.zIndex,
	'--bdfilter': props.blur ? `blur(${props.blur === true ? '4px' : props.blur})` : 'none',
}))
</script>

<template>
<Transition>
	<div
		v-if="show"
		class="bg-mask"
		:style
		@click="show = false"
	/>
</Transition>
</template>

<style lang="scss" scoped>
.bg-mask {
	position: fixed;
	inset: 0;
	background-color: #0003;
	backdrop-filter: var(--bdfilter);
	z-index: var(--z-index-popover);
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.v-enter-active,
.v-leave-active {
	transition: all var(--delay);
}
</style>
