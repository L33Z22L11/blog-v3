<script setup lang="ts">
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type ArticleProps from '~/types/article'

const props = defineProps<ArticleProps>()

const publishedLabel = getPostTime(props.date)
const updatedLabel = getPostTime(props.updated)
function getPostTime(date: string) {
    const postDate = new Date(date)
    const now = new Date()
    if (postDate.getTime() > now.getTime() - 1000 * 60 * 60 * 24 * 7) {
        return formatDistanceToNow(postDate, { addSuffix: true, locale: zhCN })
    }
    else if (postDate.getFullYear() === now.getFullYear()) {
        return format(postDate, 'M月d日')
    }
    else {
        return format(postDate, 'yy年M月d日')
    }
}
</script>

<template>
    <ZRawLink class="article-card">
        <div class="article-header">
            <time v-if="publishedLabel !== updatedLabel" :datetime="updated">
                {{ updatedLabel }}</time>
            <time :datetime="date">{{ publishedLabel }}</time>
        </div>
        <h2 class="article-title">
            {{ title }}
        </h2>
        <p class="article-descrption">
            {{ description }}
        </p>
    </ZRawLink>
</template>

<style lang="scss" scoped>
.article-card {
    display: block;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
        background-color: var(--c-primary-soft);
    }

    >* {
        margin: 8px;
    }
}

.article-header {
    display: flex;
    gap: 0.8em;
    font-size: 0.8em;
    color: var(--c-text-2);

    >time + time {
        color: var(--c-text-3);
    }
}

.article-title {
    font-size: 1.2em;
    font-weight: normal;
}

.article-descrption {
    color: var(--c-text-2);
}
</style>
