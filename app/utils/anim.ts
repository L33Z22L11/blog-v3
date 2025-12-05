import { toArray } from '@vueuse/core'

interface Rect {
	left: number | string
	top: number | string
	width: number | string
	height: number | string
}

type MaybeArray<T> = T | T[]

function toRect(rect: Element | Rect): Rect {
	return rect instanceof Element ? rect.getBoundingClientRect() : rect
}

const ensurePx = (val: number | string) => typeof val === 'number' ? `${val}px` : val

export function animateBetweenRects(
	el: MaybeRefOrGetter<Element>,
	rect: MaybeArray<MaybeRefOrGetter<Element> | Rect>,
	options?: KeyframeAnimationOptions,
) {
	const rects = toArray(rect).map(r => toRect(toValue(r)))

	return toValue(el).animate(rects.map(r => ({
		left: ensurePx(r.left),
		top: ensurePx(r.top),
		width: ensurePx(r.width),
		height: ensurePx(r.height),
	})), {
		duration: 100,
		fill: 'forwards',
		...options,
	})
}

export const getFixedDelay = (s: number, fixed = 2) => ({ '--delay': `${s.toFixed(fixed)}s` })
