<script setup lang="ts">
const props = defineProps<{
	language?: string
}>()

const slots = defineSlots<{
	default: () => VNode[]
}>()

const shikiStore = useShikiStore()
const code = computed(() => slots.default()[0]?.children?.toString() || '')
const rawHtml = ref(escapeHtml(code.value))

onMounted(async () => {
	if (!props.language)
		return
	const shiki = await shikiStore.load()
	await shikiStore.loadLang(props.language)
	rawHtml.value = shiki.codeToHtml(
		code.value,
		shikiStore.getOptions(props.language, ['ignoreColorizedBrackets']),
	)
})
</script>

<template>
<code v-if="language" class="shiki" v-html="rawHtml" />
<code v-else><slot /></code>
</template>

<style lang="scss" scoped>
code {
	padding: 0.1rem 0.3em;
	border-radius: 4px;
	outline: 1px solid var(--c-bg-soft);
	background-color: var(--c-bg-2);
	font-size: 0.8125em;
	white-space: break-spaces;

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		outline-color: color-mix(in srgb, currentcolor 15%, transparent);
		background-color: color-mix(in srgb, currentcolor 5%, transparent);
	}
}
</style>
