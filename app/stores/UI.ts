export const useUIStore = defineStore('UI', () => {
    const sidebarOpen = ref(false)
    const asideOpen = ref(false)

    // 切换 sidebar 的打开状态
    const toggleSidebar = () => {
        if (asideOpen.value) {
            asideOpen.value = false
        }
        sidebarOpen.value = !sidebarOpen.value
    }

    // 切换 aside 的打开状态
    const toggleAside = () => {
        if (sidebarOpen.value) {
            sidebarOpen.value = false
        }
        asideOpen.value = !asideOpen.value
    }

    // 返回状态和方法
    return {
        sidebarOpen,
        asideOpen,
        toggleSidebar,
        toggleAside,
    }
})
