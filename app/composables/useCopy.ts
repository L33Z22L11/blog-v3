import ClipboardJS from 'clipboard'

export default function (
    elTrigger: Ref<HTMLElement | undefined>,
    elTarget: Ref<HTMLInputElement | HTMLElement | undefined>,
) {
    onMounted(() => {
        if (!elTrigger.value || !elTarget.value)
            return
        const text = () => elTarget.value instanceof HTMLInputElement
            ? elTarget.value.value
            : elTarget.value?.textContent ?? ''
        const clipboard = new ClipboardJS(elTrigger.value, { text })
        clipboard.on('success', () => useTooltipMessageMounted(elTrigger.value, '已复制'))
        clipboard.on('error', () => useTooltipMessageMounted(elTrigger.value, '复制失败'))
    })
}
