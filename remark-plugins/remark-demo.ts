import type { Parent, Root } from 'mdast'
import type { Processor } from 'unified'
import { visit } from 'unist-util-visit'

interface ContainerComponent extends Parent {
	type: 'containerComponent'
	name: string
	attributes: Record<string, string>
}

declare module 'mdast' {
	interface RootContentMap {
		containerComponent: ContainerComponent
	}
}

/** 构建时解析 demo 代码块，预览继续使用 ContentRenderer 的组件映射。 */
export default function remarkDemo(this: Processor) {
	const parse = this.parser!
	// 在转换插件运行前展开，确保预览也经过 MDC 属性绑定等处理。
	this.parser = (document, file) => {
		const tree = parse(document, file) as Root
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang !== 'demo' || !parent || index === undefined)
				return

			parent.children[index] = {
				type: 'containerComponent',
				name: 'demo',
				attributes: { raw: node.value, meta: node.meta ?? '' },
				children: (this.parse(node.value) as Root).children,
			}
		})
		return tree
	}
}
