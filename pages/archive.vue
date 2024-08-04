<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

function sortByDate(list: ParsedContent[]) {
    return list.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
</script>

<template>
    <div class="archive-list">
        <ContentList v-slot="{ list }" path="/">
            <ZArchive v-for="article in sortByDate(list)" :key="article._path" v-bind="article" :to="article._path" />
        </ContentList>
    </div>
</template>

<style lang="scss" scoped>
.archive-list {
    margin: 1rem;
}
</style>
