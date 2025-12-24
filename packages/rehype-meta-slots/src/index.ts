import type { Element, Properties, Root, RootContent } from 'hast'
import type { MinimarkNode, MinimarkTree } from 'minimark'
import type { VFile } from 'vfile'

export interface MetaSlotsTree extends MinimarkTree {
	props?: Properties
}

declare module 'vfile' {
	interface DataMap {
		slots?: Record<string, MetaSlotsTree>
	}
}

export function fromHast(node: Element): MetaSlotsTree {
	return {
		props: node.properties,
		type: 'minimark',
		value: node.children.map(hastToMinimarkNode).filter(v => v !== undefined),
	}
}

function hastToMinimarkNode(input: RootContent): MinimarkNode | undefined {
	if (input.type === 'comment' || input.type === 'doctype') {
		return undefined
	}
	if (input.type === 'text') {
		return input.value
	}

	if (input.tagName === 'code' && input.properties?.className && (input.properties.className as string[]).length === 0) {
		delete input.properties.className
	}

	return [
		input.tagName,
		input.properties || {},
		...(input.children || []).map(hastToMinimarkNode).filter(v => v !== undefined),
	]
}

export default function rehypeMetaSlots() {
	return (tree: Root, file: VFile) => {
		file.data.slots ??= {}

		for (let i = 0; i < tree.children.length; i++) {
			const node = tree.children[i]

			if (node.type === 'element' && node.tagName.startsWith('meta-')) {
				const metaName = node.tagName.slice('meta-'.length)
				file.data.slots[metaName] = fromHast(node)

				tree.children.splice(i, 1)
				i--
			}
		}
	}
}
