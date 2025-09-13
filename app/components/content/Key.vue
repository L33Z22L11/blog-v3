<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, ref } from 'vue'

const props = defineProps<{
	text?: string
	/** https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key */
	code?: string
	icon?: boolean
	ctrl?: boolean
	shift?: boolean
	alt?: boolean
	meta?: boolean
	noPrevent?: boolean
}>()

const emit = defineEmits<{
	press: []
}>()

const useSymbol = computed(() => {
	const isMac = /mac ?os/i.test(navigator?.userAgent)
	return props.icon || isMac
})

const keyJoiner = computed(() => useSymbol.value ? '' : '+')

// @keep-sorted
const displayMap = {
	' ': 'Space',
	'ArrowDown': '↓',
	'ArrowLeft': '←',
	'ArrowRight': '→',
	'ArrowUp': '↑',
	'Control': 'Ctrl',
	'Delete': 'Del',
	'Escape': 'Esc',
	'Meta': 'Win',
}

// @keep-sorted
const symbolMap = {
	' ': '␣',
	'Alt': '⌥',
	'Backspace': '⌫',
	'Control': '⌃',
	'Delete': '⌦',
	'Enter': '↵',
	'Escape': '⎋',
	'Meta': '⌘',
	'Shift': '⇧',
	'Tab': '⇥',
}

function normalizeCodeDisplay(code: string) {
	if (!code)
		return ''
	if (useSymbol.value && symbolMap[code as keyof typeof symbolMap])
		return symbolMap[code as keyof typeof symbolMap]
	if (displayMap[code as keyof typeof displayMap])
		return displayMap[code as keyof typeof displayMap]
	return code
}

const codeDisplay = computed(() => {
	if (props.text)
		return props.text

	const parts: string[] = []
	if (props.ctrl)
		parts.push(normalizeCodeDisplay('Control'))
	if (props.shift)
		parts.push(normalizeCodeDisplay('Shift'))
	if (props.alt)
		parts.push(normalizeCodeDisplay('Alt'))
	if (props.meta)
		parts.push(normalizeCodeDisplay('Meta'))
	if (props.code)
		parts.push(normalizeCodeDisplay(props.code))

	return parts.join(keyJoiner.value)
})

const active = ref(false)

/**
 * 当前全局修饰键状态
 */
const modifierState = ref({
	ctrl: false,
	shift: false,
	alt: false,
	meta: false,
})

function updateModifierState(e: KeyboardEvent, isDown: boolean) {
	if (e.key === 'Control')
		modifierState.value.ctrl = isDown
	if (e.key === 'Shift')
		modifierState.value.shift = isDown
	if (e.key === 'Alt')
		modifierState.value.alt = isDown
	if (e.key === 'Meta')
		modifierState.value.meta = isDown
}

/**
 * 检查当前修饰键状态是否匹配 props
 */
function modifiersMatch() {
	return (!props.ctrl || modifierState.value.ctrl)
		&& (!props.shift || modifierState.value.shift)
		&& (!props.alt || modifierState.value.alt)
		&& (!props.meta || modifierState.value.meta)
}

function matchKeyEvent(e: KeyboardEvent, expectedCode?: string) {
	if (expectedCode && e.key.toLowerCase() !== expectedCode.toLowerCase())
		return false
	return modifiersMatch()
}

useEventListener('keydown', (e) => {
	updateModifierState(e, true)
	if (matchKeyEvent(e, props.code)) {
		emit('press')
		active.value = true
		props.noPrevent || e.preventDefault()
	}
})

useEventListener('keyup', (e) => {
	updateModifierState(e, false)
	if (matchKeyEvent(e, props.code) || !modifiersMatch())
		active.value = false
})

useEventListener('blur', () => {
	modifierState.value = { ctrl: false, shift: false, alt: false, meta: false }
	active.value = false
})
</script>

<template>
<ClientOnly>
	<kbd :class="{ active }" data-allow-mismatch @click="emit('press')">
		<slot>{{ codeDisplay }}</slot>
	</kbd>
</ClientOnly>
</template>

<style lang="scss" scoped>
kbd {
	display: inline-block;
	margin: 0.1em;
	padding: 0 0.2em 0.1em;
	border-radius: 0.2em;
	box-shadow: inset 0 -0.15em 0 var(--c-bg-soft);
	background-color: var(--c-bg-soft);
	font-family: var(--font-monospace);
	font-size: 0.9em;
	letter-spacing: -0.05em;
	line-height: 1.4;
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
