export function useUnit(
	source: Ref<string> | any,
	unit: string = '',
) {
	return computed({
		get() {
			return Number.parseFloat(toValue(source))
		},
		set(newVal: number) {
			source.value = `${newVal}${unit}`
		},
	})
}
