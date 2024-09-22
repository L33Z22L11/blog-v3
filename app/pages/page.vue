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

const { data: listRaw } = await useAsyncData(
    'posts_index',
    () => queryContent()
        .only(['_path', 'categories', 'image', 'date', 'description', 'readingTime', 'recommend', 'title', 'updated'])
        .where({ _original_dir: { $eq: '/posts' } })
        .find(),
    { default: () => [] },
)

const listSorted = computed(() => alphabetical(
    listRaw.value,
    item => item[orderBy.value],
    'desc',
))

const { page, totalPages, listPaged } = usePagination(listSorted, {
    perPage,
    bindParam: 'id',
})

const listRecommended = computed(() => sort(
    listRaw.value.filter(item => item?.recommend),
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
    <div class="header">
        <!-- 若不包裹，display: none 在 JS 加载后才有足够优先级 -->
        <ZhiluHeader to="/" />
    </div>
    <ZSlide v-if="page === 1" :list="listRecommended" />
    <div class="post-list">
        <!-- TODO: 显示 /preview 入口 -->
        <ZOrderToggle v-model="orderBy" class="order-toggle" />
        <NuxtPage :list="listPaged" :order-by />
        <ZPagination v-model="page" :per-page :total-pages />
    </div>
</template>

<style scoped lang="scss">
.header {
    display: none;

    @media (max-width: $breakpoint-mobile) {
        display: block;
    }
}

.post-list {
    margin: 1rem;
}
</style>
