<script setup lang="ts">
import { alphabetical, sort } from 'radash'

const appConfig = useAppConfig()
useSeoMeta({
    description: appConfig.description,
})
const perPage = appConfig.indexGenerator.perPage || 10
const orderBy = ref(appConfig.indexGenerator.orderBy || 'date')

const UIStore = useUIStore()
UIStore.setAside(['blog_log', 'blog_stats', 'connectivity'])

const { data } = await useAsyncData(
    'posts_index',
    () => queryContent()
        .only(['_path', 'categories', 'cover', 'date', 'description', 'readingTime', 'recommend', 'title', 'updated'])
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
    bindParam: 'id',
})

const slideList = computed(() => sort(
    data.value.filter(item => item?.recommend),
    post => post.recommend,
    true,
))

useSeoMeta({
    title: () => page.value > 1 ? `第${page.value}页` : '',
})

// 兼容 SSR
onMounted(() => {
    watch(page, () => {
        window.scrollTo({ top: 0 })
    })
})
</script>

<template>
    <ZhiluHeader class="header" to="/" />
    <ZSlide v-if="page === 1" :list="slideList" />
    <div class="post-list">
        <ZOrderToggle v-model="orderBy" class="order-toggle" />
        <NuxtPage :list="pagedList" :order-by />
        <ZPagination v-model="page" :per-page :total-pages />
    </div>
</template>

<style lang="scss" scoped>
.header {
    display: none;
    margin-inline: 1rem;

    @media (max-width: $breakpoint-mobile) {
        display: flex;
        align-items: center;
    }
}

.post-list {
    margin: 1rem;
}
</style>
