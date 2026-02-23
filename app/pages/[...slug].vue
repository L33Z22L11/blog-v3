<script setup lang="ts">
const route = useRoute()

const layoutStore = useLayoutStore()
layoutStore.setAside(['toc'])

const { data: post } = await useFetch(`/api/content${route.path}`)

if (post.value) {
	useSeoMeta({
		title: post.value.frontmatter.title,
		ogType: 'article',
		ogImage: post.value.frontmatter.image,
		description: post.value.frontmatter.description,
	})
	layoutStore.customAsideWidgets = post.value.slots || {}
	layoutStore.setAside(post.value.frontmatter.aside as WidgetName[] | undefined)
}
else {
	const event = useRequestEvent()
	event && setResponseStatus(event, 404)
	route.meta.title = '404'
	layoutStore.setAside(['blog-log'])
}

if (import.meta.dev) {
	watchEffect(() => {
		layoutStore.setAside(post.value?.frontmatter.aside as WidgetName[] | undefined)
	})
}
</script>

<template>
<template v-if="post">
	<PostHeader v-bind="post.frontmatter" />
	<PostExcerpt v-if="post?.frontmatter.description" :excerpt="post.frontmatter.description" />
	<PostRender :body="post.body" />
	<!-- <ContentRenderer
		class="article"
		:class="getPostTypeClassName(post?.type, { prefix: 'md' })"
		:value="post"
		tag="article"
	/> -->

	<PostFooter v-bind="post" />
	<PostSurround />
	<PostComment />
</template>

<ZError
	v-else
	icon="solar:confounded-square-bold-duotone"
	title="内容为空或页面不存在"
/>
</template>
