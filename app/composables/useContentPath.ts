/** 当前内容的规范路径；跟随已提交的 Nuxt 页面，也可接收外部响应式路径。 */
export function useContentPath(path?: MaybeRefOrGetter<string | undefined>) {
	const route = useRoute()
	return computed(() => normalizeContentPath(toValue(path) ?? route.path))
}
