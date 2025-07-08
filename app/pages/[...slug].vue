<script setup lang="ts">
const route = useRoute()

const layoutStore = useLayoutStore()
layoutStore.setAside(['toc'])

const { data: post } = await useAsyncData(
    route.path,
    () => queryCollection('content').path(route.path).first(),
)

const excerpt = computed(() => post.value?.description || '')

console.log(post.value)

if (post.value) {
    useSeoMeta({
        title: post.value.title,
        ogType: 'article',
        ogImage: post.value.image,
        description: post.value.description,
    })
    layoutStore.setAside(post.value.meta?.aside as string[])
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
    <template v-if="post">
        <PostHeader v-bind="post" />
        <PostExcerpt v-if="excerpt" :excerpt />
        <ContentRenderer
            v-if="post"
            class="article"
            :class="getPostTypeClassName(post?.type, { prefix: 'md' })"
            :value="post"
            tag="article"
        />

        <PostFooter v-bind="post" />
        <PostSurround />
        <PostComment :key="route.path" />
    </template>
    <ZError
        v-else
        icon="solar:confounded-square-bold-duotone"
        title="内容为空或页面不存在"
    />
</template>

<style lang="scss" scoped>
.article {
    animation: float-in 0.2s backwards;
}
</style>
