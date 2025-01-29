<script setup lang="ts">
const props = defineProps<{
    el: HTMLImageElement
    caption?: string
    isOpening?: boolean
}>()

const emit = defineEmits<{
    close: []
}>()

const originRect = props.el.getBoundingClientRect()
const rate = 0.8

const style = ref({
    left: `${originRect.left}px`,
    top: `${originRect.top}px`,
    width: `${originRect.width}px`,
    height: `${originRect.height}px`,
})

const zoomImage = ref()
const elZoomImage = useCurrentElement<HTMLImageElement>(zoomImage)

const { width: winW, height: winH } = useWindowSize()

interface Pointer {
    startX: number
    startY: number
    currentX: number
    currentY: number
}

let startRect: DOMRect
let startCenter: typeof center.value
let startDistance: typeof distance.value
const pointers = ref<Record<number, Pointer>>({})
const usingPointers = computed(() => Object.values(pointers.value).slice(0, 2))

const center = computed(() => getCenter('current'))
const distance = computed(() => getDistance('current'))

function restrictScale(width: number, height: number, delta: number) {
    if (delta > 0) {
        return height < Math.min(winH.value, originRect.height) * 0.5
            && width < Math.min(winW.value, originRect.width) * 0.5
    }
    else {
        return width > Math.max(winW.value, originRect.width) * 2
            && height > Math.max(winH.value, originRect.height) * 2
    }
}

function onWheel(e: WheelEvent) {
    const { left, top, width, height } = elZoomImage.value.getBoundingClientRect()
    if (restrictScale(width, height, e.deltaY))
        return
    const isTouchpad = Math.abs(e.deltaY) < 8
    let scale = isTouchpad ? Math.abs(e.deltaY) * 0.05 : 0.5
    scale = e.deltaY > 0 ? 1 / (1 + scale) : 1 + scale
    const finalX = left - (e.clientX - left) * (scale - 1)
    const finalY = top - (e.clientY - top) * (scale - 1)
    elZoomImage.value.animate({
        left: `${finalX}px`,
        top: `${finalY}px`,
        width: `${width * scale}px`,
        height: `${height * scale}px`,
    }, {
        duration: 100,
        fill: 'forwards',
    })
}
function initPointer() {
    for (const p of Object.values(pointers.value)) {
        p.startX = p.currentX
        p.startY = p.currentY
    }

    startRect = elZoomImage.value.getBoundingClientRect()
    startCenter = getCenter('start')
    startDistance = getDistance('start')
}

function getCenter(mode: 'start' | 'current') {
    return {
        x: usingPointers.value.reduce((sum, p) => sum + p[`${mode}X`], 0) / usingPointers.value.length,
        y: usingPointers.value.reduce((sum, p) => sum + p[`${mode}Y`], 0) / usingPointers.value.length,
    }
}

function getDistance(mode: 'start' | 'current') {
    const [p1, p2] = usingPointers.value
    if (!p1 || !p2)
        return 0
    return Math.hypot(
        p1[`${mode}X`] - p2[`${mode}X`],
        p1[`${mode}Y`] - p2[`${mode}Y`],
    )
}

// FIXME: 触发区域应当是全屏
useEventListener('pointerdown', (e) => {
    pointers.value[e.pointerId] = {
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
    }
    initPointer()
})

useEventListener('pointermove', (e) => {
    const p = pointers.value[e.pointerId]

    if (!p)
        return

    p.currentX = e.clientX
    p.currentY = e.clientY

    const scale = distance.value / startDistance || 1
    const width = startRect.width * scale
    const height = startRect.height * scale
    if (restrictScale(width, height, 1 - scale))
        return

    const left = startRect.left + center.value.x - startCenter.x
    const top = startRect.top + center.value.y - startCenter.y
    const finalLeft = left - (center.value.x - left) * (scale - 1)
    const finalTop = top - (center.value.y - top) * (scale - 1)

    elZoomImage.value.animate({
        left: `${finalLeft}px`,
        top: `${finalTop}px`,
        width: `${width}px`,
        height: `${height}px`,
    }, {
        fill: 'forwards',
    })
})

useEventListener('pointerup', (e) => {
    delete pointers.value[e.pointerId]
    if (Object.keys(pointers.value).length)
        initPointer()
})

function onEnter() {
    const fixedWidth = window.innerWidth * rate
    const fixedHeight = window.innerHeight * rate
    const ratio = props.el.naturalWidth / props.el.naturalHeight
    const [finalWidth, finalHeight] = (fixedWidth / fixedHeight > ratio)
        ? [fixedHeight * ratio, fixedHeight]
        : [fixedWidth, fixedWidth / ratio]

    elZoomImage.value.animate([{
        left: `${originRect.left}px`,
        top: `${originRect.top}px`,
        width: `${originRect.width}px`,
        height: `${originRect.height}px`,
    }, {
        top: `calc(50% - ${Math.floor(finalHeight / 2)}px)`,
        left: `calc(50% - ${Math.floor(finalWidth / 2)}px)`,
        width: `${finalWidth}px`,
        height: `${finalHeight}px`,
    }], {
        duration: 200,
        fill: 'forwards',
    })
}

function onLeave(_el: Element, done: () => void) {
    // 重新获取元素位置
    const { x, y, width, height } = props.el.getBoundingClientRect()
    const animation = elZoomImage.value.animate({
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
    }, {
        duration: 200,
        fill: 'forwards',
    })
    animation.onfinish = done
}

useEventListener('keydown', (e) => {
    if (e.key === 'Escape')
        emit('close')
})
</script>

<template>
    <div class="z-lightbox">
        <Transition>
            <div
                v-if="isOpening"
                id="z-lightbox-bgmask"
                @click="emit('close')"
            />
        </Transition>
        <Transition @enter="onEnter" @leave="onLeave">
            <NuxtImg
                v-if="isOpening"
                ref="zoomImage"
                class="image"
                :alt="el.alt"
                :width="el.width"
                :height="el.height"
                :src="el.src"
                :style
                draggable="false"

                @wheel.prevent="onWheel"
            />
        </Transition>
        <Transition>
            <div v-if="isOpening" class="tooltip">
                <span v-if="caption" class="caption">{{ caption }}</span>
                <button
                    class="close"
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
    touch-action: none;
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
    object-fit: cover;

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
    min-height: 2em;
    max-width: min(40rem, 80%);
    margin-inline: auto;
    border: 1px solid #0003;
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
