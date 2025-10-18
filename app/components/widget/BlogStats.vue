<script setup lang="ts">
import { NuxtTime } from '#components'

const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const buildTime = ref(runtimeConfig.public.buildTime)
const totalWords = ref(appConfig.component.stats.wordCount)
const yearlyTip = ref('')

const { data: stats } = useAsyncData('blogStats', () => {
  return $fetch('/api/stats').catch(() => null)
}, {
  default: () => null
})

const blogStats = [{
	label: '运营时长',
	value: timeElapse(appConfig.timeEstablished),
	tip: `博客于${appConfig.timeEstablished}上线`,
}, { 
	label: '上次更新',
	value: () => h(NuxtTime, { datetime: runtimeConfig.public.buildTime, relative: true }),
	tip: computed(() => `构建于${buildTime.value}`),
}, { 
	label: '总字数',
	value: computed(() => {
		return stats.value ? formatNumber(stats.value.total.words) : totalWords.value
	}),
	tip: computed(() => {
		if (!stats.value) return ''
		return Object.entries(stats.value.annual).reverse().map(([year, item]) =>
			`${year}年：${item.posts}篇，${formatNumber(item.words)}字`,
		).join('\n')
	}),
}]

onMounted(() => {
	buildTime.value = getLocaleDatetime(buildTime.value)
})
</script>

<template>
<ZWidget card title="博客统计">
	<ZDlGroup :items="blogStats" size="small" />
</ZWidget>
</template>
