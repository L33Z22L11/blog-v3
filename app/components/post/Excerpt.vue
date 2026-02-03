<script setup lang="ts">
import { sleep } from 'radash'

const props = defineProps<{
	excerpt: string
}>()

const appConfig = useAppConfig()

const excerpt = ref(props.excerpt)
const caret = ref('')

if (appConfig.component.excerpt?.animation !== false) {
	excerpt.value = ''
	onMounted(async () => {
		caret.value = appConfig.component.excerpt?.caret ?? '_'
		for (const char of props.excerpt) {
			excerpt.value += char
			await sleep(50)
		}
		caret.value = ''
	})
}

if (import.meta.dev) {
	watch(() => props.excerpt, (newExcerpt) => {
		excerpt.value = newExcerpt
	})
}
</script>

<template>
<div class="md-excerpt gradient-card">
	<span class="dynamic"><Icon name="ph:highlighter-bold" />{{ excerpt }}{{ caret }}</span>
	<span class="static"><Icon name="ph:highlighter-bold" />{{ props.excerpt }}</span>
</div>
</template>

<style lang="scss" scoped>
.md-excerpt {
	opacity: 0.6;
	margin: 1rem 0.5rem;
	padding: 0.5rem;
	font-size: 0.9em;
	transition: opacity 0.2s;

	> .static {
		opacity: 0;
		pointer-events: none;
		user-select: none;
	}

	> .dynamic {
		position: absolute;
		width: calc(100% - 1rem);
	}

	.iconify {
		margin-inline-end: 0.3em;
	}

	&:hover {
		opacity: 1;
	}
}
</style>
