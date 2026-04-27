import type { MaybeComputedElementRef } from '@vueuse/core'

/**
 * 点击触发元素时，将文本复制到剪贴板，并在触发元素上显示提示信息。
 * @param target - 提供复制文本、目标元素或组件实例。可为字符串、输入框（复制其 `value`）或其他 HTMLElement（复制其文本内容）。
 */
export default function useCopy(
	target: MaybeComputedElementRef | string,
) {
	function getText() {
		if (typeof target === 'string')
			return target

		const el = unrefElement(target)
		if (el instanceof HTMLInputElement)
			return el.value
		return el?.textContent || ''
	}

	return useClipboard({ source: getText, legacy: true })
}
