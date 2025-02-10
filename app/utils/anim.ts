import { toArray } from '@vueuse/core'

interface Rect {
    left: number | string
    top: number | string
    width: number | string
    height: number | string
}

export function animateBetweenRects(el: MaybeRefOrGetter<Element>, rect: Rect | Rect[], options?: KeyframeAnimationOptions) {
    const frames = toArray(rect)
    const ensurePx = (val: number | string) => typeof val === 'number' ? `${val}px` : val

    return toValue(el).animate(frames.map(r => ({
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
