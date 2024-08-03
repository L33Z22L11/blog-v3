<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

function sortByUpdated(list: ParsedContent[]): ParsedContent[] {
    return list.slice().sort((a, b) => new Date(b.updated || b.date).getTime() - new Date(a.updated || b.date).getTime())
}
</script>

<template>
    <main>
        <ContentList v-slot="{ list }" path="/">
            <ZArticle v-for="article in sortByUpdated(list)" :key="article._path" v-bind="article" :to="article._path" />
        </ContentList>
    </main>
</template>
