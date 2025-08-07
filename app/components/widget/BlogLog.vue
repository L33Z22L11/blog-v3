<script setup lang="ts">
const appConfig = useAppConfig()
const timeEstablished = appConfig.timeEstablished

const blogLog = [
	{ date: '2077-05-24', content: '未完待续…' },
	{ date: '2025-08-07', content: '重新设计站点图标' },
	{ date: timeEstablished, content: '发布第一篇文章' },
]
</script>

<template>
<ZWidget card title="驿站动态">
	<!-- TODO: 优化时间线样式 -->
	<ul>
		<li v-for="(item, index) in blogLog" :key="index">
			<small>{{ item.date }}</small><br>
			{{ item.content }}
		</li>
	</ul>
</ZWidget>
</template>
