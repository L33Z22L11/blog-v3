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
layoutStore.setAside(['blog_stats', 'blog_log'])

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
            <div class="archive-title">
                <h2 class="archive-year">
                    {{ year }}
                </h2>
                <div class="archive-info">
                    <span>{{ yearlyWordCount[year] }}字</span>
                    <span>{{ yearGroup?.length }}篇</span>
                </div>
            </div>
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
    padding: 1rem 0;

    &:hover .archive-title {
        color: var(--c-text-3);
    }
}

.archive-title {
    display: flex;

    // align-items: center;
    justify-content: space-between;
    gap: 1em;
    position: sticky;
    opacity: 0.5;
    top: 0;
    font-size: min(1.5em, 5vw);
    color: transparent;
    transition: color 0.2s;

    .archive-year {
        margin-bottom: -0.3em;
        mask: linear-gradient(#fff 50%, transparent);
        font: 800 3em/1 var(--font-stroke-free);
        z-index: -1;
        -webkit-text-stroke: 1px var(--c-text-3);
    }

    .archive-info {
        display: flex;
        flex-grow: 1;
        justify-content: flex-end;
        column-gap: 0.5em;

        // border-top: 0.2em dashed;
        flex-wrap: wrap;
    }
}
</style>
