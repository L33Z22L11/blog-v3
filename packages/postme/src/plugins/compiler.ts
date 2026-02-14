import type hast from 'hast'
import type { Plugin } from 'unified'
import type { Root } from '../types'
import { transformRoot } from '../utils'

declare module 'unified' {
	interface CompileResultMap {
		root: Root
	}
}

export default <Plugin<[], hast.Root, Root>> function compiler() {
	this.compiler = node => transformRoot(node as hast.Root)
}
