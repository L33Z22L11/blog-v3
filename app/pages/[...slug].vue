<script setup lang="ts">
const route = useRoute()

const layoutStore = useLayoutStore()
layoutStore.setAside(['toc'])

const { data: post } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
const excerpt = computed(() => post.value?.description || '')

if (post.value) {
    useSeoMeta({
        title: post.value.title,
        ogType: 'article',
        ogImage: post.value.image,
        description: post.value.description,
    })
    layoutStore.setAside(post.value.aside)
}
else {
    // // BUG: 部分文章在 Vercel 上以 404 状态码呈现，在 Linux SSG 模式下展示异常
    // const event = useRequestEvent()
    // event && setResponseStatus(event, 404)
    route.meta.title = '404'
    layoutStore.setAside(['blog-log'])
}
</script>

<template>
    <ContentRenderer :value="post">
        <PostHeader v-bind="post" />
        <PostExcerpt v-if="excerpt" :excerpt />
        <ContentRendererMarkdown
            class="article"
            :class="getPostTypeClassName(post?.type, { prefix: 'md' })"
            :value="post ?? {}"
            tag="article"
        />
        <template #empty>
            <ZError
                icon="solar:confounded-square-bold-duotone"
                title="内容为空或页面不存在"
            />
        </template>
        <PostFooter v-bind="post" />
        <PostSurround />
        <PostComment :key="route.path" />
    </ContentRenderer>
</template>

<style lang="scss" scoped>
.article {
    animation: float-in 0.2s backwards;
}
</style>
