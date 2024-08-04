<script setup lang="ts">
import { format } from 'date-fns'
import type ArticleProps from '~/types/article'

const props = defineProps<ArticleProps>()

const datetime = computed(() => format(new Date(props.date), 'MM-dd'))
</script>

<template>
    <ZRawLink class="article-line">
        <time :datetime="date">{{ datetime }}</time>
        <span class="article-title">
            {{ title }}
        </span>
        <NuxtImg v-if="cover" class="article-cover" :src="cover" :alt="title" />
    </ZRawLink>
</template>

<style lang="scss" scoped>
.article-line {
    display: block;
    position: relative;
    overflow: hidden;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
        background-color: var(--c-primary-soft);

        .article-cover {
            width: 50%;
        }
    }

    & + & {
        margin-top: 2px;
    }

    >* {
        margin: 8px;
    }
}

.article-cover {
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
    height: 100%;
    margin: 0;
    mask: linear-gradient(to right, transparent, var(--c-bg-a50));
    transition: 0.2s;
    object-fit: cover;
    z-index: -1;
}

.article-title {
    text-shadow: 0 0 4px var(--c-bg-1), 0 0 8px var(--c-bg-1);
}
</style>
