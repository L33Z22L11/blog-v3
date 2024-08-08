<script setup lang="ts">
import { group } from 'radash'
import type { OrderType } from '~/types'

useHead({ title: '归档' })
const appConfig = useAppConfig()

const orderBy = useRouteQuery<OrderType>(
    'order',
    () => appConfig.indexGenerator.orderBy as OrderType || 'date',
)

const { data } = await useAsyncData(
    'index_post',
    () => queryContent('/post').find(),
    { default: () => [] },
)

const list = computed(() => data.value.toSorted(
    (a, b) => b[orderBy.value].localeCompare(a[orderBy.value]),
))

const groupedList = computed(
    () => Object.entries(group(
        list.value,
        article => new Date(article[orderBy.value]).getFullYear(),
    )).reverse(),
)
</script>

<template>
    <div class="archive">
        <ZOrderToggle v-model="orderBy" />
        <div
            v-for="[year, yearGroup] in groupedList"
            :key="year"
            class="archive-group"
        >
            <h2 class="archive-year">
                {{ year }}
                <span class="archive-count">{{ yearGroup!.length }}</span>
            </h2>
            <ul class="archive-list">
                <ZArchive
                    v-for="article in yearGroup"
                    :key="article._path"
                    v-bind="article"
                    :to="article._path"
                    :use-updated="orderBy === 'updated'"
                />
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.archive {
    margin: 1rem;
    mask: linear-gradient(var(--c-bg-1) 50%, var(--c-bg-a50));
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
    margin-bottom: -2rem;
    mask: linear-gradient(var(--c-bg-1) 50%, transparent);
    font-size: 5rem;
    color: transparent;
    transition: color 0.2s;
    z-index: -1;
    -webkit-text-stroke: 1px var(--c-text-3);
}

.archive-count {
    position: absolute;
    right: 0;
}
</style>
