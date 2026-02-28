export default function useBack(
	block: MaybeRefOrGetter<boolean>,
	onBack?: () => void,
	state = null,
) {
	function push() {
		history.pushState(state, '')
	}

	function pop() {
		if (history.state === state)
			history.back()
	}

	watch(() => toValue(block), (val) => {
		if (val)
			push()
		else
			pop()
	})

	useEventListener('popstate', () => {
		onBack?.()
	})
}
