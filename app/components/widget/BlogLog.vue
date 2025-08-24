<script setup lang="ts">
const appConfig = useAppConfig()
const timeEstablished = appConfig.timeEstablished

const blogLog = [
	{ label: '2077-05-24', value: '未完待续…' },
	{ label: '2025-08-07', value: '重新设计站点图标' },
	{ label: timeEstablished, value: '发布第一篇文章' },
]
</script>

<template>
<ZWidget card title="驿站动态">
	<ZDlGroup size="large" :items="blogLog" />
</ZWidget>
</template>
