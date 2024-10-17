<script setup lang="ts">
import type { ArticleOrderType } from '~/types/article'
import type ArticleProps from '~/types/article'

const props = defineProps<{
    list: ArticleProps[]
    orderBy: ArticleOrderType
}>()

definePageMeta({
    // 放在 page.vue 中会出问题
    alias: ['/'],
})

// 父级更新时滚动到顶部，若书写在父级中需在客户端中执行
watch(props, () => {
    window.scrollTo({ top: 0 })
})
</script>

<template>
    <!-- FIXME: 指定 id 范围以 SSG -->
    <TransitionGroup>
        <ZArticle
            v-for="article in list"
            :key="article._path"
            v-bind="article"
            :to="article._path"
            :use-updated="orderBy === 'updated'"
        />
    </TransitionGroup>
</template>
