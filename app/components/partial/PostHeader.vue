<script setup lang="ts">
import type ArticleProps from '~/types/article'

const props = defineProps<ArticleProps>()
const appConfig = useAppConfig()
const publishedLabel = getPostDate(props.date)
const updatedLabel = getPostDate(props.updated)

const categoryLabel = props.categories?.[0]
const categoryIcon = appConfig.article.categories[categoryLabel!]?.icon

const postDate = ref<HTMLElement>()
const postUpdated = ref<HTMLElement>()
// TODO: Update reason display

useTooltip(postDate, getLocaleDatetime(props.date))
useTooltip(postUpdated, getLocaleDatetime(props.updated))
</script>

<template>
    <!-- 💩夸克浏览器，桌面端只有IE不支持 :has() 了 -->
    <div class="post-header" :class="{ 'has-cover': image, 'text-revert': cover_revert }">
        <NuxtImg v-if="image" class="post-cover" :src="image" :alt="title" />
        <div class="post-nav">
            <div v-if="!hideInfo" class="post-info">
                <time v-if="date" ref="postDate" :datetime="date">
                    <Icon name="ph:calendar-dots-bold" /> {{ publishedLabel }}</time>
                <time v-if="updated" ref="postUpdated" :datetime="updated">
                    <Icon name="ph:calendar-plus-bold" /> {{ updatedLabel }}</time>
                <span v-if="categoryLabel" class="article-category">
                    <Icon :name="categoryIcon" />
                    {{ categoryLabel }}
                </span>
                <span class="wordcount">
                    <Icon name="ph:paragraph-bold" /> {{ readingTime.words }} 字
                </span>
            </div>
        </div>
        <h1 class="post-title" :class="{ 'text-story text-center': type === 'story' }">
            {{ title }}
        </h1>
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

    &.has-cover {
        position: relative;
        overflow: hidden;
        min-height: 256px;
        max-height: 320px;
        text-shadow: 0 1px 1px #0003, 0 1px 2px #0003;
        color: white;
        transition: font-size 0.2s;
        z-index: 0;

        &:hover {
            font-size: 0.8em;
        }

        .post-title {
            background-image: linear-gradient(transparent, #0003, #0005);
        }

        &.text-revert {
            text-shadow: 0 0 2px #fff, 0 1px 0.5em #fff;
            color: #333;

            .post-title {
                background-image: linear-gradient(transparent, #fff3, #fff5);
            }
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
}

.post-title {
    padding: 0.8em 1rem;
    font-size: 1.8em;
    line-height: 1.2;
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
