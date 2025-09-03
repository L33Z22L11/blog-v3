<script setup lang="ts">
import { toZonedTime } from 'date-fns-tz'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()
// 将服务器时区转换为博客指定时区
const buildTime = toZonedTime(runtimeConfig.public.buildTime, appConfig.timezone)

const lastUpdateTime = ref('(获取中)')
const totalWords = ref(appConfig.component.stats.wordCount)
const yearlyTip = ref('')

const blogStats = computed(() => [{
	label: '运营时长',
	value: timeElapse(appConfig.timeEstablished),
	tip: `博客于${appConfig.timeEstablished}上线`,
}, {
	label: '上次更新',
	value: lastUpdateTime,
	tip: `构建于${getLocaleDatetime(buildTime)}`,
}, {
	label: '总字数',
	value: totalWords,
	tip: yearlyTip,
}])

onMounted(async () => {
	lastUpdateTime.value = timeElapse(buildTime)

	const stats = await $fetch('/api/stats').catch(() => { })
	if (!stats)
		return
	totalWords.value = formatNumber(stats.total.words)
	yearlyTip.value = Object.entries(stats.annual).reverse().map(([year, item]) =>
		`${year}年：${item.posts}篇，${formatNumber(item.words)}字`,
	).join('\n')
})
</script>

<template>
<ZWidget card title="博客统计">
	<ZDlGroup :items="blogStats" size="small" />
</ZWidget>
</template>
