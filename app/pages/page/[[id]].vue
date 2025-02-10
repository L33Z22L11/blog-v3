<script setup lang="ts">
import type { ArticleOrderType } from '~/types/article'
import type ArticleProps from '~/types/article'

defineProps<{
    list: ArticleProps[]
    sortOrder: ArticleOrderType
}>()

definePageMeta({
    // 放在 page.vue 中会出问题
    alias: ['/'],
})

// 使用 VueUse 的 useRouteParams 时，会直接跳转到顶部
// 无法实现翻页滚回顶部动画
</script>

<template>
    <!-- FIXME: 指定 id 范围以 SSG -->
    <TransitionGroup name="float-in">
        <ZArticle
            v-for="article, index in list"
            :key="article._path"
            v-bind="article"
            :to="article._path"
            :use-updated="sortOrder === 'updated'"
            :style="{ '--delay': `${index * 0.05}s` }"
        />
    </TransitionGroup>
</template>
