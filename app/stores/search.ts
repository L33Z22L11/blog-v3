import { LazyPopoverSearch } from '#components'

export const useSearchStore = defineStore('search', () => {
	// 搜索框应和侧边栏状态联动
	const layoutStore = useLayoutStore()
	const modalStore = useModalStore()

	const word = ref('')
	const { text } = useTextSelection()
	const label = computed(() => text.value.trim() || word.value || '搜索')

	const { open, close } = modalStore.use(() => h(LazyPopoverSearch, {
		onClose: layoutStore.close,
	}), {
		unique: true,
		duration: 200,
	})

	// 从外部调用时应该操作 layoutStore
	watch(() => layoutStore.state, (state) => {
		if (state !== 'search')
			return close()

		word.value = text.value.trim() || word.value
		open()
	})

	return {
		word,
		label,
	}
})
