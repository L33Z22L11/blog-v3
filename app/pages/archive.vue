<script setup lang="ts">
import type { ParsedContent, QueryBuilderParams } from '@nuxt/content'

useHead({ title: '归档' })
const appConfig = useAppConfig()
const route = useRoute()

const orderBy = ref(route.query.order as string || appConfig.indexGenerator.orderBy || 'date')

const archiveQuery: QueryBuilderParams = { path: '/post', sort: [{ [orderBy.value]: -1 }] }

function groupByYear(list: ParsedContent[]): Partial<Record<string, ParsedContent[]>> {
    return Object.groupBy(list, article => new Date(article[orderBy.value]).getFullYear())
}
</script>

<template>
    <div class="archive">
        <ContentList v-slot="{ list }" :query="archiveQuery">
            <div
                v-for="year in Object.keys(groupByYear(list)).reverse()"
                :key="year"
                class="archive-group"
            >
                <h2 class="archive-year">
                    {{ year }}
                    <span class="archive-count">{{ groupByYear(list)[year]?.length }}</span>
                </h2>
                <ul class="archive-list">
                    <ZArchive
                        v-for="article in groupByYear(list)[year]"
                        :key="article._path"
                        v-bind="article"
                        :to="article._path"
                        :use-updated="orderBy === 'updated'"
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

.archive-count {
    position: absolute;
    right: 0;
}

.archive-list {
    li + li {
        margin-top: 4px;
    }
}
</style>
