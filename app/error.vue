<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
	error: NuxtError & { url?: string }
}>()

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-log'])

const errorStack = removeHtmlTags(props.error?.stack)

onMounted(() => {
	console.error(errorStack)
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
<NuxtLoadingIndicator />
<BlogSkipToContent />
<BlogSidebar />
<div id="content">
	<main>
		<div class="app-error">
			<ZError
				:code="errorStack"
				:message="error?.url"
				:title="`[${error?.statusCode}] ${error?.message}`"
			>
				<ZButton @click="handleError">
					返回主页
				</ZButton>
			</ZError>
		</div>
		<BlogFooter />
	</main>
	<BlogAside v-if="!$route.meta.hideAside" />
</div>
<BlogPanel />
</template>

<style lang="scss" scoped>
.app-error {
	margin: 1rem;

	pre {
		text-align: start;
	}

	.error-stack {
		font-size: 0.9em;
		white-space: pre-wrap;
	}
}
</style>
