<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'
import type ArticleProps from '~/types/article'

const props = defineProps<ParsedContent & ArticleProps>()

const publishedLabel = getPostTime(props.date ?? '0')
const updatedLabel = getPostTime(props.updated ?? '0')
</script>

<template>
    <div class="post-header" :class="{ 'has-cover': cover }">
        <NuxtImg v-if="cover" class="post-cover" :src="cover" :alt="title" />
        <div class="post-nav">
            <div class="post-info">
                <time v-if="date" :datetime="date">
                    <Icon name="solar:calendar-add-bold-duotone" /> {{ publishedLabel }}</time>
                <time v-if="updated" :datetime="updated">
                    <Icon name="solar:pen-2-bold-duotone" /> {{ updatedLabel }}</time>
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
    margin: 0.5rem;
    border-radius: 1rem;
    background-color: var(--c-bg-3);

    @media (max-width: $breakpoint-mobile) {
        margin: 0;
        border-radius: 0;
    }

    &.has-cover {
        position: relative;
        overflow: hidden;
        min-height: 256px;
        max-height: 320px;
        text-shadow: 0 0 0.5em #0005;
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
}

.post-title {
    position: relative;
    padding: 0.8em 1rem;
    font-size: 1.8em;
    font-weight: 700;
    line-height: 1.2;

    &.center {
        font-family: var(--font-serif);
        text-align: center;
    }

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        backdrop-filter: blur(1rem);
        mask: linear-gradient(transparent, var(--c-bg-1) 40%);
        z-index: -1;
    }
}

.post-nav {
    padding: 0.8em 1rem;

    // 如果在父级设置字体尺寸，会影响祖先字体尺寸改变的行为
    // 并且设置相对尺寸会导致过渡
    >* {
        font-size: 0.8rem;
    }

    .post-info {
        display: flex;
        gap: 1em;
    }
}
</style>
