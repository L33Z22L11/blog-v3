import type { Parent, Root } from 'mdast'
import { visit } from 'unist-util-visit'

interface CodeComponentNode extends Parent {
	type: 'codeComponent'
}

declare module 'mdast' {
	interface RootContentMap {
		codeComponent: CodeComponentNode
	}
}

interface CodeComponent {
	/** 渲染该语言代码块的组件 */
	component: string
	/** 组件上接收代码内容的属性 */
	prop: string
}

/** 代码块语言到组件的映射 */
export type CodeComponents = Record<string, CodeComponent>

export default function remarkCodeComponent(components: CodeComponents = {}) {
	return (tree: Root) => {
		visit(tree, 'code', (node, index, parent) => {
			const options = components[node.lang ?? '']
			if (!options || !parent || index === undefined)
				return

			parent.children.splice(index, 1, {
				type: 'codeComponent',
				children: [],
				data: {
					hName: options.component,
					hProperties: { [options.prop]: node.value },
				},
			})
		})
	}
}
