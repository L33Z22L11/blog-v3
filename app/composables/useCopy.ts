import 'tippy.js/dist/tippy.css'

export default function (
    trigger: MaybeRefOrGetter<HTMLElement | null>,
    target: MaybeRefOrGetter<HTMLInputElement | HTMLElement | null>,
) {
    const elTrigger = toRef(trigger)
    const elTarget = toRef(target)
    const getText = () => elTarget.value instanceof HTMLInputElement
        ? elTarget.value.value
        : elTarget.value?.textContent ?? ''

    useEventListener(trigger, 'click', async () => {
        try {
            // TODO: use useClipboard()
            await navigator.clipboard.writeText(getText())
            showTooltipMessage(elTrigger.value, '已复制')
        }
        catch (e) {
            showTooltipMessage(elTrigger.value, '复制失败')
            console.error(e)
        }
    })
}
