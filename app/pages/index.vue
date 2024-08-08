<script setup lang="ts">
import type { OrderType } from '~/types'

useHead({ title: '' })
const appConfig = useAppConfig()

const perPage = appConfig.indexGenerator.perPage || 10
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

const { page, totalPages, pagedList } = usePagination(list, {
    perPage,
    query: true,
})
</script>

<template>
    <div class="notify gradient-card active">
        <p>
            <Icon name="ph:lego-duotone" /> 本站仍处于开发阶段，不代表最终呈现样式。
        </p>
    </div>
    <div class="post-list">
        <ZPagination v-model="page" :per-page :total-pages />
        <ZOrderToggle v-model="orderBy" class="order-toggle" />
        <ZArticle
            v-for="article in pagedList"
            :key="article._path"
            v-bind="article"
            :to="article._path"
            :use-updated="orderBy === 'updated'"
        />
        <ZPagination v-model="page" :per-page :total-pages />
    </div>
</template>

<style lang="scss" scoped>
.notify {
    position: sticky;
    top: 0;
    margin: 1rem;
    padding: 1rem;
    backdrop-filter: blur(2px);
    z-index: 1;

    .iconify {
        font-size: 1.2em;
        vertical-align: middle;
    }
}

.post-list {
    margin: 1rem;
}
</style>
