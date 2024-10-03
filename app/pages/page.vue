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
    <div class="mobile-only">
        <!-- 若不包裹，display: none 在 JS 加载后才有足够优先级 -->
        <ZhiluHeader to="/" />
    </div>
    <PostSlide v-if="listRecommended?.length && page === 1" :list="listRecommended" />
    <div class="post-list">
        <div class="toolbar">
            <div class="preview-entrance">
                <ZRawLink to="/preview">
                    <Icon name="ph:file-lock-bold" />
                    查看预览文章
                </ZRawLink>
            </div>
            <ZOrderToggle v-model="orderBy" class="order-toggle" />
        </div>
        <NuxtPage :list="listPaged" :order-by />
        <ZPagination v-model="page" :per-page :total-pages />
    </div>
</template>

<style scoped lang="scss">
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .preview-entrance {
        a {
            position: relative;
            opacity: 0;
            transition: all 0.2s 1s, color 0.2s;
            z-index: -1;
        }

        &:hover {
            a {
                opacity: 1;
                color: var(--c-primary);
                z-index: 0;
            }
        }
    }
}

.post-list {
    margin: 1rem;
}
</style>
