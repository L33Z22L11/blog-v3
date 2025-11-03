import type { Raw, VNode } from 'vue'

interface PopoverState {
	vnode: VNode
	duration: number
	show: Ref<boolean>
	zIndex: number
}

export interface PopoverOptions {
	duration?: number
	unique?: boolean
}

export const usePopoverStore = defineStore('popover', () => {
	const pops = ref<Raw<PopoverState>[]>([])

	function use(render: () => VNode, options?: PopoverOptions) {
		let state: PopoverState
		const show = ref(false)
		const zIndex = pops.value.length + 100

		async function open() {
			if (options?.unique ? pops.value.includes(state) : show.value)
				return

			const vnode = render()
			state = {
				vnode,
				show,
				duration: options?.duration ?? 200,
				zIndex,
			}
			pops.value.push(state)
			Object.assign(vnode.props ??= {}, {
				style: { '--delay': `${state.duration}ms` },
				onClose: vnode.props?.onClose ?? close,
				onVnodeMounted: () => (show.value = true),
			})
		}

		async function close() {
			const index = pops.value.indexOf(state)
			if (index === -1)
				return
			show.value = false

			await delay(state.duration)
			pops.value.splice(index, 1)
		}

		return { open, close }
	}

	return {
		pops,
		use,
	}
})
