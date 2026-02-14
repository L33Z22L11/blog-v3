import type mdast from 'mdast'
import type { Processor } from 'unified'
import type { VFile } from 'vfile'
import { frontmatterFromMarkdown } from 'mdast-util-frontmatter'
import { frontmatter } from 'micromark-extension-frontmatter'
import { visit } from 'unist-util-visit'
import YAML from 'yaml'

declare module 'vfile' {
	interface DataMap {
		frontmatter?: Record<string, unknown>
	}
}

export default function remarkFrontmatter(this: Processor) {
	const data = this.data()
	data.micromarkExtensions ??= []
	data.micromarkExtensions.push(frontmatter())
	data.fromMarkdownExtensions ??= []
	data.fromMarkdownExtensions.push(frontmatterFromMarkdown())
	return (tree: mdast.Root, vfile: VFile) => {
		visit(tree, 'yaml', (node) => {
			vfile.data.frontmatter = YAML.parse(node.value)
		})
	}
}
