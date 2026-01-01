<script setup lang="ts">
const props = defineProps<{
	language?: string
	code: string
}>()

const shikiStore = useShikiStore()
const rawHtml = ref(escapeHtml(props.code))

onMounted(async () => {
	if (!props.language)
		return
	const shiki = await shikiStore.load()
	await shikiStore.loadLang(props.language)

	rawHtml.value = shiki.codeToHtml(
		props.code,
		shikiStore.getOptions(props.language, ['ignoreColorizedBrackets']),
	)
})
</script>

<template>
<code v-if="language" class="shiki" v-html="rawHtml" />
<code v-else><slot>{{ code }}</slot></code>
</template>

<style lang="scss" scoped>
code {
	margin: 0.1em;
	padding: 0.1rem 0.3em;
	border: 1px solid var(--c-border);
	border-radius: 4px;
	background-color: var(--c-bg-2);
	font-size: 0.8125em;
	white-space: break-spaces;

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		border-color: color-mix(in srgb, currentcolor 10%, transparent);
		background-color: color-mix(in srgb, currentcolor 5%, transparent);
	}
}
</style>
