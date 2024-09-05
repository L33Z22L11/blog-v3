<script setup lang="ts">
const route = useRoute()
const UIStore = useUIStore()

UIStore.setAside(['toc'])

const { data } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
const excerpt = data.value?.description || ''

useHead({
    title: data.value?.title,
})

if (data.value?.aside) {
    UIStore.setAside(data.value.aside)
}

const event = useRequestEvent()
if (data.value === undefined) {
    setResponseStatus(event!, 404)
    route.meta.title = '404'
    UIStore.setAside (['blog_log'])
}
</script>

<template>
    <ContentRenderer :value="data">
        <!-- FIXME: Type mismatch -->
        <ZPostHeader v-bind="data" />
        <ZExcerpt v-if="excerpt" :excerpt />
        <ContentRendererMarkdown
            class="article"
            :class="{ 'md-story': data!.type === 'story' }"
            :value="data!"
            tag="article"
        />
        <template #empty>
            <div class="app-error">
                <Icon name="solar:confounded-square-bold-duotone" />
                <p>内容为空或页面不存在</p>
            </div>
        </template>
        <!-- FIXME: Type mismatch -->
        <ZPostFooter v-bind="data" />
        <ZSurroundPost />
        <ZComment :key="route.path" />
    </ContentRenderer>
</template>
