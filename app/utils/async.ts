import { throttle } from 'radash'

export const autoThrottle = (fn: () => void) => throttle({ interval: 50 }, fn)

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
