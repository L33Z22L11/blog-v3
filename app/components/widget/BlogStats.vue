<script setup lang="ts">
import { toZonedTime } from 'date-fns-tz'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
// 将服务器时区转换为博客指定时区
const buildTime = toZonedTime(runtimeConfig.public.buildTime, appConfig.timezone)

const totalWords = ref(appConfig.stats.wordCount)
const yearlyTip = ref('')

const blogStats = computed(() => [{
    label: '运营时长',
    content: timeElapse(appConfig.timeEstablished),
    tip: `博客于${appConfig.timeEstablished}上线`,
}, {
    label: '上次更新',
    content: timeElapse(buildTime),
    tip: `构建于${getLocaleDatetime(buildTime)}`,
}, {
    label: '总字数',
    content: totalWords,
    tip: yearlyTip.value,
}])

onMounted(async () => {
    const stats = await $fetch('/api/stats')
    totalWords.value = formatNumber(stats.total.words)
    yearlyTip.value = Object.entries(stats.annual).reverse().map(([year, item]) =>
        `${year}年：${item.posts}篇，${formatNumber(item.words)}字`,
    ).join('\n')
})
</script>

<template>
    <h3 class="widget-title">
        博客统计
    </h3>

    <ul class="widget-card">
        <li v-for="(item, index) in blogStats" :key="index" :title="item.tip">
            <small>{{ item.label }}</small><br>
            <span data-allow-mismatch>{{ item.content }}</span>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
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
