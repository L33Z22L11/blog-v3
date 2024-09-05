export type Aside = string[]

export const useUIStore = defineStore('UI', () => {
    const isSidebarOpen = ref(false)
    const isAsideOpen = ref(false)

    // 为空数组时占位，为 false 时隐藏
    const aside = ref<Aside>([])

    const toggleSidebar = () => {
        if (isAsideOpen.value) {
            isAsideOpen.value = false
        }
        isSidebarOpen.value = !isSidebarOpen.value
    }

    const toggleAside = () => {
        if (isSidebarOpen.value) {
            isSidebarOpen.value = false
        }
        isAsideOpen.value = !isAsideOpen.value
    }

    const setAside = (newAside: Aside) => {
        aside.value = newAside ?? []
    }

    return {
        isSidebarOpen,
        isAsideOpen,
        aside,
        toggleSidebar,
        toggleAside,
        setAside,
    }
})
