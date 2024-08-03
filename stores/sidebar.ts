export const useSidebarStore = defineStore('sidebar', () => {
    const isOpen = ref(false)

    const toggle = () => {
        isOpen.value = !isOpen.value
    }

    return {
        isOpen,
        toggle,
    }
})
