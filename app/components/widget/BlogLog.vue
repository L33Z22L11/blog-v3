<script setup lang="ts">
const appConfig = useAppConfig()
const timeEstablished = appConfig.timeEstablished

const blogLog = [
	{ date: '2030-08-10', content: '域名到期，预计会提前重定向迁移，届时会通知友链中的各位' },
	{ date: '2024-08-11', content: 'Nuxt Content 重构博客上线' },
	{ date: '2023-05-24', content: '更换框架为 Hexo，升级博客' },
	{ date: '2020-08-24', content: '更换到当前域名' },
	{ date: timeEstablished, content: '发布第一篇文章' },
]
</script>

<template>
<ZWidget card title="更新日志">
	<!-- TODO: 优化时间线样式 -->
	<ul>
		<li v-for="(item, index) in blogLog" :key="index">
			<small>{{ item.date }}</small><br>
			{{ item.content }}
		</li>
	</ul>
</ZWidget>
</template>
