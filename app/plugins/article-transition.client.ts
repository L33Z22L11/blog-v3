import { once } from 'es-toolkit/function'

/** 卡片与文章页头使用共享快照；栏目切换保留布局和 widget 的原生动画。 */
export default defineNuxtPlugin((nuxtApp) => {
	if (!document.startViewTransition)
		return

	const router = useRouter()
	const reducedMotion = usePreferredReducedMotion()
	const { emit } = useEventBus<'capture' | 'finish'>('page-transition')
	const root = document.documentElement
	const positions = new Map<number, { left: number, top: number }>()
	let position = window.history.state?.position as number
	let uaTransition = false
	let active: { to: string, cancel: () => void } | undefined

	useEventListener(window, 'popstate', (event) => {
		uaTransition = event.hasUAVisualTransition
	})

	function isVisible(element: HTMLElement) {
		const rect = element.getBoundingClientRect()
		return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight
			&& rect.right > 0 && rect.left < window.innerWidth && getComputedStyle(element).visibility !== 'hidden'
	}

	function findShared(path: string) {
		return Array.from(document.querySelectorAll<HTMLElement>('[data-transition-key]'))
			.find(element => normalizeContentPath(element.dataset.transitionKey!) === normalizeContentPath(path) && isVisible(element))
	}

	function markHero(element: HTMLElement | undefined, side: 'from' | 'to') {
		if (!element)
			return
		element.dataset.articleSource = ''
		const style = getComputedStyle(element)
		root.style.setProperty(`--article-radius-${side}`, `${style.borderTopLeftRadius} ${style.borderTopRightRadius} ${style.borderBottomRightRadius} ${style.borderBottomLeftRadius}`)
	}

	const unhookBefore = router.beforeEach(() => active?.cancel())
	const unhookResolve = router.beforeResolve((to, from) => {
		const nextPosition = window.history.state?.position as number
		positions.set(position, { left: window.scrollX, top: window.scrollY })
		const scroll = nextPosition !== position ? positions.get(nextPosition) : undefined
		const hasOverlay = Array.from(document.querySelectorAll<HTMLElement>('.bg-mask, .bikariya-overlay, dialog[open]')).some(isVisible)
		if (nuxtApp.isHydrating || uaTransition || hasOverlay || !to.matched.length
			|| reducedMotion.value === 'reduce'
			|| normalizeContentPath(to.path) === normalizeContentPath(from.path)) {
			return
		}

		const source = !to.hash && !from.hash ? findShared(to.path) ?? findShared(from.path) : undefined
		if (!source)
			return
		const scrollToTop = typeof to.meta.scrollToTop === 'function' ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop
		let resume!: () => void
		let finish!: () => void
		let transition: ViewTransition | undefined
		const navigationReady = new Promise<void>((resolve) => {
			resume = resolve
		})
		const pageReady = new Promise<void>((resolve) => {
			finish = resolve
		})
		const unhookPage = nuxtApp.hook('page:loading:end', () => {
			if (router.currentRoute.value.fullPath === to.fullPath)
				finish()
		})
		const state = { to: to.fullPath, cancel }
		// 慢网络或页面加载失败时释放快照，让路由继续正常加载。
		const { stop: stopTimeout } = useTimeoutFn(cancel, 1500)

		const cleanup = once(() => {
			stopTimeout()
			unhookPage()
			if (active !== state)
				return
			// 快照结束后不重复播放元素自身的入场动画。
			document.querySelectorAll<HTMLElement>('[data-transition-enter]')
				.forEach(element => element.dataset.nativeEntered = '')
			document.querySelectorAll<HTMLElement>('[data-article-source]').forEach(element => delete element.dataset.articleSource)
			emit('finish')
			delete root.dataset.articleTransition
			root.style.removeProperty('--article-radius-from')
			root.style.removeProperty('--article-radius-to')
			active = undefined
		})

		function cancel() {
			transition?.skipTransition()
			resume()
			finish()
			cleanup()
		}

		active = state
		root.dataset.articleTransition = 'old'
		markHero(source, 'from')
		try {
			emit('capture')
			transition = document.startViewTransition(async () => {
				resume()
				await pageReady
				await nextTick()
				if (active !== state)
					return
				stopTimeout()
				unhookPage()
				delete source.dataset.articleSource
				root.dataset.articleTransition = 'new'
				// 快照捕获期间暂停 rAF，先完成定位；Nuxt 随后恢复相同的滚动位置。
				if (scrollToTop !== false) {
					if (scroll)
						window.scrollTo({ ...scroll, behavior: 'instant' })
					else if (to.hash)
						document.getElementById(safelyDecodeUriComponent(to.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' })
					else
						window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
				}
				markHero(findShared(to.path) ?? findShared(from.path), 'to')
				emit('capture')
				await nextTick()
			})
			transition.ready.catch(cancel)
			transition.finished.catch(() => {}).finally(cleanup)
		}
		catch {
			cancel()
		}
		return navigationReady
	})
	const unhookAfter = router.afterEach((to, _from, failure) => {
		if (failure && active?.to === to.fullPath)
			active.cancel()
		position = window.history.state?.position as number
		uaTransition = false
	})
	const unhookError = router.onError(() => active?.cancel())
	const unhookAppError = nuxtApp.hook('app:error', () => active?.cancel())

	nuxtApp.vueApp.onUnmount(() => {
		active?.cancel()
		unhookBefore()
		unhookResolve()
		unhookAfter()
		unhookError()
		unhookAppError()
	})
})
