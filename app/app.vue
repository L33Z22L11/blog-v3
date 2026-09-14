<template>
<NuxtLayout>
	<!-- 缓存固定的入口 VNode，避免内联 pageKey 的引用变化重启加载条；路由仍由 NuxtPage 内部更新。 -->
	<NuxtPage v-once :page-key="route => normalizeContentPath(route.path)" />
</NuxtLayout>
</template>
