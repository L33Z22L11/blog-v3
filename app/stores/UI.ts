export type Aside = string[]

export const useUIStore = defineStore('UI', () => {
    // FIXME: 减少 ref 冗余
    const isSidebarOpen = ref(false)
    const isAsideOpen = ref(false)
    const isSearchOpen = ref(false)

    // 为空数组时占位，为 false 时隐藏
    const aside = ref<Aside>([])

    const closeAll = () => {
        isSidebarOpen.value = false
        isAsideOpen.value = false
        isSearchOpen.value = false
    }

    const toggleSidebar = () => {
        const isOpen = isSidebarOpen.value
        closeAll()
        isSidebarOpen.value = !isOpen
    }

    const toggleAside = () => {
        const isOpen = isAsideOpen.value
        closeAll()
        isAsideOpen.value = !isOpen
    }

    const toggleSearch = () => {
        const isOpen = isSearchOpen.value
        closeAll()
        isSearchOpen.value = !isOpen
    }
    const setAside = (newAside?: Aside) => {
        if (newAside)
            aside.value = newAside ?? []
    }

    return {
        isSidebarOpen,
        isAsideOpen,
        aside,
        isSearchOpen,
        closeAll,
        toggleSidebar,
        toggleAside,
        setAside,
        toggleSearch,
    }
})
