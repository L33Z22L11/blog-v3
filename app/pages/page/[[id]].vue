<script setup lang="ts">
import type { ArticleOrderType } from '~/types/article'
import type ArticleProps from '~/types/article'

defineProps<{
    list: ArticleProps[]
    orderBy: ArticleOrderType
}>()

definePageMeta({
    // 放在 page.vue 中会出问题
    alias: ['/'],
})
</script>

<template>
    <!-- FIXME: 指定 id 范围以 SSG -->
    <ZArticle
        v-for="article in list"
        :key="article._path"
        v-bind="article"
        :to="article._path"
        :use-updated="orderBy === 'updated'"
    />
</template>
