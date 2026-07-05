<script setup lang="ts">
const props = defineProps<{
	language?: string
	code: string
	copy?: boolean
}>()

const { copy: copyCode, copied } = useCopy(props.code)
const shiki = useShiki()
const codeElement = useTemplateRef('code')
const highlighted = ref(false)

onMounted(async () => {
	if (!props.language)
		return
	await shiki.mountInline(codeElement.value!, props.code, {
		language: props.language,
		transformerOptions: ['ignoreColorizedBrackets'],
	})
	highlighted.value = true
})
</script>

<template>
<code ref="code" :class="{ copyable: copy }">
	<template v-if="!language || !highlighted">{{ code }}</template>
	<Icon v-if="copy" v-show="false" name="tabler:check" />
	<button v-if="copy" type="button" class="copy-button" aria-label="复制" @click="copyCode()">
		<Icon :name="copied ? 'tabler:check' : 'tabler:copy'" />
	</button>
</code>
</template>

<style lang="scss" scoped>
code {
	margin: 0.1em;
	padding: 0.1rem 0.3em;
	border: 1px solid var(--c-border);
	border-radius: 4px;
	background-color: var(--c-bg-2);
	font-size: 0.85em;
	white-space: break-spaces;

	&.copyable {
		padding-inline-end: 0.1em;
	}

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		border-color: color-mix(in srgb, currentcolor 10%, transparent);
		background-color: color-mix(in srgb, currentcolor 5%, transparent);
	}
}

.copy-button {
	display: inline-flex;
	margin-inline-start: 0.2em;
	vertical-align: -0.2em;
	color: var(--c-text-3);
	transition: color 0.2s;

	&:hover,
	&:focus-visible {
		opacity: 1;
		color: var(--c-primary);
	}
}
</style>
