import type { SearchResult } from 'minisearch'
import { LazyZSearch } from '#components'

export const useSearchStore = defineStore('search', () => {
    const layoutStore = useLayoutStore()
    const popoverStore = usePopoverStore()
    const word = ref('')
    const result = ref<SearchResult[]>([])

    useEventListener('keydown', (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
            event.preventDefault()
            layoutStore.toggle('search')
        }
    })

    const { open, close } = popoverStore.use(() => h(LazyZSearch), { duration: 200 })
    watch(() => layoutStore.isOpen('search'), (searchOpen) => {
        searchOpen ? open() : close()
    })

    return {
        word,
        result,
        open,
        close,
    }
})
