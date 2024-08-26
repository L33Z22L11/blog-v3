// useRouteParams 默认会避免对默认值进行不必要的更新
// 因此手动实现，实现默认值更新

interface UseRouteParamsOptions<T> {
    transform?: (value: string) => T
}

export default function useRouteParams<T>(name: string, defaultValue?: T, options?: UseRouteParamsOptions<T>) {
    const route = useRoute()
    const router = useRouter()
    const { transform } = options ?? {}
    const param = computed({
        get() {
            const value = route.params[name] as string | undefined
            return (value ? (transform ? transform(value) : value) : defaultValue) as T
        },
        set(value) {
            router.push({
                params: {
                    [name]: String(value),
                },
            })
        },
    })
    return param
}
