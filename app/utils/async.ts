import { debounce, throttle } from 'radash'

export { sleep as delay } from 'radash'

export const autoThrottle = (fn: () => void) => throttle({ interval: 20 }, fn)
export const autoDebounce = (fn: () => void) => debounce({ delay: 20 }, fn)

export function autoThrottleAndDebounce(fn: () => void) {
	const throttledFn = autoThrottle(fn)
	const debouncedFn = autoDebounce(fn)
	return () => {
		throttledFn()
		debouncedFn()
	}
}
