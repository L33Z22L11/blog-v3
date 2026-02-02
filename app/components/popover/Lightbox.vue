<script setup lang="ts">
import type { CSSProperties } from 'vue'

defineOptions({ inheritAttrs: false })

defineProps<{
	el: HTMLImageElement
	caption?: string
	open?: boolean
	style?: CSSProperties
}>()

defineEmits<{
	close: []
}>()
</script>

<template>
<BikariyaImageViewer
	v-bind="$attrs"
	:target="el"
	:open
	:style
	clamp
	:rate=".8"
	@close="$emit('close')"
/>

<Transition>
	<div v-if="open" class="tooltip" :style="{ zIndex: style?.zIndex }">
		<span v-if="caption" class="caption">{{ caption }}</span>
		<button
			class="close"
			aria-label="关闭灯箱"
			@click="$emit('close')"
		>
			<Icon name="ph:x-bold" />
		</button>
	</div>
</Transition>
</template>

<style lang="scss" scoped>
.tooltip {
	display: flex;
	align-items: center;
	position: fixed;
	inset-inline: 0;
	bottom: clamp(2rem, 10vh, 5rem);
	width: fit-content;
	max-width: min(40rem, 80%);
	margin-inline: auto;
	border: 1px solid #0003;
	border-radius: 0.5em;
	box-shadow: var(--box-shadow-2), var(--box-shadow-3);
	background-color: #0007;
	backdrop-filter: blur(1rem) saturate(2);
	color: white;
	transition: all var(--delay);

	&.v-enter-from,
	&.v-leave-to {
		opacity: 0;
		bottom: 0;
	}

	.caption {
		margin-inline-end: -0.5em;
		padding: 0.5em 1em;
	}

	.close {
		align-self: stretch;
		padding: 0.5em;
		cursor: pointer;
	}
}
</style>
