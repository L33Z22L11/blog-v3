export type LayoutState = 'none' | 'sidebar' | 'aside' | 'search' | 'lightbox'

export const useLayoutStore = defineStore('layout', () => {
	const router = useRouter()

	const state = ref<LayoutState>('none')
	const avoidTargets = ref<AvoidTarget[]>([])

	const close = () => state.value = 'none'

	const toggle = (key: LayoutState) => {
		if (state.value === key)
			return close()
		state.value = key
	}

	useEventListener('keydown', (e) => {
		if (state.value !== 'none' && e.key === 'Escape') {
			e.preventDefault()
			close()
		}
	})

	router.beforeEach(() => {
		close()
	})

	return {
		state,
		avoidTargets,
		close,
		toggle,
	}
})
