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
    { default: () => [] }
)

const list = computed(() => data.value.sort(
    (a, b) => b[orderBy.value].localeCompare(a[orderBy.value])
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
    <ZOrderToggle v-model="orderBy" class="order-toggle" />
    <div class="post-list">
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
    margin: 1rem;
    padding: 1rem;

    .iconify {
        font-size: 1.2em;
        vertical-align: middle;
    }
}

.order-toggle {
    margin: 1rem;
}

.post-list {
    margin: 1rem;
}
</style>
