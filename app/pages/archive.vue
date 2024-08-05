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
    <div class="archive">
        <ContentList v-slot="{ list }" path="/post/">
            <div
                v-for="year in Object.keys(groupByYear(sortByDate(list))).sort((a, b) => b - a)"
                :key="year"
                class="archive-group"
            >
                <h2 class="archive-year">
                    {{ year }}
                </h2>
                <ul class="archive-list">
                    <ZArchive
                        v-for="article in groupByYear(sortByDate(list))[year]"
                        :key="article._path"
                        v-bind="article"
                        :link="article._path"
                    />
                </ul>
            </div>
        </ContentList>
    </div>
</template>

<style lang="scss" scoped>
.archive {
    margin: 1rem;
    mask: linear-gradient(var(--c-bg-1) 50%, var(--c-bg-a50));
}

.archive-group {
    position: relative;
    margin: 1rem 0;

    &:hover > .archive-year {
        color: var(--c-text-3);
    }
}

.archive-year {
    position: sticky;
    opacity: 0.5;
    top: 3rem;
    margin-bottom: -2rem;
    mask: linear-gradient(var(--c-bg-1) 50%, transparent);
    font-size: 5rem;
    color: transparent;
    transition: color 0.2s;
    -webkit-text-stroke: 1px var(--c-text-3);
}

.archive-list {
}
</style>
