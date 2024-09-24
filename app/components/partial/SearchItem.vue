<script setup lang="ts">
import type { SearchResult } from 'minisearch'

interface Props extends SearchResult {
    title: string
    content: string
    titles: string[]
}

const props = defineProps<Partial<Props>>()

const title = computed(() => [...props.titles ?? [], props.title].join(' > '))

const word = computed(() => props.queryTerms?.[0] ?? '')

// const breadcrumbs = computed(() => props.titles?.split('\n').push(props.title).join(' > '))

const highlightTitle = computed(() => highlightHTML(title.value, word.value))
const highlightContent = computed(() => highlightHTML(props.content ?? '', word.value))
</script>

<template>
    <ZRawLink :to="id" class="search-item">
        <menu>
            <h2 v-html="highlightTitle" />
            <p class="content" v-html="highlightContent" />
        </menu>
    </ZRawLink>
</template>

<style scoped lang="scss">
.search-item {
    display: block;
    padding: 0.5em 0.8em;
    border-radius: 0.5em;
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--c-bg-soft);
    }

    & + & {
        margin-top: 0.5em;
    }

    h2 {
        font-size: 1em;

        & + .content {
            margin-top: 0.2em;
        }
    }

    .content {
        font-size: 0.8em;
        color: var(--c-text-2);
    }
}

:deep(.highlight) {
    color: var(--c-primary);
}
</style>
