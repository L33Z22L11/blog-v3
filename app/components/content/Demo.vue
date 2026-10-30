<script setup lang="ts">
defineProps<{
	raw: string
	meta?: string
}>()
</script>

<template>
<Tab :tabs="['组件', '语法']">
	<template #tab1>
		<slot />
	</template>
	<template #tab2>
		<ProsePre :code="raw" language="mdc" :meta />
	</template>
</Tab>
</template>
