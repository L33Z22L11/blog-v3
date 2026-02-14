import type hast from 'hast'
import type { VFile } from 'vfile'
import type { Element } from '../types'
import { transformElement } from '../utils'

declare module 'vfile' {
	interface DataMap {
		slots?: Record<string, Element>
	}
}

export default function rehypeMetaSlots() {
	return (tree: hast.Root, file: VFile) => {
		for (let i = 0; i < tree.children.length; i++) {
			const node = tree.children[i]

			if (node.type === 'element' && node.tagName.startsWith('meta-')) {
				const metaName = node.tagName.slice('meta-'.length)
				file.data.slots ??= {}
				file.data.slots[metaName] = transformElement(node)

				tree.children.splice(i, 1)
				i--
			}
		}
	}
}
