import { tippy } from 'vue-tippy'

export function showTooltipMessage(
    el: Element | null,
    message: string,
    timeout = 1000,
) {
    if (!el)
        return
    tippy(el, {
        content: message,
        trigger: 'manual',
        onShow(instance) {
            setTimeout(instance.hide, timeout)
        },
    }).show()
}
