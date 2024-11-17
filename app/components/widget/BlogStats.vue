<script setup lang="ts">
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const totalWords = ref(appConfig.stats.wordCount)
const yearlyTip = ref('')

const blogStats = computed(() => [{
    label: '运营时长',
    content: timeElapse(appConfig.timeEstablished),
    tip: `博客于${appConfig.timeEstablished}上线`,
}, {
    label: '上次更新',
    content: timeElapse(runtimeConfig.public.buildTime),
    tip: `构建于${getLocaleDatetime(runtimeConfig.public.buildTime)}`,
}, {
    label: '总字数',
    content: totalWords,
    tip: yearlyTip.value,
}])

onMounted(async () => {
    const { data: stats } = await useFetch('/api/stats')
    if (!stats.value)
        return
    totalWords.value = formatNumber(stats.value.total.words)
    yearlyTip.value = Object.entries(stats.value.annual).reverse().map(([year, item]) =>
        `${year}年：${item.posts}篇，${formatNumber(item.words)}字`,
    ).join('\n')
})
</script>

<template>
    <h3 class="widget-title">
        博客统计
    </h3>

    <ul class="widget-card" data-allow-mismatch>
        <li v-for="(item, index) in blogStats" :key="index" :title="item.tip">
            <small>{{ item.label }}</small><br>
            {{ item.content }}
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
