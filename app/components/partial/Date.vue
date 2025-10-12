<script setup lang="ts">
import { differenceInWeeks, formatISO, isSameYear } from 'date-fns'

const props = defineProps<{
	icon?: string
	date: string
	absolute?: boolean
	nospace?: boolean
}>()

const relative = computed(() => props.absolute
	? false
	: Math.abs(differenceInWeeks(Date.now(), props.date)) < 1,
)

const tooltip = computed(() => getLocaleDatetime(props.date))
</script>

<template>
<span :title="tooltip">
	<Icon v-if="icon" :name="icon" />
	<template v-if="!nospace">&nbsp;</template>

	<NuxtTime
		:datetime="formatISO(props.date)"
		:relative
		:year="isSameYear(Date.now(), props.date) ? undefined : '2-digit'"
		month="long"
		day="numeric"
	/>
</span>
</template>
