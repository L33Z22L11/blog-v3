<script setup lang="ts">
import { alphabetical, group } from 'radash'

const appConfig = useAppConfig()
useSeoMeta({
    title: '归档',
    description: `${appConfig.title}的所有文章归档。`,
})
const orderBy = useRouteQuery(
    'order',
    () => appConfig.indexGenerator.orderBy || 'date',
)

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog_log', 'blog_stats'])

const { data: listRaw } = await useAsyncData(
    'posts_archive',
    () => queryContent()
        .only(['_path', 'image', 'date', 'description', 'readingTime', 'title', 'updated'])
        .where({ _original_dir: { $eq: '/posts' } })
        .find(),
    { default: () => [] },
)

const listSorted = computed(() => alphabetical(
    listRaw.value,
    item => item[orderBy.value],
    'desc',
))

const listGrouped = computed(() => Object
    .entries(group(listSorted.value, article =>
        new Date(article[orderBy.value]).getFullYear()))
    .reverse(),
)

const yearlyWordCount = computed(() => {
    return listGrouped.value.reduce<Record<string, string>>((acc, [year, yearGroup]) => {
        const totalWords = yearGroup?.reduce((sum, cur) => sum + cur.readingTime.words, 0) || 0
        acc[year] = formatNumber(totalWords)
        return acc
    }, {})
})
</script>

<template>
    <div class="archive">
        <ZOrderToggle v-model="orderBy" />
        <div
            v-for="[year, yearGroup] in listGrouped"
            :key="year"
            class="archive-group"
        >
            <h2 class="archive-year" :data-count="yearGroup?.length" :data-words="yearlyWordCount[year]">
                {{ year }}
            </h2>
            <menu class="archive-list">
                <ZArchive
                    v-for="article in yearGroup"
                    :key="article._path"
                    v-bind="article"
                    :to="article._path"
                    :use-updated="orderBy === 'updated'"
                />
            </menu>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.archive {
    margin: 1rem;
    mask: linear-gradient(#fff 50%, #fff5);
}

.archive-group {
    margin: 1rem 0;

    &:hover .archive-year {
        color: var(--c-text-3);
    }
}

.archive-year {
    position: sticky;
    opacity: 0.5;
    top: 0;
    margin-bottom: -0.3em;
    mask: linear-gradient(#fff 50%, transparent);
    font: 700 5rem/1 var(--font-stroke-free);
    color: transparent;
    transition: color 0.2s;
    z-index: -1;
    -webkit-text-stroke: 1px var(--c-text-3);

    &::after {
        content: attr(data-words) "字\a" attr(data-count) "篇";
        position: absolute;
        right: 0;
        font-size: 1.5rem;
        line-height: normal;
        white-space: pre;
        text-align: right;
        -webkit-text-stroke-width: 0;
    }
}
</style>
