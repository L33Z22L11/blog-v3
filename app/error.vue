<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
	error: Object as () => NuxtError,
})

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
<SkipToContent />
<ZSidebar />
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
		<ZFooter />
	</main>
	<ZAside v-if="!$route.meta.hideAside" />
</div>
<ZPanel />
</template>

<style lang="scss" scoped>
.app-error {
	margin: 1rem;

	pre {
		text-align: left;
	}

	.error-stack {
		font-size: 0.9em;
		white-space: pre-wrap;
	}
}
</style>
