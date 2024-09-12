<script setup lang="ts">
const timeEstablished = useAppConfig().timeEstablished as string
const timeUpdated = useRuntimeConfig().public.buildTime as string
const totalWords = await $fetch('/api/total-words')

const blogStats = [{
    title: '运营时长',
    content: timeElapse(timeEstablished),
}, {
    title: '上次更新',
    content: timeElapse(timeUpdated),
}, {
    title: '总字数',
    content: totalWords,
}]
</script>

<template>
    <h3 class="widget-title">
        博客统计
    </h3>
    <div class="widget-body">
        <ul>
            <li v-for="(item, index) in blogStats" :key="index" data-allow-mismatch>
                <small>{{ item.title }}</small><br>
                {{ item.content }}
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    text-align: center;

    >li {
        flex: 1;
    }
}
</style>
