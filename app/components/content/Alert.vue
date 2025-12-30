<script setup lang="ts">
const props = withDefaults(defineProps<{
	type?: keyof typeof typeMap
	card?: boolean
	flat?: boolean
	icon?: string
	color?: string
	title?: string
	text?: string
}>(), {
	type: 'tip',
})

const appConfig = useAppConfig()
const card = computed(() => appConfig.component.alert.defaultStyle === 'flat' ? props.card : !props.flat)

const typeMap = {
	tip: {
		icon: 'ph:notepad-bold',
		color: '#3A7',
		title: '提醒',
	},
	info: {
		icon: 'ph-info-bold',
		// 使用 currentColor 会导致 --c-primary-soft 颜色混合错误
		color: 'var(--c-text-1)',
		title: '信息',
	},
	question: {
		icon: 'ph:question-bold',
		color: '#3AF',
		title: '问题',
	},
	warning: {
		icon: 'ph:warning-bold',
		color: '#F80',
		title: '警告',
	},
	error: {
		icon: 'ph:x-circle-bold',
		color: '#F33',
		title: '错误',
	},
}

const icon = computed(() => props.icon || typeMap[props.type].icon)
const color = computed(() => props.color || typeMap[props.type].color)
const title = computed(() => props.title || typeMap[props.type].title)
</script>

<template>
<div class="alert" :class="{ card }" :style="{ '--c-primary': color }">
	<div class="alert-title">
		<Icon :name="icon" />
		<slot name="title">
			{{ title }}
		</slot>
	</div>
	<slot><p>{{ text }}</p></slot>
</div>
</template>

<style lang="scss" scoped>
.alert {
	margin: 1em 0;
	padding: 0.2em 0.8em;
	border-radius: 0.5em;
	background-color: var(--c-bg-2);
	font-size: 0.9em;

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		--c-primary-soft: color-mix(in srgb, var(--c-primary) 15%, transparent);
		--c-bg-2: color-mix(in srgb, var(--c-primary) 8%, var(--ld-bg-card));
	}

	&.card {
		background-color: var(--ld-bg-card);
		background-image:
			radial-gradient(circle at 4em -25em, var(--c-primary), transparent 30em),
			linear-gradient(var(--c-primary) -2000%, transparent);
	}

	.alert-title {
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin: 0.5em 0;
		font-weight: bold;
		color: var(--c-primary);

		:deep(p) {
			margin: 0;
		}
	}
}
</style>
