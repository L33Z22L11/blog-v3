<script setup lang="ts">
import type { ModalEmits, ModalProps } from '#modals'

defineProps<ModalProps>()
const emit = defineEmits<ModalEmits>()

const preferenceStore = usePreferenceStore()
const { preferences } = storeToRefs(preferenceStore)

const fontSize = useUnit(toRef(preferences.value, 'fontSize'), 'em')
const letterSpacing = useUnit(toRef(preferences.value, 'letterSpacing'), 'em')
const lineHeight = useUnit(toRef(preferences.value, 'lineHeight'))
const hue = useUnit(toRef(preferences.value, 'hue'), 'deg')

useEventListener('keydown', (e) => {
	if (e.key === 'Escape')
		emit('close')
})
</script>

<template>
<Transition name="float-in">
	<div v-if="open" class="preference card" @keypress.esc="emit('close')">
		<form class="form">
			<label for="hue">主题色调</label>
			<ZSlider v-model="hue" min="0" max="360" step="1" :initial="defaultPreferences.hue" />

			<label for="lineHeight">行高</label>
			<ZSlider v-model="lineHeight" min="1.2" max="2.5" step="0.1" :initial="defaultPreferences.lineHeight" />

			<label for="fontSize">正文字号</label>
			<ZSlider v-model="fontSize" min="0.5" max="2" step="0.1" :initial="defaultPreferences.fontSize" />

			<label for="letterSpacing">字间距</label>
			<ZSlider v-model="letterSpacing" min="-0.1" max="0.1" step="0.01" :initial="defaultPreferences.letterSpacing" />

			<label for="textAlign">文本对齐</label>
			<ZRadioGroup v-model="preferences.textAlign" :items="textAlignOptions" />

			<label for="fontFamily">字体</label>
			<ZRadioGroup v-model="preferences.fontFamily" :items="fontFamilyOptions" />
		</form>
	</div>
</Transition>
</template>

<style lang="scss" scoped>
.preference {
	position: fixed;
	inset: 0;
	width: 90%;
	height: fit-content;
	max-width: $breakpoint-mobile;
	margin: auto;
}

.form {
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	gap: 1rem;
	padding: 1rem 1.5rem;
}
</style>
