<script setup lang="ts">
const props = defineProps<{
	language?: string
}>()

const slots = defineSlots<{
	default: () => VNode[]
}>()

const shikiStore = useShikiStore()
const highlightedHtml = ref(slots.default()[0]?.children?.toString() || '')

onMounted(async () => {
	if (!props.language)
		return

	const shiki = await shikiStore.load()
	await shikiStore.loadLang(props.language)
	highlightedHtml.value = shiki.codeToHtml(highlightedHtml.value, {
		...shikiStore.options,
		lang: props.language,
	})
})
</script>

<template>
<code v-if="language" class="shiki" v-html="highlightedHtml" />
<code v-else><slot /></code>
</template>

<style lang="scss" scoped>
code {
	padding: 0.1rem 0.3em;
	border-radius: 4px;
	outline: 1px solid var(--c-bg-soft);
	background-color: var(--c-bg-2);
	font-size: 0.875em;
	white-space: break-spaces;

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		outline-color: color-mix(in srgb, currentcolor 15%, transparent);
		background-color: color-mix(in srgb, currentcolor 5%, transparent);
	}
}
</style>
