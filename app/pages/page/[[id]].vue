<script setup lang="ts">
import type { OrderType } from '~/types'
import type ArticleProps from '~/types/article'

defineProps<{
    list: (ArticleProps)[]
    orderBy: OrderType
}>()

definePageMeta({
    // 放在 page.vue 中会出问题
    alias: ['/'],
})
</script>

<template>
    <ZArticle
        v-for="article in list"
        :key="article._path"
        v-bind="article"
        :to="article._path"
        :use-updated="orderBy === 'updated'"
    />
</template>
