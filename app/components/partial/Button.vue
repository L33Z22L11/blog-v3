<script setup lang="ts">
import { UtilLink } from '#components'

export interface ButtonProps {
	variant?: 'button' | 'text'
	icon?: string
	text?: string
	to?: string
	desc?: string
	primary?: boolean
}

withDefaults(defineProps<ButtonProps>(), {
	variant: 'button',
})
</script>

<template>
<component
	:is="to ? UtilLink : 'button'"
	:to
	class="z-button"
	:class="[variant, { primary }]"
>
	<div class="button-main">
		<Icon v-if="icon" :name="icon" />
		<slot>{{ text }}</slot>
	</div>
	<div v-if="desc" class="button-desc">
		{{ desc }}
	</div>
</component>
</template>

<style lang="scss" scoped>
.z-button {
	display: inline-block;
	transition: color 0.1s, background-color 0.2s;

	&.button {
		padding: 0.4em 0.6em;
		border: 1px solid var(--c-bg-soft);
		border-radius: 0.5em;
		box-shadow: var(--box-shadow-1);
		background-color: var(--ld-bg-card);
		line-height: 1.2;
		vertical-align: middle;
		cursor: pointer;

		&.primary {
			background-color: var(--c-primary);
			color: var(--c-bg);
		}

		&:hover {
			box-shadow: var(--box-shadow-2);
			background-color: var(--c-bg-2);
			color: var(--c-text);
		}

		&:active {
			background-color: var(--ld-shadow);
		}

		&:disabled {
			background-color: var(--c-bg-1);
		}
	}

	&.text {
		&:hover {
			color: var(--c-primary);
		}
	}

	&:disabled {
		color: var(--c-text-3);
		cursor: not-allowed;
	}

	& + .button {
		margin-inline-start: 0.8em;
	}
}

.button-main {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.2em;
}

.button-desc {
	font-size: 0.75em;
	text-align: center;
	color: var(--c-text-2);
}
</style>
