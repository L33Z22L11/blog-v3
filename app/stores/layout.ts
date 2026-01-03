const defaultState = {
	sidebar: false,
	aside: false,
	search: false,
}

type LayoutSection = keyof typeof defaultState

export const useLayoutStore = defineStore('layout', () => {
	const router = useRouter()

	const open = ref({ ...defaultState })
	const isAnyOpen = computed(() => Object.values(open.value).some(Boolean))
	const translate = ref<Record<string, string>>({})

	const asideWidgets = ref<WidgetName[]>([])

	const closeAll = () => {
		Object.keys(open.value).forEach((key) => {
			open.value[key as LayoutSection] = false
		})
	}

	const toggle = (key: LayoutSection) => {
		const isActive = open.value[key]
		closeAll()
		open.value[key] = !isActive
	}

	const setAside = (widgets?: WidgetName[]) => {
		if (widgets)
			asideWidgets.value = widgets
	}

	const setTranslate = (reason: string, value: string) => {
		translate.value[reason] = value
	}

	router.beforeEach(() => {
		closeAll()
	})

	return {
		open,
		isAnyOpen,
		asideWidgets,
		translate,
		closeAll,
		toggle,
		setAside,
		setTranslate,
	}
})
