<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

function sortByUpdated(list: ParsedContent[]): ParsedContent[] {
    return list.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
</script>

<template>
    <div class="wrapper">
        <ContentList v-slot="{ list }" path="/">
            <ZArchive v-for="article in sortByUpdated(list)" :key="article._path" v-bind="article" :to="article._path" />
        </ContentList>
    </div>
</template>
