import type { BundledLanguage, CodeToHastOptions } from 'shiki'
import { defineConfig } from '#shiki/config'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { transformerNotationDiff, transformerNotationErrorLevel, transformerNotationFocus, transformerNotationHighlight, transformerNotationWordHighlight, transformerRenderIndentGuides, transformerRenderWhitespace } from '@shikijs/transformers'

type CustomTransformerOptions = Array<
	| 'ignoreColorizedBrackets'
	| 'ignoreRenderWhitespace'
	| 'ignoreRenderIndentGuides'
>
type ShikiOptions = CodeToHastOptions<BundledLanguage, string>

export function getShikiOptions(lang: string, transformerOptions?: CustomTransformerOptions, extraShikiOptions?: Omit<ShikiOptions, 'lang'>): ShikiOptions {
	return {
		...useShikiStore().options,
		lang,
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
	}
}

export default defineConfig({
	themes: {
		light: () => import('shiki/themes/catppuccin-latte.mjs'),
		dark: () => import('shiki/themes/one-dark-pro.mjs'),
	},
})
