<script setup>
const route = useRoute()
const { data } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
const excerpt = data.value?.description || data.value?.excerpt || ''

useHead({
    title: data.value?.title,
    meta: [
        { name: 'description', content: excerpt },
    ],
})

definePageMeta({
    aside: ['toc'],
})

const event = useRequestEvent()
if (data.value === undefined)
    setResponseStatus(event, 404)
</script>

<template>
    <ContentRenderer :value="data">
        <ZPostHeader v-bind="data" />
        <ZExcerpt v-if="excerpt" :excerpt />
        <ContentRendererMarkdown
            class="article"
            :class="{ 'md-story': data.type === 'story' }"
            :value="data"
            tag="article"
        />
        <template #empty>
            <div class="app-error">
                <Icon name="solar:confounded-square-bold-duotone" />
                <p>内容为空或页面不存在</p>
            </div>
        </template>
        <ZPostFooter v-bind="data" />
        <ZSurroundPost />
        <ZComment />
    </ContentRenderer>
</template>
