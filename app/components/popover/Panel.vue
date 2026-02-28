<script setup lang="ts">
import type { ModalEmits } from '#modals'

defineProps<{
	title?: string
	subtitle?: string
}>()
const emit = defineEmits<ModalEmits>()

useBack(false, () => emit('close'))

useEventListener('keydown', (e) => {
	if (e.key === 'Escape')
		emit('close')
})
</script>

<template>
<div class="popover-panel">
	<div class="popover-panel-header text-creative">
		<span />

		<hgroup class="title">
			{{ title }}
			<div class="subtitle">
				{{ subtitle }}
			</div>
		</hgroup>

		<ZButton
			variant="text"
			icon="ph:x-bold"
			aria-label="关闭"
			@click="$emit('close')"
		/>
	</div>
	<slot />
</div>
</template>

<style lang="scss" scoped>
.popover-panel {
	position: fixed;
	inset: 0;
	width: 90%;
	height: fit-content;
	max-width: $breakpoint-mobile;
	margin: auto;
	border-radius: 1rem;
	box-shadow: var(--box-shadow-2);
	background-color: var(--ld-bg-card);

	@media (max-width: $breakpoint-phone) {
		top: initial;
		bottom: 0;
		width: 100%;
		margin-bottom: 0;
		border-radius: 1rem 1rem 0 0;
	}
}

.popover-panel-header {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	place-items: center;
	margin-bottom: -0.5rem;

	> :first-child {
		justify-self: start;
	}

	> .title {
		> .subtitle {
			opacity: 0.5;
			font-size: 0.8em;
		}
	}

	> :last-child {
		justify-self: end;
		padding: 1rem;

		// @media (max-width: $breakpoint-phone) {
		// 	visibility: hidden;
		// }
	}
}
</style>
