import { setDefaultOptions } from 'date-fns'
import { dateLocale } from '~~/blog.config'

export default defineNuxtPlugin(() => {
	// 设置 date-fns 默认 locale 为 zh-CN
	setDefaultOptions({ locale: dateLocale })

	// 开发环境禁用 Umami 统计
	if (import.meta.client && import.meta.dev) {
		localStorage.setItem('umami.disabled', 'true')
	}
})
