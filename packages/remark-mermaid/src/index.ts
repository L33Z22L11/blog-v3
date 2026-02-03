import type { Parent, Root } from 'mdast'
import { visit } from 'unist-util-visit'

interface MermaidNode extends Parent {
	type: 'mermaid'
}

declare module 'mdast' {
	interface RootContentMap {
		mermaid: MermaidNode
	}
}

export interface MermaidOptions {
	theme?: 'default' | 'neutral' | 'base' | 'dark' | 'forest' | 'night'
	lightTheme?: string
	darkTheme?: string
}

export default function remarkMermaid(userOptions: MermaidOptions = {}) {
	const defaultTheme = userOptions.theme ?? 'default'
	const defaultLightTheme = userOptions.lightTheme ?? 'default'
	const defaultDarkTheme = userOptions.darkTheme ?? 'dark'

	function getThemeFromClass(className: string | undefined): string {
		if (!className)
			return defaultTheme

		const isDark = className.includes('dark') || className.includes('night')
		return isDark ? defaultDarkTheme : defaultLightTheme
	}

	function createMermaidNode(code: string, theme: string): MermaidNode {
		return {
			type: 'mermaid',
			data: {
				hName: 'mermaid',
				hProperties: { code, theme },
			},
			children: [],
		}
	}

	return (tree: Root) => {
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang !== 'mermaid')
				return
			if (!parent || index === undefined)
				return

			const theme = getThemeFromClass(node.meta ?? undefined)
			parent.children[index] = createMermaidNode(node.value, theme)
		})
	}
}
