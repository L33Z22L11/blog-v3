import 'tippy.js/dist/tippy.css'

/**
 * 点击触发元素时，将文本复制到剪贴板，并在触发元素上显示提示信息。
 *
 * 文本可通过 `text` 参数提供，或从目标元素获取。若目标为输入框，则复制其 `value`；否则复制其文本内容。
 *
 * @param trigger - 触发复制操作的元素或组件实例，可为 HTMLElement 或带 `$el` 的组件。
 * @param target - 提供复制文本的目标元素或组件实例。可为输入框（复制其 `value`）或其他 HTMLElement（复制其文本内容）。
 * @param text - （可选）要复制的文本，若提供此参数，将优先复制此文本。
 *
 * @example
 * const btnCopy = useTemplateRef('copy-btn')
 * const targetInput = useTemplateRef('input-target')
 * useCopy(btnCopy, targetInput)
 *
 * @example
 * const btnCopy = useTemplateRef('copy-btn')
 * useCopy(btnCopy, btnCopy, '自定义文本')
 */
export default function (
    trigger: MaybeRefOrGetter<{ $el: Element } | Element | null>,
    target: MaybeRefOrGetter<{ $el: Element } | HTMLInputElement | Element | null>,
    text?: string,
) {
    const getEl = (element: any) => element?.$el ?? element

    onMounted(() => {
        // FIXME: 保留 trigger 和 target 的响应性
        const elTrigger = getEl(toValue(trigger))
        const elTarget = getEl(toValue(target))
        const getClipboardText = () => {
            if (text)
                return text
            if (elTarget instanceof HTMLInputElement)
                return elTarget.value
            return elTarget?.textContent || ''
        }

        useEventListener(elTrigger, 'click', async () => {
            try {
                await navigator.clipboard.writeText(getClipboardText())
                showTooltipMessage(elTrigger, '已复制')
            }
            catch (e) {
                showTooltipMessage(elTrigger, '复制失败')
                console.error(e)
            }
        })
    })
}
