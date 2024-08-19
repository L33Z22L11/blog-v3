import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export default function (
    el: Ref<HTMLElement | undefined>,
    message: string,
) {
    onMounted(() => {
        if (!el.value)
            return
        tippy(el.value, {
            content: message,
        })
    })
}

export function useTooltipMessageMounted(
    el: HTMLElement | undefined,
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
