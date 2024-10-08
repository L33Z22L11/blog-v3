const defaultState = {
    url: '',
    caption: '',
}
type State = typeof defaultState

export const useLightboxStore = defineStore('lightbox', () => {
    const state: State = reactive({ ...defaultState })

    function setState<T extends State>(newState: Partial<T>) {
        Object.assign(state, newState)
    }

    return {
        ...toRefs(state),
        setState,
    }
})
