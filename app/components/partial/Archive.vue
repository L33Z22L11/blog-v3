<script setup lang="ts">
import { format } from 'date-fns'
import type ArticleProps from '~/types/article'

const props = defineProps<ArticleProps>()

const datetime = computed(() => format(new Date(props.date), 'MM-dd'))
</script>

<template>
    <li class="article-line">
        <time :datetime="date">{{ datetime }}</time>
        <ZRawLink class="article-link" :to="link">
            <span class="article-title">
                {{ title }}
            </span>
            <NuxtImg v-if="cover" class="article-cover" :src="cover" :alt="title" />
        </ZRawLink>
    </li>
</template>

<style lang="scss" scoped>
.article-line {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 1rem;
    text-shadow: 0 0 4px var(--c-bg-1), 0 0 8px var(--c-bg-1);

    & + & {
        margin-top: 4px;
    }

    time {
        color: var(--c-text-3);
        transition: color 0.2s;
    }

    &:hover > time {
        color: var(--c-text-1);
    }
}

.article-link {
    display: block;
    position: relative;
    overflow: hidden;
    padding: 0.3rem 0.6rem;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover {
        background: var(--c-primary-soft);

        .article-cover {
            width: 50%;
        }
    }
}

.article-cover {
    position: absolute;
    top: 0;
    right: 0;
    width: min(50%, 180px);
    height: 100%;
    margin: 0;
    mask: linear-gradient(to right, transparent, var(--c-bg-a50));
    transition: 0.2s;
    object-fit: cover;
    z-index: -1;
}
</style>
