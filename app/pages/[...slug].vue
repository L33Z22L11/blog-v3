<script setup lang="ts">
const route = useRoute()

const UIStore = useUIStore()
UIStore.setAside(['toc'])

const { data: post } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
const excerpt = post.value?.description || ''

if (post.value) {
    useContentHead(post.value)
    UIStore.setAside(post.value.aside)
}
else {
    // // BUG: 部分文章在 Vercel 上以 404 状态码呈现，在 Linux SSG 模式下展示异常
    // const event = useRequestEvent()
    // event && setResponseStatus(event, 404)
    route.meta.title = '404'
    UIStore.setAside (['blog_log'])
}
</script>

<template>
    <ContentRenderer :value="post">
        <ZPostHeader v-bind="post" />
        <ZExcerpt v-if="excerpt" :excerpt />
        <ContentRenderer
            class="article"
            :class="{ 'md-story': post?.type === 'story' }"
            :value="post ?? {}"
            tag="article"
        />
        <template #empty>
            <div class="app-error">
                <Icon name="solar:confounded-square-bold-duotone" />
                <p>内容为空或页面不存在</p>
            </div>
        </template>
        <ZPostFooter v-bind="post" />
        <ZSurroundPost />
        <ZComment :key="route.path" />
    </ContentRenderer>
</template>
