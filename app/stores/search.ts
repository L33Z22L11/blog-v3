import { LazyPopoverSearch } from '#components'

export const useSearchStore = defineStore('search', () => {
	const layoutStore = useLayoutStore()
	const popoverStore = usePopoverStore()
	const word = ref('')

	useEventListener('keydown', (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault()
			layoutStore.toggle('search')
		}
	})

	const { open, close } = popoverStore.use(() => h(LazyPopoverSearch))

	watch(() => layoutStore.isOpen('search'), (searchOpen) => {
		searchOpen ? open() : close()
	})

	return {
		word,
	}
})
