<script setup lang="ts">
import { format } from 'date-fns'
import type ArticleProps from '~/types/article'

const props = defineProps<{
    to?: string
    useUpdated?: boolean
} & ArticleProps>()

const mainDate = computed(() => (props.useUpdated ? props.updated : props.date))
const dateLabel = computed(() => mainDate.value
    ? format(new Date(mainDate.value), 'MM-dd')
    : '')
const auxDateLabel = computed(() => props.date
    ? format(new Date(props.date), isSameYear(props.updated, props.date) ? 'MM-dd' : 'yyyy-MM-dd')
    : '')
</script>

<template>
    <li class="article-line">
        <time :datetime="mainDate">{{ dateLabel }}</time>
        <ZRawLink class="article-link gradient-card" :to :title="description">
            <span class="article-title" :class="{ 'text-story': type === 'story' }">
                {{ title }}
            </span>
            <time v-if="useUpdated && isTimeDiffSignificant(date, updated)" class="aux-date" :datetime="date">
                &nbsp;{{ auxDateLabel }}</time>
            <NuxtImg v-if="image" class="article-cover" :src="image" :alt="title" loading="lazy" />
        </ZRawLink>
    </li>
</template>

<style lang="scss" scoped>
.article-line {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.5em;
    margin: 0.2em 0;

    @media (max-width: $breakpoint-mobile) {
        font-size: 0.9em;
    }

    time {
        display: inline-block;
        opacity: 0.4;
        font-family: var(--font-monospace);

        // 缓解移动端 Edge 字体尺寸不准导致的换行溢出
        white-space: nowrap;
        transition: opacity 0.2s;

        &.aux-date {
            font-size: 0.8em;
            vertical-align: middle;
        }
    }

    &:hover > time {
        opacity: 1;
    }
}

.article-title {
    color: var(--c-text);
}

.article-link {
    overflow: hidden;
    padding: 0.3em 0.6em;

    &:hover {
        .article-cover {
            opacity: 1;
            width: 50%;
            object-position: center 43.5%;
        }
    }
}

.article-cover {
    position: absolute;
    opacity: 0.8;
    top: 0;
    right: 0;
    width: min(50%, 180px);
    height: 100%;
    margin: 0;
    mask: linear-gradient(to right, transparent, #fff7);
    transition: all 0.2s;
    object-fit: cover;
    z-index: -1;
}
</style>
