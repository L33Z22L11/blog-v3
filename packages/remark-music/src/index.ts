import type { Code, Root } from 'mdast'
import { visit } from 'unist-util-visit'

export default function remarkMusic() {
	return (tree: Root) => {
		visit(tree, 'code', (node: Code) => {
			if (node.lang === 'music-abc') {
				Object.assign(node, {
					type: 'musicScoreCodeBlock',
					data: {
						hName: 'music-score',
						hProperties: {
							abc: node.value,
						},
					},
				})
			}
		})
	}
}
