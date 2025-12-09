import { toArray } from '@vueuse/core'

// @keep-sorted
const promptLanguageMap: Record<string, string> = {
	'#': 'sh',
	'$': 'sh',
	'CMD': 'bat',
	'PS': 'powershell',
}

export function formatNumber(num?: number) {
	if (typeof num !== 'number')
		return ''
	const intervals = [
		{ label: '万亿', threshold: 1e12 },
		{ label: '亿', threshold: 1e8 },
		{ label: '万', threshold: 1e4 },
	]
	for (const interval of intervals) {
		if (num >= interval.threshold)
			return `${(num / interval.threshold).toFixed(2)}${interval.label}`
	}
	return num.toString()
}

export function getPromptLanguage(prompt: string | boolean) {
	if (typeof prompt === 'boolean')
		return 'text'
	for (const promptPrefix in promptLanguageMap) {
		if (prompt.startsWith(promptPrefix))
			return promptLanguageMap[promptPrefix] ?? 'text'
	}
	return 'text'
}

export function joinWith(strings: (string | undefined)[], separator = '\n') {
	return strings.filter(Boolean).join(separator)
}

export function escapeHtml(text: string) {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		'\'': '&#039;',
	}
	return text.replace(/[&<>"']/g, match => map[match] || match)
}

export function highlightHtml(text: string, words: string | string[] | undefined, className?: string) {
	if (!text)
		return ''
	const format = (str: string) => str.replace(/\n+/g, '<br>')

	const validTerms = new Set(
		toArray(words)
			.filter((t): t is string => !!t && t.trim().length > 0)
			.map(t => t.toLowerCase()),
	)

	if (validTerms.size === 0)
		return format(escapeHtml(text))

	const escapedTerms = Array.from(validTerms)
		.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

	const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi')

	return text
		.split(regex)
		.map(part => part && validTerms.has(part.toLowerCase())
			? `<mark ${className ? `class="${className}"` : ''}>${escapeHtml(part)}</mark>`
			: escapeHtml(part))
		.join('')
		.replace(/\n+/g, '<br>')
}

export function removeHtmlTags(str?: string) {
	if (typeof str !== 'string')
		return ''
	return str.replace(/<[^>]+(>|$)/g, '')
}
