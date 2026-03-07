import { minifySync } from 'oxc-minify'

export function toIifeString<T extends unknown[]>(fn: (...args: T) => void, ...args: T) {
	const fnString = fn.toString()
	const argsString = JSON.stringify(args).slice(1, -1)
	const minified = minifySync('', `(${fnString})(${argsString})`)
	return minified.code
}
