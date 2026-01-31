export type LayoutState = 'none' | 'sidebar' | 'aside' | 'search' | 'lightbox'

export type PanelTranslateSource = 'pagination'

export const useLayoutStore = defineStore('layout', () => {
	const router = useRouter()

	const state = ref<LayoutState>('none')
	const panelTranslate = ref<Partial<Record<PanelTranslateSource, string>>>({})
	const asideWidgets = ref<WidgetName[]>([])

	const close = () => state.value = 'none'

	const toggle = (key: LayoutState) => {
		if (state.value === key)
			return close()
		state.value = key
	}

	const setAside = (widgets?: WidgetName[]) => {
		if (widgets)
			asideWidgets.value = widgets
	}

	const setTranslate = (reason: PanelTranslateSource, value: string) => {
		panelTranslate.value[reason] = value
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
		asideWidgets,
		panelTranslate,
		close,
		toggle,
		setAside,
		setTranslate,
	}
})
