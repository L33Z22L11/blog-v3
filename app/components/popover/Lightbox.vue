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

const lightbox = ref()
const lightboxEl = useCurrentElement<HTMLImageElement>(lightbox)

const { width: winW, height: winH } = useWindowSize()

interface Pointer {
	startX: number
	startY: number
	currentX: number
	currentY: number
}

// 每次触控开始时的状态
let startRect: DOMRect
let startCenter: typeof center.value
let startDistance: typeof distance.value
const pointers = ref<Record<number, Pointer>>({})
const activePointers = computed(() => Object.values(pointers.value).slice(0, 2))

const center = computed(() => getCenter('current'))
const distance = computed(() => getDistance('current'))

function restrictScale(width: number, height: number, scale: number) {
	if (scale < 1) {
		return width < Math.min(winW.value, originRect.width, props.el.naturalWidth)
			&& height < Math.min(winH.value, originRect.height, props.el.naturalHeight)
	}
	else if (scale > 1) {
		return width > Math.max(winW.value, originRect.width, props.el.naturalWidth)
			&& height > Math.max(winH.value, originRect.height, props.el.naturalHeight)
	}
}

function onWheel(e: WheelEvent) {
	const { left: startX, top: startY, width, height } = lightboxEl.value.getBoundingClientRect()
	if (restrictScale(width, height, 1 - e.deltaY))
		return
	const isTouchpad = Math.abs(e.deltaY) < 8
	const delta = isTouchpad ? Math.abs(e.deltaY) * 0.05 : 0.5
	const scale = e.deltaY > 0 ? 1 / (1 + delta) : 1 + delta

	animateBetweenRects(lightboxEl, {
		left: startX - (e.clientX - startX) * (scale - 1),
		top: startY - (e.clientY - startY) * (scale - 1),
		width: width * scale,
		height: height * scale,
	})
}

function initPointer() {
	for (const p of Object.values(pointers.value)) {
		p.startX = p.currentX
		p.startY = p.currentY
	}
	startRect = lightboxEl.value.getBoundingClientRect()
	startCenter = getCenter('start')
	startDistance = getDistance('start')
}

function getCenter(mode: 'start' | 'current') {
	const pointers = activePointers.value
	return {
		x: pointers.reduce((sum, p) => sum + p[`${mode}X`], 0) / pointers.length,
		y: pointers.reduce((sum, p) => sum + p[`${mode}Y`], 0) / pointers.length,
	}
}

function getDistance(mode: 'start' | 'current') {
	const [p1, p2] = activePointers.value
	if (!p1 || !p2)
		return 0
	return Math.hypot(
		p1[`${mode}X`] - p2[`${mode}X`],
		p1[`${mode}Y`] - p2[`${mode}Y`],
	)
}

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
	if (restrictScale(width, height, scale))
		return
	const startX = startRect.left + center.value.x - startCenter.x
	const startY = startRect.top + center.value.y - startCenter.y
	const left = startX - (center.value.x - startX) * (scale - 1)
	const top = startY - (center.value.y - startY) * (scale - 1)
	animateBetweenRects(lightboxEl, { left, top, width, height }, { duration: 0 })
})

useEventListener('pointerup', (e) => {
	delete pointers.value[e.pointerId]
	if (Object.keys(pointers.value).length)
		initPointer()
})

function onEnter(el: Element, done: () => void) {
	const fixedWidth = window.innerWidth * rate
	const fixedHeight = window.innerHeight * rate
	const ratio = props.el.naturalWidth / props.el.naturalHeight
	const [width, height] = (fixedWidth / fixedHeight > ratio)
		? [fixedHeight * ratio, fixedHeight]
		: [fixedWidth, fixedWidth / ratio]
	const left = (winW.value - width) / 2
	const top = (winH.value - height) / 2

	animateBetweenRects(el, [originRect, { left, top, width, height }]).onfinish = done
}

function onLeave(el: Element, done: () => void) {
	animateBetweenRects(el, props.el).onfinish = done
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
			ref="lightbox"
			class="image"
			:alt="el.alt"
			:width="el.width"
			:height="el.height"
			:src="el.src"
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
