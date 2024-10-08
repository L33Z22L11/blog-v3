import { tippy } from 'vue-tippy'
import 'tippy.js/dist/tippy.css'
// import 'tippy.js/themes/light.css'

export function showTooltipMessage(
    el: Element | null,
    message: string,
    timeout = 1000,
) {
    if (!el)
        return
    tippy(el, {
        // TODO: use useColorMode() to get theme
        content: message,
        trigger: 'manual',
        onShow(instance) {
            setTimeout(instance.hide, timeout)
        },
    }).show()
}
