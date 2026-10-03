import type { Properties } from 'hast'
import type { Parent, Root } from 'mdast'
import type { VFile } from 'vfile'
import { visit } from 'unist-util-visit'

interface ContainerComponent extends Parent {
	type: 'containerComponent'
	name: string
	data?: Parent['data'] & { hProperties?: Properties }
}

interface DemoComponent extends Parent {
	type: 'demoComponent'
}

declare module 'mdast' {
	interface RootContentMap {
		containerComponent: ContainerComponent
		demoComponent: DemoComponent
	}
}

/** 构建时将 ::demo 展开为预览和源码，共用 ContentRenderer 的组件映射。 */
export default function remarkDemo() {
	return (tree: Root, file: VFile) => {
		const lines = String(file).split(/\r?\n/)
		visit(tree, 'containerComponent', (node, index, parent) => {
			if (node.name !== 'demo' || !parent || index === undefined || !node.position)
				return

			const first = node.children[0]?.position
			const last = node.children.at(-1)?.position
			// 只移除 demo 容器自身的缩进，不按内容的最小缩进 dedent。
			const indent = new RegExp(`^ {0,${node.position.start.column - 1}}`)
			const source = first && last
				? lines.slice(first.start.line - 1, last.end.line).map(line => line.replace(indent, '')).join('\n')
				: ''
			const { meta = '', ...props } = node.data?.hProperties ?? {}

			parent.children.splice(index, 1, {
				type: 'demoComponent',
				data: { hName: 'tab', hProperties: { ':tabs': '["组件","语法"]', ...props } },
				// 沿用 MDC 的插槽占位节点，让 rehype 插件仍能遍历内部内容。
				children: [
					{
						type: 'demoComponent',
						data: { hName: 'component-slot', hProperties: { 'v-slot:tab1': '' } },
						children: node.children,
					},
					{
						type: 'demoComponent',
						data: { hName: 'component-slot', hProperties: { 'v-slot:tab2': '' } },
						children: [{ type: 'code', lang: 'mdc', meta: String(meta), value: source }],
					},
				],
			})
		})
	}
}
