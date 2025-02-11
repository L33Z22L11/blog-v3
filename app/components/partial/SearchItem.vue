<script setup lang="ts">
import type { SearchResult } from 'minisearch'

interface SIProps extends SearchResult {
    title: string
    content: string
    titles: string[]
}

const props = defineProps<Partial<SIProps>>()

const title = computed(() => [...props.titles ?? [], props.title].join(' > '))
const isPara = computed(() => props.titles?.length)
const word = computed(() => props.queryTerms?.[0] ?? '')

const highlightTitle = computed(() => highlightHtml(title.value, word.value))
const highlightContent = computed(() => highlightHtml(props.content ?? '', word.value))
</script>

<template>
    <ZRawLink :to="id" class="search-item">
        <h2>
            <Badge v-if="!isPara" round>
                文章
            </Badge>
            <span v-html="highlightTitle" />
        </h2>
        <p class="content" v-html="highlightContent" />
    </ZRawLink>
</template>

<style lang="scss" scoped>
.search-item {
    display: block;
    margin: 0.5em;
    padding: 0.5em 0.8em;
    border-radius: 0.5em;
    transition: background-color 0.2s;

    &.active {
        background-color: var(--c-bg-soft);
    }

    h2 {
        font-size: 1em;

        .badge {
            margin-right: 0.5em;
            font-size: 0.8em;
            color: var(--c-primary);
        }

        & + .content {
            margin-top: 0.2em;
        }
    }

    .content {
        font-size: 0.8em;
        white-space: pre-wrap;
        color: var(--c-text-2);
    }
}

:deep(.highlight) {
    color: var(--c-primary);
}
</style>
