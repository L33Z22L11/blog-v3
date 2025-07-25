import type { BundledLanguage, CodeToHastOptions, HighlighterCore } from 'shiki'
import { transformerRenderWhitespace } from '@shikijs/transformers'

let promise: Promise<HighlighterCore>
let shiki: HighlighterCore

export const useShikiStore = defineStore('shiki', () => {
	const options: CodeToHastOptions<BundledLanguage, any> = {
		lang: 'text',
		themes: {
			light: 'catppuccin-latte',
			dark: 'one-dark-pro',
		},
		transformers: [
			transformerRenderWhitespace(),
			{
				root: hast => ({
					type: 'root',
					children: (hast.children[0] as any).children,
				}),
				line(node, line) {
					node.properties['data-line'] = line
				},
			},
		],
	}

	async function load() {
		promise ??= loadShiki()
		shiki ??= await promise
		return shiki
	}

	async function loadShiki() {
		const { createHighlighterCore } = await import('shiki/core')
		const { createJavaScriptRegexEngine } = await import('shiki/engine-javascript.mjs')

		return createHighlighterCore({
			themes: [
				await import('shiki/themes/catppuccin-latte.mjs'),
				await import('shiki/themes/one-dark-pro.mjs'),
			],
			engine: createJavaScriptRegexEngine(),
		})
	}

	async function loadLang(...langs: string[]) {
		const { bundledLanguages } = await import('shiki/langs')
		const loadedLangs = shiki.getLoadedLanguages()

		await Promise.all(langs
			.filter(unjudged => !loadedLangs.includes(unjudged) && unjudged in bundledLanguages)
			.map(unloaded => bundledLanguages[unloaded as BundledLanguage])
			.map(dynamicLang => dynamicLang().then(grammar => shiki.loadLanguage(grammar))),
		).catch((err) => {
			console.error('load lang error', err)
		})
	}

	return {
		options,
		load,
		loadLang,
	}
})
