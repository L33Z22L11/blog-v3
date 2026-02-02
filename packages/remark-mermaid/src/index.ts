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

function getThemeFromClass(className: string | undefined, options: MermaidOptions): string {
  if (!className)
    return options.theme ?? 'default'

  const isDark = className.includes('dark') || className.includes('night')
  return isDark ? (options.darkTheme ?? 'dark') : (options.lightTheme ?? 'default')
}

export default function remarkMermaid(options: MermaidOptions = {}) {
  return (tree: Root) => {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang === 'mermaid') {
        if (!parent || index === undefined)
          return

        const theme = getThemeFromClass(node.meta ?? undefined, options)

        parent.children.splice(index, 1, {
          type: 'mermaid',
          data: {
            hName: 'mermaid',
            hProperties: {
              code: node.value,
              theme,
            },
          },
          children: [],
        })
      }
    })
  }
}
