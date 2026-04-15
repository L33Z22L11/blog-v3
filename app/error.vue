<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
	error: NuxtError & { url?: string }
}>()

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-log'])
</script>

<template>
<NuxtLoadingIndicator />
<NuxtRouteAnnouncer :style="{ position: 'absolute' }" />
<BlogSkipToContent />
<BlogSidebar />
<div id="content">
	<main id="main-content">
		<div class="app-error">
			<ZError
				:code="error.stack"
				:message="error.url"
				:title="`[${error.status}] ${error.message}`"
			>
				<template #operation>
					<ZButton text="返回主页" @click="clearError({ redirect: '/' })" />
					<ZButton text="尝试忽略" @click="clearError()" />
				</template>
			</ZError>
		</div>
		<BlogFooter />
	</main>
	<BlogAside />
</div>
<BlogPanel />
<BikariyaModals />
</template>

<style lang="scss" scoped>
.app-error {
	margin: 1rem;
}
</style>
