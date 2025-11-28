<script setup lang="ts">
import { differenceInWeeks, isSameYear } from 'date-fns'
import { toDate } from 'date-fns-tz'

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

const appConfig = useAppConfig()
const datetime = computed(() => toDate(props.date, { timeZone: appConfig.timezone }))

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

	<NuxtTime
		:datetime
		:relative
		:year="isSameYear(Date.now(), datetime) ? undefined : '2-digit'"
		month="long"
		day="numeric"
		numeric="auto"
	/>
</span>
</template>
