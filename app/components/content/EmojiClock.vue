<script setup lang="ts">
const props = defineProps<{
	datetime?: string
	rotate?: boolean
}>()

const emojiStatic = ['🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦']
const emojiRotate = ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚']

const now = ref(new Date())

const datetime = computed(() => props.datetime
	? toZonedDate(props.datetime)
	: now.value)

const status = computed(() => {
	const hour = datetime.value.getHours()
	const minute = datetime.value.getMinutes()

	if (!props.rotate) {
		const emojiIndex = (hour * 2 + Math.round(minute / 30)) % emojiStatic.length
		return { emoji: emojiStatic[emojiIndex] }
	}

	const minuteAt = Math.round(minute / 5)
	const emojiIndex = (hour % 12 - minuteAt + emojiRotate.length) % emojiRotate.length
	return { rotate: minuteAt * 30, emoji: emojiRotate[emojiIndex] }
})

const { pause, resume } = useIntervalFn(() => {
	now.value = new Date()
}, 30000)

watchImmediate(
	() => props.datetime,
	// 定时器只能在客户端运行，否则 nuxt generate 不能自动退出
	val => val ? pause() : import.meta.client && resume(),
)
</script>

<template>
<span
	class="emoji-clock"
	:class="{ rotate }"
	:style="{ '--deg': rotate ? `${status.rotate}deg` : undefined }"
	v-text="status.emoji"
/>
</template>

<style lang="scss" scoped>
.emoji-clock.rotate {
	display: inline-block;
	transform: rotate(var(--deg, 0deg));
}
</style>
