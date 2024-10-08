// FIXME: 完善 Aside 类型
export type AsideItem = string[]

const defaultState = {
    sidebar: false,
    aside: false,
    search: false,
}

type LayoutSection = keyof typeof defaultState

export const useLayoutStore = defineStore('layout', () => {
    const open = ref({ ...defaultState })
    const isAnyOpen = computed(() => Object.values(open.value).some(Boolean))

    // 为空数组时占位，为 false 时隐藏
    const asideItems = ref<AsideItem>([])

    const closeAll = () => {
        Object.keys(open.value).forEach((key) => {
            open.value[key as LayoutSection] = false
        })
    }

    const toggle = (key: LayoutSection) => {
        const isActive = open.value[key]
        closeAll()
        open.value[key] = !isActive
    }

    const setAside = (items?: AsideItem) => {
        if (items)
            asideItems.value = items ?? []
    }

    const isOpen = (key: LayoutSection) => open.value[key]

    return {
        open,
        isAnyOpen,
        asideItems,
        closeAll,
        toggle,
        setAside,
        isOpen,
    }
})
