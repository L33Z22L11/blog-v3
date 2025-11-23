<script setup lang="ts">
const isSsg = import.meta.prerender
</script>

<!-- SSG 下让客户端抛弃预渲染结果重新 CSR -->
<template>
<ClientOnly v-if="isSsg">
	<slot />

	<template #fallback>
		<slot />
	</template>
</ClientOnly>

<slot v-else />
</template>
