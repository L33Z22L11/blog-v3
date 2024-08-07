<script setup lang="ts">
import type { OrderType } from '~/types'

useHead({ title: '' })
const appConfig = useAppConfig()
const route = useRoute()
const router = useRouter()

const perPage = appConfig.indexGenerator.perPage || 10
const orderBy = ref(route.query.order as OrderType || appConfig.indexGenerator.orderBy || 'date')

const { data } = await useAsyncData(
    'index_post',
    () => queryContent('/post').sort({ [orderBy.value]: -1 }).find(),
    { watch: [orderBy] },
)

watch(orderBy, () => {
    router.push({ query: { order: orderBy.value } })
})

const list = computed(() => data.value || [])

const { page, totalPages, pagedList } = usePagination(list, {
    initialPage: Number(route.query.page) || 1,
    perPage,
})

watch(page, (newPage) => {
    router.push({ query: { page: newPage } })
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
