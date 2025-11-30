<script setup lang="ts">
import { myFeed } from '~~/blog.config'
import feeds from '~/feeds'

const appConfig = useAppConfig()
const layoutStore = useLayoutStore()
layoutStore.setAside([])

const { data: postLink } = await useAsyncData(
	'/link',
	() => queryCollection('content').path('/link').first(),
)

useSeoMeta({
	title: '友链',
	ogType: 'profile',
	description: `${appConfig.title}的友链页面，收集了添加他为友链的网站和他订阅的网站列表。`,
})

const copyFields = {
	博主: myFeed.author,
	标题: myFeed.title,
	介绍: myFeed.desc,
	网址: myFeed.link,
	头像: myFeed.avatar,
}
</script>

<template>
<div class="mobile-only">
	<BlogHeader to="/" suffix="友链" tag="h1" />
</div>

<FeedGroup
	v-for="group in feeds"
	:key="group.name"
	v-bind="group"
	:shuffle="appConfig.link.randomInGroup"
/>

<Tab :tabs="['我的博客信息', '申请友链']" center>
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
</Tab>

<PostComment />
</template>

<style lang="scss" scoped>
.link-tab {
	margin: 1rem;
}
</style>
