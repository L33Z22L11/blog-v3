export const useContentStore = defineStore('content', () => {
    const posts = ref()
    return {
        posts,
    }
})
