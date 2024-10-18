<script setup lang="ts">
import type { BaseTransitionProps } from 'vue'

const props = defineProps<{
    el: HTMLImageElement
    caption?: string
    show?: boolean
}>()

const emit = defineEmits<{
    close: []
}>()

const originRect = props.el.getBoundingClientRect()
const rate = 0.8
const image = ref(null!)
const elImage = useCurrentElement<HTMLImageElement>(image)

const { style } = useDraggable(elImage, {
    initialValue: { x: originRect.x, y: originRect.y },
})

function onWheel(e: WheelEvent) {
    const { left, top, width, height } = elImage.value.getBoundingClientRect()

    // 限制缩放
    const tooLarge = width > Math.max(window.innerWidth, originRect.width) * 2
        && height > Math.max(window.innerHeight, originRect.height) * 2
    const tooSmall = width < Math.min(window.innerWidth, originRect.width) * 0.5
        && height < Math.min(window.innerHeight, originRect.height) * 0.5
    if ((e.deltaY < 0 && tooLarge) || (e.deltaY > 0 && tooSmall))
        return

    let rate = 1 + Math.abs(e.deltaY % 100 ? e.deltaY * 100 : e.deltaY) / 200
    if (e.deltaY > 0)
        rate = 1 / rate

    const finalX = left - (e.clientX - left) * (rate - 1)
    const finalY = top - (e.clientY - top) * (rate - 1)

    elImage.value.style.left = `${finalX}px`
    elImage.value.style.top = `${finalY}px`
    elImage.value.style.width = `${width * rate}px`
    elImage.value.style.height = `${height * rate}px`
}

async function onEnter() {
    const fixedWidth = window.innerWidth * rate
    const fixedHeight = window.innerHeight * rate
    const ratio = originRect.width / originRect.height
    const [finalWidth, finalHeight] = (fixedWidth / fixedHeight > ratio)
        ? [fixedHeight * ratio, fixedHeight]
        : [fixedWidth, fixedWidth / ratio]

    await delay(0)
    elImage.value.style.top = `calc(50% - ${Math.floor(finalHeight / 2)}px)`
    elImage.value.style.left = `calc(50% - ${Math.floor(finalWidth / 2)}px)`
    elImage.value.style.width = `${finalWidth}px`
    elImage.value.style.height = `${finalHeight}px`
}

function onLeave() {
    elImage.value.style.left = `${originRect.x}px`
    elImage.value.style.top = `${originRect.y}px`
    elImage.value.style.width = `${originRect.width}px`
    elImage.value.style.height = `${originRect.height}px`
}

useEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        emit('close')
    }
})
</script>

<template>
    <div class="z-lightbox">
        <Transition>
            <div
                v-if="show"
                id="z-lightbox-bgmask"
                @click="emit('close')"
            />
        </Transition>
        <Transition @enter="onEnter" @leave="onLeave">
            <NuxtImg
                v-if="show"
                ref="image"
                class="image"
                :width="el.width"
                :height="el.height"
                :src="el.src"
                :style
                draggable="false"
                @wheel.prevent="onWheel"
            />
        </Transition>
        <Transition>
            <div v-if="show" class="tooltip">
                <span class="caption">{{ caption }}</span>
                <button
                    class="close"
                    type="button"
                    aria-label="关闭灯箱"
                    @click="emit('close')"
                >
                    <Icon name="ph:x-bold" />
                </button>
            </div>
        </Transition>
    </div>
</template>

<style lang="scss" scoped>
.z-lightbox {
    position: fixed;
}

#z-lightbox-bgmask {
    position: fixed;
    inset: 0;
    background-color: #0007;
    transition: backdrop-filter 1s;
    transition: opacity 0.2s;
    z-index: 0;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }
}

.image {
    position: fixed;
    transition: all 0.2s;
    cursor: move;

    &.v-enter-from,
    &.v-leave-to {
        border-radius: 1em;
    }

    &:active {
        transition: none;
    }
}

.tooltip {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: clamp(2rem, 10vh, 5rem);
    width: fit-content;
    max-width: min(40rem, 80%);
    margin-inline: auto;
    border-radius: 0.5em;
    box-shadow: 0 0.5em 1em var(--ld-shadow);
    background-color: var(--c-text-1);
    color: var(--c-bg-2);
    transition: all 0.2s;
    inset-inline: 0;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
        bottom: 0;
    }

    .caption {
        margin-right: -0.5em;
        padding: 0.5em 1em;
    }

    .close {
        align-self: stretch;
        padding-inline: 0.5em;
        cursor: pointer;
    }
}
</style>
