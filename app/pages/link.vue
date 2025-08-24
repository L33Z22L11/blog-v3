<script setup lang="ts">
import { myFeed } from '~~/blog.config'
import feeds from '~/feeds'

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside([])

const { data: postLink } = await useAsyncData('/link', () => queryCollection('content').path('/link').first())
const { data: descLink } = await useAsyncData('/desc', () => queryCollection('content').path('/desc').first())
useSeoMeta({
	title: '友链',
	ogType: 'profile',
	description: `${appConfig.title}的友链页面，收集了添加他为友链的网站和他订阅的网站列表。`,
})

const copyFields = {
	博主: myFeed.author,
	站名: myFeed.title,
	介绍: myFeed.desc,
	网址: myFeed.link,
	头像: myFeed.avatar,
}
</script>

<template>
<FeedGroup :feeds />

<Tab :tabs="['驿站信息', '申请友链', '格式说明']" center>
	<template #tab1>
		<div class="link-tab">
			<FeedCard v-bind="myFeed" />
			<Copy v-for="(code, prompt) in copyFields" :key="prompt" :prompt :code />
		</div>
	</template>
	<template #tab2>
		<ContentRenderer
			v-if="postLink"
			:value="postLink"
			class="article"
		/>
		<p v-else class="text-center">
			可于 link.md 配置友链补充说明。
		</p>
	</template>
	<template #tab3>
		<ContentRenderer
			v-if="descLink"
			:value="descLink"
			class="article"
		/>
		<p v-else class="text-center">
			可于 desc.md 配置友链补充说明。
		</p>
	</template>
</Tab>

<PostComment />
</template>

<style lang="scss" scoped>
.link-tab {
	margin: 1rem;
}
</style>
