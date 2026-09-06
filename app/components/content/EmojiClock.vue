<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'

const props = defineProps<{
	datetime?: string
	rotate?: boolean
}>()

const emojiStatic = ['🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦']
const emojiRotate = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']

const now = ref(Temporal.Now.zonedDateTimeISO())

const datetime = computed(() => props.datetime
	? toZonedTemporal(props.datetime)
	: now.value)

const status = computed(() => {
	const { hour, minute } = datetime.value

	if (!props.rotate) {
		const emojiIndex = (hour * 2 + Math.round(minute / 30)) % emojiStatic.length
		return { emoji: emojiStatic[emojiIndex] }
	}

	const minuteAt = Math.round(minute / 5)
	const emojiIndex = (hour % 12 - minuteAt + emojiRotate.length) % emojiRotate.length
	return { rotate: minuteAt * 30, emoji: emojiRotate[emojiIndex] }
})

// 定时器只能在客户端运行，否则 nuxt generate 不能自动退出
const { resume } = useIntervalFn(() => {
	now.value = Temporal.Now.zonedDateTimeISO()
}, 30000, { immediate: false })

whenever(() => !props.datetime, resume)
</script>

<template>
<span
	class="emoji-clock"
	:class="{ rotate }"
	:style="{ '--deg': rotate ? `${status.rotate}deg` : undefined }"
	v-text="status.emoji"
/>
</template>

<style scoped>
.emoji-clock.rotate {
	display: inline-block;
	transform: rotate(var(--deg, 0deg));
}
</style>
