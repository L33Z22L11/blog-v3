<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

function sortByDate(list: ParsedContent[]) {
    return list.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function groupByYear(list: ParsedContent[]) {
    return list.reduce((acc: Record<string, ParsedContent[]>, article) => {
        const year = new Date(article.date).getFullYear()
        if (!acc[year]) {
            acc[year] = []
        }
        acc[year].push(article)
        return acc
    }, {})
}
</script>

<template>
    <div class="archive-list">
        <ContentList v-slot="{ list }" path="/">
            <template v-for="year in Object.keys(groupByYear(sortByDate(list))).sort((a, b) => b - a)" :key="year">
                <h2 class="archive-year">
                    {{ year }}
                </h2>
                <ZArchive
                    v-for="article in groupByYear(sortByDate(list))[year]"
                    :key="article._path"
                    v-bind="article"
                    :to="article._path"
                />
            </template>
        </ContentList>
    </div>
</template>

<style lang="scss" scoped>
.archive-list {
    margin: 1rem;
}

.archive-year {
    margin: 1rem 1rem -2rem;
    font-family: Helvetica, sans-serif;
    font-size: 5rem;
    font-weight: bold;
    color: transparent;
    z-index: -1;
    -webkit-text-stroke: 2px var(--c-text-3);
}
</style>
