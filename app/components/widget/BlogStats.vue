<script setup lang="ts">
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const timeEstablished = appConfig.timeEstablished
const timeUpdated = runtimeConfig.public.buildTime
const totalWords = ref('约8万')

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

onMounted(async () => {
    const { data: stats } = await useFetch('/api/stats')
    if (stats.value) {
        totalWords.value = formatNumber(stats.value.totalWords)
    }
})
</script>

<template>
    <h3 class="widget-title">
        博客统计
    </h3>

    <div class="widget-card">
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
        white-space: nowrap;
    }
}
</style>
