import type { Raw, VNode } from 'vue'

interface PopoverState {
    component: VNode
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
        const open = async () => {
            state = {
                component: render(),
                isOpening,
                duration: options?.duration ?? 0,
                zIndex,
            }
            pops.value.push(state)
            await nextTick()
            isOpening.value = true
        }
        const close = async () => {
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
