<script setup lang="ts">
import { alphabetical } from 'radash'

const appConfig = useAppConfig()
useSeoMeta({
    title: '预览',
    description: `${appConfig.title}的预览。`,
})
const orderBy = useRouteQuery(
    'order',
    () => appConfig.indexGenerator.orderBy || 'date',
)

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog_log'])

const { data: listRaw } = await useAsyncData(
    'preview_list',
    () => queryContent('previews')
        .only(['_path', 'categories', 'image', 'date', 'description', 'readingTime', 'title', 'updated'])
        .find(),
    { default: () => [] },
)

const listSorted = computed(() => alphabetical(
    listRaw.value,
    item => item[orderBy.value],
    'desc',
))
</script>

<template>
    <div class="preview">
        <div class="preview-header">
            <div>
                <h1>
                    <ZRawLink class="mobile-only" to="/">
                        <Icon name="ph:caret-left-bold" />
                    </ZRawLink>预览
                </h1>
            </div>
            <ZOrderToggle v-model="orderBy" />
        </div>
        <p>勇敢的人探索世界。这里是一些还未发布的文章。</p>

        <menu>
            <ZArticle
                v-for="article in listSorted"
                :key="article._path"
                v-bind="article"
                :to="article._path"
                :use-updated="orderBy === 'updated'"
            />
        </menu>
    </div>
</template>

<style lang="scss" scoped>
.preview {
    margin: 1rem;
}

.preview-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    mask: linear-gradient(#fff, transparent);
}
</style>
