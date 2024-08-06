<script setup lang="ts">
import type { ParsedContent, QueryBuilderParams } from '@nuxt/content'

useHead({ title: '' })
const appConfig = useAppConfig()
const route = useRoute()
const router = useRouter()

const page = ref(Number.parseInt(route.query.page as string || '1', 10))
const perPage = appConfig.indexGenerator.perPage || 10
const orderBy = ref(route.query.order as string || appConfig.indexGenerator.orderBy || 'date')

const archiveQuery: QueryBuilderParams = { path: '/post', sort: [{ [orderBy.value]: -1 }] }

function pageFilter(list: ParsedContent[]) {
    return list.filter((_, index) => index >= (page.value - 1) * perPage && index < page.value * perPage)
}

function onPageChange(newPage: number) {
    router.push({ query: { page: newPage } })
    page.value = newPage
}
</script>

<template>
    <div class="gradient-card active">
        <h3><Icon name="ph:lego-duotone" size="1.5rem" /> 本站仍处于开发阶段</h3>
        <p>
            站点开源在 <ZLink to="https://github.com/L33Z22L11/blog-v3">
                L33Z22L11/blog-v3
            </ZLink>，不代表最终呈现样式。
        </p>
    </div>
    <div class="post-list">
        <ContentList v-slot="{ list }" :query="archiveQuery">
            <ZArticle v-for="article in pageFilter(list)" :key="article._path" v-bind="article" :to="article._path" />
            <ZPagination
                v-if="appConfig.indexGenerator?.pagination !== false"
                :current-page="page"
                :per-page="perPage"
                :total-items="list.length"
                @page-change="onPageChange"
            />
        </ContentList>
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
