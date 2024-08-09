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
    'index_post',
    () => queryContent().where({ _original_dir: { $eq: '/posts' } }).find(),
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
        window.scrollTo({ top: 0, behavior: 'smooth' })
    })
})
</script>

<template>
    <div class="notify gradient-card active">
        <p>
            <Icon name="ph:lego-b" /> 本站仍处于开发阶段，不代表最终呈现样式。
        </p>
    </div>
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
