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
            class="md-text article"
            :class="{ 'md-story': data.type === 'story' }"
            :value="data"
            tag="article"
        />
        <ZPostFooter v-bind="data" />
        <ZSurroundPost />
        <ZComment />
        <template #empty>
            <div class="app-error">
                <Icon name="solar:confounded-square-bold-duotone" />
                <p>内容为空或页面不存在</p>
            </div>
        </template>
    </ContentRenderer>
</template>

<style lang="scss" scoped>
.md-text {
    margin: 1rem;
}
</style>
