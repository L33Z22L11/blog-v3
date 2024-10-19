<script setup lang="ts">
const props = defineProps<{
    el: HTMLImageElement
    caption?: string
    show?: boolean
    delay?: number
}>()

const emit = defineEmits<{
    close: []
}>()

const originRect = props.el.getBoundingClientRect()
const rate = 0.8
const zoomImage = ref(null!)
const elZoomImage = useCurrentElement<HTMLImageElement>(zoomImage)

const { style } = useDraggable(elZoomImage, {
    initialValue: { x: originRect.x, y: originRect.y },
})

function onWheel(e: WheelEvent) {
    const { left, top, width, height } = elZoomImage.value.getBoundingClientRect()
    const isTooLarge = width > Math.max(window.innerWidth, originRect.width) * 2
        && height > Math.max(window.innerHeight, originRect.height) * 2
    const isTooSmall = width < Math.min(window.innerWidth, originRect.width) * 0.5
        && height < Math.min(window.innerHeight, originRect.height) * 0.5
    if ((e.deltaY < 0 && isTooLarge) || (e.deltaY > 0 && isTooSmall))
        return
    const isTouchpad = Math.abs(e.deltaY) < 8
    let delta = isTouchpad ? Math.abs(e.deltaY) : 0.5
    delta = e.deltaY > 0 ? 1 / (1 + delta) : 1 + delta
    const finalX = left - (e.clientX - left) * (delta - 1)
    const finalY = top - (e.clientY - top) * (delta - 1)
    Object.assign(elZoomImage.value.style, {
        left: `${finalX}px`,
        top: `${finalY}px`,
        width: `${width * delta}px`,
        height: `${height * delta}px`,
    })
}

async function onEnter() {
    const fixedWidth = window.innerWidth * rate
    const fixedHeight = window.innerHeight * rate
    const ratio = originRect.width / originRect.height
    const [finalWidth, finalHeight] = (fixedWidth / fixedHeight > ratio)
        ? [fixedHeight * ratio, fixedHeight]
        : [fixedWidth, fixedWidth / ratio]
    await delay(0)
    Object.assign(elZoomImage.value.style, {
        top: `calc(50% - ${Math.floor(finalHeight / 2)}px)`,
        left: `calc(50% - ${Math.floor(finalWidth / 2)}px)`,
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
    })
}

function onLeave() {
    // 重新获取元素位置
    const { x, y, width, height } = props.el.getBoundingClientRect()
    Object.assign(elZoomImage.value.style, {
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
    })
}

useEventListener('keydown', (e) => {
    if (e.key === 'Escape')
        emit('close')
})
</script>

<template>
    <div class="z-lightbox" :style="{ '--delay': `${delay}ms` }">
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
                ref="zoomImage"
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
    transition: all var(--delay, 0.2s);
    z-index: 0;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }
}

.image {
    position: fixed;
    cursor: move;
    touch-action: none;

    &.v-enter-active,
    &.v-leave-active {
        border-radius: 0.5rem;
        transition: all var(--delay, 0.2s);
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
    box-shadow: 0 0.2em 0.5em var(--ld-shadow), 0 0.5em 1em var(--ld-shadow);
    background-color: #0007;
    backdrop-filter: blur(1rem) saturate(2);
    color: white;
    transition: all var(--delay, 0.2s);
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
