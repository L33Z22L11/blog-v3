import { LazyPopoverSearch } from '#components'

export const useSearchStore = defineStore('search', () => {
	const layoutStore = useLayoutStore()
	const modalStore = useModalStore()

	const word = ref('')
	const debouncedWord = refDebounced(word)

	const { open: _open, close, status } = modalStore.use(() => h(LazyPopoverSearch), {
		unique: true,
		duration: 200,
	})

	function open() {
		layoutStore.close()
		word.value = window.getSelection()?.toString().trim() || word.value
		_open()
	}

	function toggle() {
		if (status.value === 'open')
			close()
		else
			open()
	}

	return {
		open,
		close,
		toggle,
		word,
		debouncedWord,
	}
})
