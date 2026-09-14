/** SSG 路由恢复可能先移除 hash；等水合与路由恢复后，再定位首次访问的锚点。 */
export default defineNuxtPlugin((nuxtApp) => {
	const initialUrl = new URL(window.location.href)
	const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
	if (!initialUrl.hash || navigation?.type === 'back_forward')
		return

	nuxtApp.hooks.hookOnce('app:suspense:resolve', async () => {
		await nextTick()
		requestAnimationFrame(() => {
			// 加载期间若已导航到别处，不再抢回滚动位置。
			if (window.location.href !== initialUrl.href)
				return
			const id = safelyDecodeUriComponent(initialUrl.hash.slice(1))
			document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
		})
	})
})
