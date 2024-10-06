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

const UIStore = useUIStore()
UIStore.setAside(['blog_log', 'blog_stats'])

const { data: listRaw } = await useAsyncData(
    'posts_archive',
    () => queryContent()
        .only(['_path', 'image', 'date', 'description', 'title', 'updated'])
        .where({ _original_dir: { $eq: '/posts' } })
        .find(),
    { default: () => [] },
)

const listSorted = computed(() => alphabetical(
    listRaw.value,
    item => item[orderBy.value],
    'desc',
))

const listGrouped = computed(
    () => Object.entries(group(
        listSorted.value,
        article => new Date(article[orderBy.value]).getFullYear(),
    )).reverse(),
)
</script>

<template>
    <div class="archive">
        <ZOrderToggle v-model="orderBy" />
        <div
            v-for="[year, yearGroup] in listGrouped"
            :key="year"
            class="archive-group"
        >
            <h2 class="archive-year" :data-count="yearGroup?.length">
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
    // position: relative;
    margin: 1rem 0;

    &:hover > .archive-year {
        color: var(--c-text-3);
    }
}

.archive-year {
    position: sticky;
    opacity: 0.5;
    top: 0;
    margin-bottom: -0.3em;
    mask: linear-gradient(#fff 50%, transparent);
    font-size: 5rem;
    line-height: 1;
    color: transparent;
    transition: color 0.2s;
    z-index: -1;
    -webkit-text-stroke: 1px var(--c-text-3);

    &::after {
        content: attr(data-count) "篇";
        position: absolute;
        right: 0;
        font-size: 0.6em;
        -webkit-text-stroke-width: 0;
    }
}
</style>
