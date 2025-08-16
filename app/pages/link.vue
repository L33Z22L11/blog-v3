<script setup lang="ts">
import { myFeed } from '~~/blog.config'
import friends from '~/friends'
import subscriptions from '~/subscriptions'

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
<header class="link-reminder">
	<div class="content">
		<p><Icon name="ph:newspaper-clipping-bold" /> 我会通过订阅源阅读友链文章。</p>
		<p>
			欢迎加入 QQ 群
			<!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
			<Tip copy>938973313</Tip>
			闲聊或技术交流。
		</p>
		<p>
			站点根据友链生成了
			<!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
			<ProseA href="/zhilu.opml">友链源 OPML 聚合</ProseA>，可导入阅读器或
			<!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
			<ProseA href="https://app.folo.is/share/lists/143880413705604096">订阅 Folo List</ProseA>。
		</p>
	</div>
	<div class="operations">
		<ProseA href="/atom.xml" icon="ph:rss-simple-bold">
			订阅源
		</ProseA>
		<ProseA href="https://app.folo.is/share/feeds/107805652515466240" icon="ph:list-plus-bold">
			在 Folo 上订阅
		</ProseA>
	</div>
</header>

<FeedGroup label="友链" :feeds="friends" />
<FeedGroup label="订阅" :feeds="subscriptions" />

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
.link-reminder {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.8rem 2rem;
	margin: 1rem;
	padding: 0.8rem 1rem;
	border-radius: 1rem;
	background-color: var(--c-primary-soft);

	.content {
		flex-basis: 20em;
		flex-grow: 3;

		p + p {
			margin-top: 0.2em;
		}
	}

	.operations {
		display: flex;
		flex-basis: 10em;
		flex-grow: 1;
		flex-wrap: wrap;
		justify-content: end;
		gap: 0.2em 1rem;
	}
}

.link-tab {
	margin: 1rem;
}
</style>
