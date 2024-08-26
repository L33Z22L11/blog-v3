<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'
import type ArticleProps from '~/types/article'
import type { OrderType } from '~/types'

defineProps<{
    list: (ParsedContent & ArticleProps)[]
    orderBy: OrderType
}>()

definePageMeta({
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
