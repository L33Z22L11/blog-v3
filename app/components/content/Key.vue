<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
	text?: string
	/** https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/key */
	code?: string
	icon?: boolean
	ctrl?: boolean
	shift?: boolean
	alt?: boolean
	meta?: boolean
	/** 智能适配：Windows用Ctrl，macOS用Cmd */
	cmd?: boolean
	prevent?: boolean
}>(), {
	icon: undefined,
})

const emit = defineEmits<{
	press: []
}>()

const isMac = computed(() => /mac ?os/i.test(navigator?.userAgent))
const useSymbol = computed(() => isMac.value ? props.icon !== false : props.icon)
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
	'Meta': isMac.value ? 'Cmd' : 'Win',
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
	'Meta': isMac.value ? '⌘' : '田',
	'Shift': '⇧',
	'Tab': '⇥',
}

function normalizeCodeDisplay(code: string) {
	if (!code)
		return ''
	if (useSymbol.value && code in symbolMap)
		return symbolMap[code as keyof typeof symbolMap]
	if (code in displayMap)
		return displayMap[code as keyof typeof displayMap]
	return code
}

const codeDisplay = computed(() => {
	if (props.text)
		return props.text

	const parts: string[] = []

	if (props.cmd)
		parts.push(normalizeCodeDisplay(isMac.value ? 'Meta' : 'Control'))
	if (props.ctrl && !props.cmd)
		parts.push(normalizeCodeDisplay('Control'))
	if (props.shift)
		parts.push(normalizeCodeDisplay('Shift'))
	if (props.alt)
		parts.push(normalizeCodeDisplay('Alt'))
	if (props.meta && !props.cmd)
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
	const cmdMatch = props.cmd
		? (isMac.value ? modifierState.value.meta : modifierState.value.ctrl)
		: true

	return cmdMatch
		&& (!props.ctrl || (!props.cmd && modifierState.value.ctrl))
		&& (!props.shift || modifierState.value.shift)
		&& (!props.alt || modifierState.value.alt)
		&& (!props.meta || (!props.cmd && modifierState.value.meta))
}

function matchKeyEvent(e: KeyboardEvent, expectedCode?: string) {
	if (expectedCode && e.key?.toLowerCase() !== expectedCode.toLowerCase())
		return false
	return modifiersMatch()
}

useEventListener('keydown', (e) => {
	updateModifierState(e, true)
	if (matchKeyEvent(e, props.code)) {
		emit('press')
		active.value = true
		props.prevent && e.preventDefault()
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
<UtilHydrateSafe>
	<kbd :class="{ active }" @click.stop="emit('press')">
		<slot>{{ codeDisplay }}</slot>
	</kbd>
</UtilHydrateSafe>
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
