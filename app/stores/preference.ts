import { dash } from 'radash'
import { name } from '~~/package.json'

export const fontFamilyOptions = [
	{
		label: '自动',
		value: 'var(--font-sans)',
	},
	{
		label: '大中宫',
		value: 'var(--font-stroke-free)',
	},
	{
		label: '系统',
		value: 'system-ui',
	},
	{
		label: '衬线',
		value: 'var(--font-serif)',
	},
	{
		label: '等宽',
		value: 'var(--font-monospace)',
	},
] as const

export const textAlignOptions = [
	{
		label: '默认',
		value: 'inherit',
	},
	{
		label: '分散',
		value: 'justify',
	},
] as const

// @keep-sorted
export const defaultPreferences = {
	fontFamily: fontFamilyOptions[0].value,
	fontSize: '1em',
	hue: '220',
	letterSpacing: '0em',
	lineHeight: '1.8',
	textAlign: textAlignOptions[0].value,
}

export const usePreferenceStore = defineStore('preference', () => {
	const preferences = useLocalStorage(`${name}-preference`, defaultPreferences)

	const updateCssVar = (data: Record<string, string>) => {
		if (!import.meta.client)
			return
		for (const [key, value] of Object.entries(data))
			document.documentElement.style.setProperty(`--${dash(key)}`, value)
	}

	watchDeep(preferences, updateCssVar)

	return {
		preferences,
	}
})
