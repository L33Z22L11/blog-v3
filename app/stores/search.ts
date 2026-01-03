import { LazyPopoverSearch } from '#components'

export const useSearchStore = defineStore('search', () => {
	const layoutStore = useLayoutStore()
	const popoverStore = usePopoverStore()

	const word = ref('')
	const debouncedWord = refDebounced(word)

	const { open, close } = popoverStore.use(() => h(LazyPopoverSearch))

	watch(() => layoutStore.open.search, (searchOpen) => {
		if (!searchOpen)
			return close()

		word.value = window.getSelection()?.toString().trim() || word.value
		open()
	})

	return {
		word,
		debouncedWord,
	}
})
