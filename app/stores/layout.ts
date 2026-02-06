export type LayoutState = 'none' | 'sidebar' | 'aside' | 'search' | 'lightbox'

export type PanelTranslateSource = 'pagination' | 'archiveTuning'

export const useLayoutStore = defineStore('layout', () => {
	const router = useRouter()

	const state = ref<LayoutState>('none')
	const asideWidgets = ref<WidgetName[]>([])
	const panelTranslate = ref<Partial<Record<PanelTranslateSource, string>>>({})

	const panelTransform = computed(() => Object.values(panelTranslate.value).map(v => v ? `translate(${v})` : '').join(' '))

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
		panelTransform,
		close,
		toggle,
		setAside,
	}
})
