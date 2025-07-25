<script setup lang="ts">
const props = defineProps<{
	/** Key 名称应当转为小写 */
	code?: string
	text?: string
	ctrl?: boolean
	shift?: boolean
	alt?: boolean
	meta?: boolean
}>()

const emit = defineEmits<{
	press: []
}>()

const active = ref(false)

function checkModifiers(e: KeyboardEvent) {
	return ((!props.ctrl || props.ctrl === e.ctrlKey)
		&& (!props.shift || props.shift === e.shiftKey)
		&& (!props.alt || props.alt === e.altKey)
		&& (!props.meta || props.meta === e.metaKey))
}

useEventListener('keydown', (e) => {
	if (e.key?.toLowerCase() === props.code?.toLowerCase() && checkModifiers(e)) {
		emit('press')
		active.value = true
	}
})

useEventListener('keyup', (e) => {
	if (e.key?.toLowerCase() === props.code?.toLowerCase() && checkModifiers(e)) {
		active.value = false
	}
})
</script>

<template>
<kbd :class="{ active }" @click="emit('press')">
	<slot>{{ text || code }}</slot>
</kbd>
</template>

<style lang="scss" scoped>
kbd {
	display: inline-block;
	margin: 0.1em;
	padding: 0.1em 0.2em;
	border-radius: 0.2em;
	box-shadow: inset 0 -0.15em 0 var(--c-bg-soft);
	background-color: var(--c-bg-soft);
	font-family: var(--font-monospace);
	font-size: 0.9em;
	letter-spacing: -0.05em;
	line-height: 1;
	color: var(--c-text-2);
	transition: all 0.1s;
	user-select: none;

	&:active, &.active {
		box-shadow: inset 0 -0.1em 0 var(--c-primary);
		background-color: var(--c-primary-soft);
		color: var(--c-primary);
		transform: translateY(0.05em);
	}
}
</style>
