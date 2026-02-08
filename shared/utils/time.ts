import { Temporal } from 'temporal-polyfill'
import blogConfig from '~~/blog.config'

export const dateTimeFormat = {
	date: {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	},
	monthDay: {
		month: '2-digit',
		day: '2-digit',
	},
	full: {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		weekday: 'long',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'long',
	},
} satisfies Record<string, Intl.DateTimeFormatOptions>

export type dateTimeFormatOptions = keyof typeof dateTimeFormat | Intl.DateTimeFormatOptions

export function toInstantString(date: string | Temporal.ZonedDateTime) {
	return (typeof date === 'string' ? toZonedTemporal(date) : date).toInstant().toString()
}

export function toZonedTemporal(date: string) {
	try {
		return Temporal.ZonedDateTime.from(date)
	}
	catch {
		try {
			return Temporal.Instant.from(date).toZonedDateTimeISO(blogConfig.timeZone)
		}
		catch {
			return Temporal.PlainDateTime.from(date).toZonedDateTime(blogConfig.timeZone)
		}
	}
}

export function toZdtLocaleString(date: string | Temporal.ZonedDateTime, format: dateTimeFormatOptions = 'full') {
	return (typeof date === 'string' ? toZonedTemporal(date) : date)
		.toLocaleString(undefined, typeof format === 'string' ? dateTimeFormat[format] : format)
}

/** 检查两个时间相对现在是否相差显著 */
export function isTimeDiffSignificant(
	date1?: string,
	date2?: string,
	/** 对于时间差的敏感程度，0~1 之间，1:不同则认为显著，>1:始终认为显著 */
	threshold = 0.6,
) {
	if (!date1 || !date2 || threshold <= 0)
		return false
	if (threshold > 1)
		return true
	const now = Temporal.Now.instant().epochMilliseconds
	const diff1 = now - toZonedTemporal(date1).epochMilliseconds
	const diff2 = now - toZonedTemporal(date2).epochMilliseconds
	return diff1 / diff2 < threshold || diff2 / diff1 < threshold
}

const timeIntervals = [
	{ label: '世纪', threshold: 60 * 60 * 24 * 365.2422 * 100 },
	{ label: '年', threshold: 60 * 60 * 24 * 365.2422 },
	{ label: '个月', threshold: 60 * 60 * 24 * 30.44 },
	{ label: '天', threshold: 60 * 60 * 24 },
	{ label: '小时', threshold: 60 * 60 },
	{ label: '分', threshold: 60 },
	{ label: '秒', threshold: 1 },
]

export function timeElapse(date: string | Temporal.PlainDateTime, maxDepth = 2) {
	let timeString = ''
	let secRemained = Temporal.Now.plainDateTimeISO().since(date, { largestUnit: 'second' }).seconds
	for (const interval of timeIntervals) {
		const count = Math.floor(secRemained / interval.threshold)
		if (count <= 0)
			continue
		timeString += `${count}${interval.label}`
		secRemained -= count * interval.threshold
		if (--maxDepth <= 0)
			break
	}
	return timeString || '刚刚'
}
