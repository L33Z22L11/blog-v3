export default defineNuxtPlugin((nuxtApp) => {
	if (import.meta.server) {
		nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
			console.warn(`[Vue] ${msg}\n${trace}`.replaceAll('\n', '\n  '))
		}
	}
})
