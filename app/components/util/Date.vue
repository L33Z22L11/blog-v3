<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'

const props = withDefaults(defineProps<{
	icon?: string
	date?: string | Temporal.ZonedDateTime
	format?: dateTimeFormatOptions
	absolute?: boolean
	relative?: boolean
	nospace?: boolean
	tipPrefix?: string
}>(), {
	tipPrefix: '',
})

const today = Temporal.Now.plainDateISO()
const zdt = computed(() => {
	try {
		return typeof props.date === 'string' ? toZonedTemporal(props.date) : props.date
	}
	catch {
		return null
	}
})

const relative = computed(() => props.absolute || !zdt.value
	? false
	: props.relative || today.since(zdt.value, { largestUnit: 'week' }).weeks < 1,
)

const mounted = ref(false)
const tooltip = computed(() => mounted.value && zdt.value
	? `${props.tipPrefix}${toZdtLocaleString(zdt.value)}`
	: undefined,
)

onMounted(() => mounted.value = true)
</script>

<template>
<span :title="tooltip">
	<Icon v-if="icon" :name="icon" />
	<template v-if="icon && !nospace">&nbsp;</template>

	<span v-if="!zdt">Invalid Date</span>

	<time
		v-else-if="format"
		:datetime="toInstantString(zdt)"
		v-text="toZdtLocaleString(zdt, format)"
	/>

	<!-- Invalid Date 传入 NuxtTime 组件或 .toISOString() 会报错 -->
	<NuxtTime
		v-else
		:datetime="toInstantString(zdt)"
		:relative
		:year="zdt.year === today.year ? undefined : '2-digit'"
		month="long"
		day="numeric"
		numeric="auto"
	/>

</span>
</template>
