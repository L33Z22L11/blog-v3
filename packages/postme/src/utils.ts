import type hast from 'hast'
import type { Child, Element, Root } from './types'

export function transformRoot(root: hast.Parent): Root {
	return {
		type: 'root',
		children: transformNodes(root.children),
	}
}

export function transformElement(node: hast.Element): Element {
	return {
		type: node.type,
		tag: node.tagName,
		props: node.properties,
		children: transformNodes(node.children),
	}
}

export function transformNodes(nodes: hast.RootContent[]): Child[] {
	const children: Child[] = []
	for (const node of nodes) {
		if (node.type === 'element') {
			children.push(transformElement(node))
		}
		else if (node.type === 'raw' || node.type === 'text') {
			children.push({
				type: 'text',
				value: node.value,
			})
		}
	}
	return children
}
