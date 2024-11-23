<script setup lang="ts">
const emojiClock = ['🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦']

const now = ref(new Date())

useIntervalFn(() => {
    now.value = new Date()
}, 60000)

const clockEmoji = computed(() => {
    const clockIndex = now.value.getHours() * 2 + Math.round(now.value.getMinutes() / 30)
    return emojiClock[clockIndex % emojiClock.length]
})
</script>

<template>
    <span class="emoji-clock">{{ clockEmoji }}</span>
</template>
