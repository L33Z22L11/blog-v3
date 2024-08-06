<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

const appConfig = useAppConfig()

useHead({ title: '' })
const route = useRoute()
const router = useRouter()

const page = computed(() => Number.parseInt(route.params.page || '1', 10))
const perPage = appConfig.indexGenerator.perPage

function indexFilter(list: ParsedContent[]) {
    const sortedList = sortByOrder(list)
    const startIndex = (page.value - 1) * perPage
    const endIndex = startIndex + perPage

    return sortedList.slice(startIndex, endIndex)
}

function sortByOrder(list: ParsedContent[]): ParsedContent[] {
    return list.slice().sort((a, b) => new Date(b.updated || b.date).getTime() - new Date(a.updated || b.date).getTime())
}

function onPageChange(newPage: number) {
    router.push({ params: { page: newPage } })
}
</script>

<template>
    <div class="post-list">
        <ContentList v-slot="{ list }" path="/post/">
            <ZArticle v-for="article in indexFilter(list)" :key="article._path" v-bind="article" :to="article._path" />
            <ZPagination
                v-if="appConfig.indexGenerator?.pagination !== false"
                :total="list.length"
                :per-page="appConfig.indexGenerator.perPage"
                :current_page="page"
                @page-change="onPageChange"
            />
        </ContentList>
    </div>
</template>

<style lang="scss" scoped>
.post-list {
    margin: 1rem;
}
</style>
