<script setup lang="ts">
import { differenceInWeeks, isSameYear } from 'date-fns'

const props = withDefaults(defineProps<{
	icon?: string
	date: string
	absolute?: boolean
	relative?: boolean
	nospace?: boolean
	tipPrefix?: string
}>(), {
	tipPrefix: '',
})

const datetime = computed(() => toZonedDate(props.date))

const relative = computed(() => props.absolute
	? false
	: props.relative || Math.abs(differenceInWeeks(Date.now(), datetime.value)) < 1,
)

const mounted = ref(false)
const tooltip = computed(() => mounted.value ? `${props.tipPrefix}${getLocaleDatetime(datetime.value)}` : undefined)

onMounted(() => mounted.value = true)
</script>

<template>
<span :title="tooltip">
	<Icon v-if="icon" :name="icon" />
	<template v-if="icon && !nospace">&nbsp;</template>

	<span v-if="Number.isNaN(datetime.getTime())" v-text="datetime" />
	<!-- Invalid Date 传入 NuxtTime 组件或 .toISOString() 会报错 -->
	<NuxtTime
		v-else
		:datetime
		:relative
		:year="isSameYear(Date.now(), datetime) ? undefined : '2-digit'"
		month="long"
		day="numeric"
		numeric="auto"
	/>
</span>
</template>
