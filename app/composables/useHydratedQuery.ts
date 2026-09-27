/** 水合时沿用服务端查询结果，挂载后再应用 URL 参数，避免 SSG 深链接重建列表。 */
export function useHydratedQuery<T>(name: string, source: Ref<T>): Ref<T> {
	const nuxtApp = useNuxtApp()
	if (import.meta.client && !nuxtApp.isHydrating)
		return source

	const initial = useState<{ value: T }>(`query:${useContentPath().value}:${name}`, () => ({ value: source.value }))
	const mounted = useMounted()

	return computed({
		get: () => mounted.value ? source.value : initial.value.value,
		set: (value) => { source.value = value },
	})
}
