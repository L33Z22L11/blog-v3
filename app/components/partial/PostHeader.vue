<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'
import type { ArticleCategory } from '~/types/article'
import type ArticleProps from '~/types/article'

const props = defineProps<ParsedContent & ArticleProps>()
const appConfig = useAppConfig()
const publishedLabel = getPostTime(props.date)
const updatedLabel = getPostTime(props.updated)

const categoryLabel = props.categories?.[0] as ArticleCategory
const categoryIcon = appConfig.article.categories?.[categoryLabel]?.icon
</script>

<template>
    <div class="post-header">
        <NuxtImg v-if="cover" class="post-cover" :src="cover" :alt="title" />
        <div class="post-nav">
            <div class="post-info">
                <time v-if="date" :datetime="date">
                    <Icon name="solar:calendar-add-bold-duotone" /> {{ publishedLabel }}</time>
                <time v-if="updated" :datetime="updated">
                    <Icon name="solar:pen-2-bold-duotone" /> {{ updatedLabel }}</time>
                <span v-if="categoryLabel" class="article-category">
                    <Icon :name="categoryIcon" />
                    {{ categoryLabel }}
                </span>
                <span class="wordcount">
                    <!-- <Icon name="solar:text-bold-duotone" /> {{ getWordCount(props.body) }} -->
                </span>
            </div>
        </div>
        <h2 class="post-title" :class="{ 'text-revert': props.revert, 'center': props.type === 'story' }">
            {{ title }}
        </h2>
    </div>
</template>

<style scoped lang="scss">
.post-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
    margin: 0.5rem;
    border-radius: 1rem;
    background-color: var(--c-bg-2);
    color: var(--c-text);

    @media (max-width: $breakpoint-mobile) {
        margin: 0;
        border-radius: 0;
    }

    &:has(.post-cover) {
        position: relative;
        overflow: hidden;
        min-height: 256px;
        max-height: 320px;
        text-shadow: 0 1px 1px #0003, 0 1px 2px #0003;
        color: white;
        transition: font-size 0.2s;
        z-index: 0;

        &.text-revert {
            color: #333;
        }

        &:hover {
            font-size: 0.8em;
        }
    }
}

.post-cover {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;

    & ~ .post-title {
        background-image: linear-gradient(transparent, #0003, #0005);
    }
}

.post-title {
    padding: 0.8em 1rem;
    font-size: 1.8em;
    font-weight: 700;
    line-height: 1.2;

    &.center {
        font-family: var(--font-serif);
        text-align: center;
    }
}

.post-nav {
    opacity: 0.9;
    padding: 0.8em 1rem;

    // 如果在父级设置字体尺寸，会影响祖先字体尺寸改变的行为
    // 并且设置相对尺寸会导致过渡
    >* {
        font-size: 0.8rem;
    }

    .post-info {
        display: flex;
        gap: 0.5em 1.2em;
        column-gap: clamp(1em, 3cqw, 1.5em);
        flex-wrap: wrap;
    }
}
</style>
