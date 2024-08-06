<script setup lang="ts">
useHead({ title: '' })
const appConfig = useAppConfig()
const route = useRoute()
const router = useRouter()

const perPage = appConfig.indexGenerator.perPage || 10
const orderBy = ref(route.query.order as string || appConfig.indexGenerator.orderBy || 'date')

const { data } = await useAsyncData(
    'index_post',
    () => queryContent('/post').sort({ [orderBy.value]: -1 }).find(),
)

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
    <div class="gradient-card active">
        <h3>
            <Icon name="ph:lego-duotone" size="1.5rem" /> 本站仍处于开发阶段
        </h3>
        <p>
            站点开源在 <ZLink to="https://github.com/L33Z22L11/blog-v3">
                L33Z22L11/blog-v3
            </ZLink>，不代表最终呈现样式。
        </p>
    </div>
    <div class="post-list">
        <ZArticle v-for="article in pagedList" :key="article._path" v-bind="article" :to="article._path" />
        <ZPagination v-model="page" :per-page :total-pages />
    </div>
</template>

<style lang="scss" scoped>
.post-list {
    margin: 1rem;
}

.gradient-card {
    margin: 1rem;
    padding: 1rem;
}
</style>
