export type LayoutState = 'none' | 'sidebar' | 'aside' | 'search' | 'lightbox'

export const useLayoutStore = defineStore('layout', () => {
	const router = useRouter()

	const state = ref<LayoutState>('none')
	const avoidTargets = ref<AvoidTarget[]>([])

	function close() {
		state.value = 'none'
	}

	const toggle = (key: LayoutState) => {
		if (state.value === key)
			return close()
		state.value = key
	}

	onKeyStroke('Escape', (e) => {
		if (state.value !== 'none') {
			e.preventDefault()
			close()
		}
	})

	onScopeDispose(router.beforeEach(close))

	return {
		state,
		avoidTargets,
		close,
		toggle,
	}
})
