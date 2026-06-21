<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
	error: NuxtError & { url?: string }
}>()
</script>

<template>
<NuxtLayout>
	<template #aside>
		<WidgetBlogLog />
	</template>

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
</NuxtLayout>
</template>

<style lang="scss" scoped>
.app-error {
	margin: 1rem;
}
</style>
