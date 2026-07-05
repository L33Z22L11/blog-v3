import type { BundledLanguage, CodeToHastOptions, ShikiTransformer } from 'shiki'
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets'
import { transformerNotationDiff, transformerNotationErrorLevel, transformerNotationFocus, transformerNotationHighlight, transformerNotationWordHighlight, transformerRenderIndentGuides, transformerRenderWhitespace } from '@shikijs/transformers'

type TransformerOptions = Array<
	| 'ignoreColorizedBrackets'
	| 'ignoreRenderWhitespace'
	| 'ignoreRenderIndentGuides'
>
type ShikiOptions = CodeToHastOptions<BundledLanguage, string>

const plainTextLanguages = new Set(['ansi', 'log', 'text'])

interface ShikiCodeOptions {
	language: string
	transformerOptions?: TransformerOptions
	shikiOptions?: Omit<ShikiOptions, 'lang'>
}

type ShikiHtmlOptions = ShikiCodeOptions & {
	embeddedLanguages?: boolean
}

function getEmbeddedMarkdownLanguages(code: string, language: string) {
	if (language !== 'markdown' && !language.startsWith('md'))
		return []

	// 处理 Markdown 高亮内代码块中的语言
	// 加载 TeX 语言有概率导致 LaTeX 语言高亮炸掉
	const mdLangRegex = /^\s*`{3,}(\S+)/gm
	return [...new Set(
		Array
			.from(code.matchAll(mdLangRegex), match => match[1])
			.filter(lang => lang !== undefined),
	)]
}

function transformerUnwrap(): ShikiTransformer {
	return {
		root: (hast) => {
			const lines = (hast.children[0] as any).children[0].children

			return {
				type: 'root',
				children: lines,
			}
		},
		line(node, line) {
			node.properties['data-line'] = line
		},
	}
}

function getTransformers(options: ShikiCodeOptions): ShikiTransformer[] {
	const ignored = new Set(options.transformerOptions)
	const inline = options.shikiOptions?.structure === 'inline'
	const ignoreInvisibleChars = inline || plainTextLanguages.has(options.language)

	return [
		transformerNotationDiff(),
		transformerNotationHighlight(),
		transformerNotationWordHighlight(),
		transformerNotationFocus(),
		transformerNotationErrorLevel(),
		ignored.has('ignoreRenderIndentGuides') || ignoreInvisibleChars ? {} : transformerRenderIndentGuides(),
		ignored.has('ignoreRenderWhitespace') || ignoreInvisibleChars ? {} : transformerRenderWhitespace(),
		ignored.has('ignoreColorizedBrackets') ? {} : transformerColorizedBrackets(),
		inline ? {} : transformerUnwrap(),
	]
}

export default function useShiki() {
	const shikiStore = useShikiStore()

	function getOptions(options: ShikiCodeOptions): ShikiOptions {
		return {
			...shikiStore.options,
			lang: options.language,
			transformers: getTransformers(options),
			...options.shikiOptions,
		}
	}

	async function codeToHtml(code: string, language: string): Promise<string>
	async function codeToHtml(code: string, options: ShikiHtmlOptions): Promise<string>
	async function codeToHtml(code: string, languageOrOptions: string | ShikiHtmlOptions): Promise<string> {
		const options = typeof languageOrOptions === 'string' ? { language: languageOrOptions } : languageOrOptions
		const shiki = await shikiStore.load()
		await shikiStore.loadLang(options.language)

		if (typeof languageOrOptions !== 'string' && languageOrOptions.embeddedLanguages)
			await shikiStore.loadLang(...getEmbeddedMarkdownLanguages(code, options.language))

		return shiki.codeToHtml(code, getOptions(options))
	}

	async function mountPlain(target: HTMLElement, language: string): Promise<void>
	async function mountPlain(target: HTMLElement, options: ShikiCodeOptions): Promise<void>
	async function mountPlain(target: HTMLElement, languageOrOptions: string | ShikiCodeOptions): Promise<void> {
		const options = typeof languageOrOptions === 'string' ? { language: languageOrOptions } : languageOrOptions
		const shiki = await shikiStore.load()
		const { createPlainShiki } = await import('plain-shiki')

		await shikiStore.loadLang(options.language)
		createPlainShiki(shiki).mount(target, getOptions(options))
	}

	async function mountInline(target: HTMLElement, code: string, options: ShikiCodeOptions): Promise<void> {
		target.classList.add('shiki')
		target.insertAdjacentHTML('afterbegin', await codeToHtml(code, {
			...options,
			shikiOptions: {
				...options.shikiOptions,
				structure: 'inline',
			},
		}))
	}

	return {
		codeToHtml,
		mountInline,
		mountPlain,
	}
}
