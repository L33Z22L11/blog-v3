export default defineNuxtPlugin(() => {
	// 开发环境禁用 Umami 统计
	if (import.meta.client && import.meta.dev) {
		localStorage.setItem('umami.disabled', 'true')
	}
})
