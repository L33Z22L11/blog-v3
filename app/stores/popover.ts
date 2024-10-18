import type { Raw, VNode } from 'vue'

interface PopoverState {
    comp: VNode
    show: Ref<boolean>
}

export const usePopoverStore = defineStore('popover', () => {
    const pops = ref<Raw<PopoverState>[]>([])
    const use = (render: () => VNode) => {
        let state: PopoverState
        const show = ref(false)
        const open = async () => {
            state = {
                comp: render(),
                show,
            }
            pops.value.push(state)
            await nextTick()
            show.value = true
        }
        const close = async () => {
            const index = pops.value.indexOf(state)
            if (index === -1)
                return
            show.value = false
            await delay(500)
            pops.value.splice(index, 1)
        }

        return { open, close }
    }

    return {
        pops,
        use,
    }
})
