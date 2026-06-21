<script setup lang="ts">
const route = useRoute()

const { data: post } = await useAsyncData(
	`content:${route.path}`,
	() => queryCollection('content').path(route.path).first(),
)

const excerpt = computed(() => post.value?.description || '')
const asideWidgetNames = computed<WidgetName[]>(() => {
	if (!post.value)
		return ['blog-log']
	return (post.value.meta?.aside as WidgetName[] | undefined) ?? ['toc']
})
const { widgets } = useWidgets(asideWidgetNames)

if (post.value) {
	useSeoMeta({
		title: post.value.title,
		ogType: 'article',
		ogImage: post.value.image,
		description: post.value.description,
	})
}
else {
	const event = useRequestEvent()
	event && setResponseStatus(event, 404)
	route.meta.title = '404'
}
</script>

<template>
<template #aside>
	<!-- 更换页面时相同 key 的组件不会更新 -->
	<component :is="widget.comp" v-for="widget in widgets" :key="widget.name" />
</template>

<template v-if="post">
	<PostHeader v-bind="post" />
	<PostExcerpt v-if="excerpt" :excerpt />
	<!-- 使用 float-in 动画会导致搜索跳转不准确 -->
	<ContentRenderer
		class="article"
		:class="getPostTypeClassName(post?.type, { prefix: 'md' })"
		:value="post"
		tag="article"
	/>

	<PostFooter v-bind="post" />
	<PostSurround />
	<PostComment />
</template>

<ZError
	v-else
	icon="line-md:document-delete-twotone"
	title="内容为空或页面不存在"
/>
</template>
