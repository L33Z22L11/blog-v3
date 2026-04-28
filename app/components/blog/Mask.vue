<script setup lang="ts">
defineProps<{
	blur?: boolean | string
	zIndex?: number
}>()

const show = defineModel<boolean>('show')
</script>

<template>
<Transition>
	<div
		v-if="show"
		class="bg-mask"
		:style="{
			'--z-index-popover': zIndex,
			'--bdfilter': blur ? `blur(${blur === true ? '4px' : blur})` : 'none',
		}"
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
