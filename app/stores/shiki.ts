import type { BundledLanguage, CodeToHastOptions, HighlighterCore, RegexEngine } from 'shiki'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { transformerNotationDiff, transformerNotationErrorLevel, transformerNotationFocus, transformerNotationHighlight, transformerNotationWordHighlight, transformerRenderIndentGuides, transformerRenderWhitespace } from '@shikijs/transformers'

let promise: Promise<HighlighterCore>
let shiki: HighlighterCore

type CustomTransformerOptions = Array<
	| 'ignoreColorizedBrackets'
	| 'ignoreRenderWhitespace'
	| 'ignoreRenderIndentGuides'
>

type ShikiOptions = CodeToHastOptions<BundledLanguage, string>

export const useShikiStore = defineStore('shiki', () => {
	const getOptions = (
		lang: string,
		transformerOptions?: CustomTransformerOptions,
		extraShikiOptions?: Omit<ShikiOptions, 'lang'>,
	): ShikiOptions => ({
		lang,
		themes: {
			light: 'catppuccin-latte',
			dark: 'one-dark-pro',
		},
		transformers: [
			transformerNotationDiff(),
			transformerNotationHighlight(),
			transformerNotationWordHighlight(),
			transformerNotationFocus(),
			transformerNotationErrorLevel(),
			transformerOptions?.includes('ignoreRenderIndentGuides') || ['ansi', 'log', 'text'].includes(lang)
				? {}
				: transformerRenderIndentGuides(),
			transformerOptions?.includes('ignoreRenderWhitespace') || ['ansi', 'log', 'text'].includes(lang)
				? {}
				: transformerRenderWhitespace(),
			transformerOptions?.includes('ignoreColorizedBrackets')
				? {}
				: transformerColorizedBrackets(),
			{
				root: hast => ({
					type: 'root',
					children: (hast.children[0] as any).children[0].children,
				}),
				line(node, line) {
					node.properties['data-line'] = line
				},
			},
		],
		...extraShikiOptions,
	})

	async function load() {
		promise ??= loadShiki()
		shiki ??= await promise
		return shiki
	}

	async function loadShiki() {
		const [
			{ createHighlighterCore },
			{ createJavaScriptRegexEngine },
			catppuccinLatte,
			oneDarkPro,
		] = await Promise.all([
			import('shiki/core'),
			import('shiki/engine-javascript.mjs'),
			import('shiki/themes/catppuccin-latte.mjs'),
			import('shiki/themes/one-dark-pro.mjs'),
		])

		// 测试是否支持正则 Modifier: `(?ims-ims:...)`
		let engine: RegexEngine
		try {
			// eslint-disable-next-line prefer-regex-literals, regexp/strict
			void new RegExp('(?i: )')
			engine = createJavaScriptRegexEngine()
		}
		catch {
			const { createOnigurumaEngine } = await import('shiki/engine-oniguruma.mjs')
			// @ts-expect-error CDN 动态引入的包无类型
			engine = await createOnigurumaEngine(import('https://esm.sh/shiki/wasm'))
		}

		return createHighlighterCore({ themes: [catppuccinLatte, oneDarkPro], engine })
	}

	async function loadLang(...langs: string[]) {
		// @ts-expect-error CDN 动态引入的包无类型
		const { bundledLanguages } = await import('https://esm.sh/shiki/langs') as typeof import('shiki/langs')
		const loadedLangs = shiki.getLoadedLanguages()

		await Promise.all(langs
			.filter(unjudged => !loadedLangs.includes(unjudged) && unjudged in bundledLanguages)
			.map(unloaded => bundledLanguages[unloaded as BundledLanguage])
			.map(dynamicLang => dynamicLang().then(grammar => shiki.loadLanguage(grammar))),
		)
	}

	return {
		getOptions,
		load,
		loadLang,
	}
})
