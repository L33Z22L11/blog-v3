import type { Raw, VNode } from 'vue'

interface PopoverState {
    vnode: VNode
    duration: number
    isOpening: Ref<boolean>
    zIndex: number
}

export interface PopoverOptions {
    duration?: number
}

export const usePopoverStore = defineStore('popover', () => {
    const pops = ref<Raw<PopoverState>[]>([])
    const use = (render: () => VNode, options?: PopoverOptions) => {
        let state: PopoverState
        const isOpening = ref(false)
        const zIndex = pops.value.length + 100

        async function open() {
            const vnode = render()
            state = {
                vnode,
                isOpening,
                duration: options?.duration ?? 0,
                zIndex,
            }
            pops.value.push(state)
            vnode.props ??= {}
            vnode.props.onClose ??= close
            vnode.props.onVnodeMounted = () => {
                isOpening.value = true
            }
        }

        async function close() {
            const index = pops.value.indexOf(state)
            if (index === -1)
                return
            isOpening.value = false

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
