<script setup lang="ts">
import { alphabetical } from 'radash'
import type { OrderType } from '~/types'

useHead({ title: '' })
definePageMeta({
    aside: ['blog_log', 'connectivity'],
})
const appConfig = useAppConfig()

const perPage = appConfig.indexGenerator.perPage || 10
const orderBy = useRouteQuery<OrderType>(
    'order',
    () => appConfig.indexGenerator.orderBy as OrderType || 'date',
)

const { data } = await useAsyncData(
    'posts_index',
    () => queryContent()
        .only(['title', 'description', 'date', 'updated', '_path', 'cover'])
        .where({ _original_dir: { $eq: '/posts' } })
        .find(),
    { default: () => [] },
)

const list = computed(() => alphabetical(
    data.value,
    item => item[orderBy.value],
    'desc',
))

const { page, totalPages, pagedList } = usePagination(list, {
    perPage,
    bindQuery: true,
})

useHead({ title: () => page.value > 1 ? `第${page.value}页` : '' })

onMounted(() => {
    watch(page, () => {
        window.scrollTo({ top: 0 })
    })
})
</script>

<template>
    <ZhiluHeader class="header" />
    <div class="post-list">
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
.header {
    display: none;
    margin-inline: 1rem;

    @media (max-width: $breakpoint-mobile) {
        display: flex;
    }
}

.post-list {
    margin: 1rem;
}
</style>
