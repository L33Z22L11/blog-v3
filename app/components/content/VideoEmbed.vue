<script setup lang="ts">
const props = withDefaults(defineProps<{
    type: string
    id: string
    autoplay?: boolean
    ratio?: string | number
    width?: string
}>(), {
    ratio: '16/9',
})

const videoClass = computed(() => 'video')

const videoStyle = computed(() => ({
    'aspect-ratio': props.ratio,
    'max-width': props.width,
}))

const src = computed(() => {
    switch (props.type) {
        case 'bilibili':
            return `https://player.bilibili.com/player.html?bvid=${props.id}&autoplay=${props.autoplay.toString() ?? false}`
        case 'youtube':
            return `https://www.youtube.com/embed/${props.id}?rel=0&disablekb=1&playsinline=1&autoplay=${props.autoplay.toString() ?? false}"`
        default:
            return props.id
    }
})
</script>

<template>
    <div :class="videoClass" :style="videoStyle">
        <!-- BUG: B 站视频区域无法使用滚轮或滑动 -->
        <iframe
            v-if="type"
            :src
            scrolling="no"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        />
        <video v-else :src controls />
    </div>
</template>

<style lang="scss" scoped>
.video {
    overflow: hidden;
    margin: 2rem auto;
    border-radius: 0.8rem;
    box-shadow: 0 2px 0.5rem var(--ld-shadow);
}

iframe {
    width: 100%;
    height: 100%;
}
</style>
