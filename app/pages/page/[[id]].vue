<script setup lang="ts">
import type { ArticleOrderType } from '~/types/article'
import type ArticleProps from '~/types/article'

const props = defineProps<{
    list: ArticleProps[]
    sortOrder: ArticleOrderType
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
    <TransitionGroup appear>
        <ZArticle
            v-for="article, index in list"
            :key="article._path"
            v-bind="article"
            :to="article._path"
            :use-updated="sortOrder === 'updated'"
            :style="{ '--dalay': `${index * 0.1}s` }"
        />
    </TransitionGroup>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transition: all 0.2s;
    transition-delay: var(--dalay);
}

.v-leave-active {
    position: absolute;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateY(10%);
}
</style>
