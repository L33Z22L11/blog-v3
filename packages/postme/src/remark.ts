import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkMdc from 'remark-mdc'
import remarkParse from 'remark-parse'
import remarkReadingTime from 'remark-reading-time'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import compiler from './plugins/compiler'
import remarkFrontmatter from './plugins/frontmatter'
import rehypeMetaSlots from './plugins/meta-slots'
import remarkMusic from './plugins/music'

export async function parseArticle(text: string) {
	const processor = unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkMdc)
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkMusic)
		.use(remarkReadingTime, {})
		.use(remarkRehype, { footnoteLabel: '脚注' })
		.use(rehypeRaw)
		.use(rehypeKatex)
		.use(rehypeMetaSlots)
		.use(compiler)

	const { result, data } = await processor.process(text)

	return {
		body: result,
		slots: data.slots,
		frontmatter: data.frontmatter,
	}
}
