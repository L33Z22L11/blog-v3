import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import ClipboardJS from 'clipboard'

export function showTooltip(el: HTMLElement, message: string, timeout = 1000) {
    tippy(el, {
        content: message,
        trigger: 'manual',
        onShow(instance) {
            setTimeout(instance.hide, timeout)
        },
    }).show()
}

export function copy(elTrigger: HTMLElement, elTarget: HTMLInputElement | HTMLElement) {
    const text = elTarget instanceof HTMLInputElement
        ? elTarget.value
        : elTarget?.textContent ?? ''
    const clipboard = new ClipboardJS(elTrigger, { text })
    clipboard.on('success', () => showTooltip(elTrigger, '已复制'))
    clipboard.on('error', () => showTooltip(elTrigger, '复制失败'))
}
