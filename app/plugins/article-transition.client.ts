/** 文章入口及历史导航使用快照过渡；实际正文不位移。 */
export default defineNuxtPlugin((nuxtApp) => {
	if (!document.startViewTransition)
		return

	const router = useRouter()
	const root = document.documentElement
	// WebKit 的新命名元素快照会空白，整页快照仍正常；保留淡入降级。
	const pageSnapshot = navigator.vendor.startsWith('Apple')
	let active: { to: string, cancel: (superseded?: boolean) => void } | undefined

	interface Scroll { left: number, top: number }
	interface Entry { from: string, to: string, index: number, href: string, scroll: Scroll }
	const entries = new Map<number, Entry>()
	const positions = new Map<number, Scroll>()
	let position = window.history.state?.position as number
	let uaTransition = false
	useEventListener(window, 'popstate', (event) => {
		uaTransition = event.hasUAVisualTransition
	})
	const scrollPosition = (): Scroll => ({ left: window.scrollX, top: window.scrollY })
	const radius = (element: HTMLElement) => {
		const style = getComputedStyle(element)
		return `${style.borderTopLeftRadius} ${style.borderTopRightRadius} ${style.borderBottomRightRadius} ${style.borderBottomLeftRadius}`
	}
	const hasOverlay = () => Array.from(document.querySelectorAll<HTMLElement>('.bg-mask, .bikariya-overlay, dialog[open]'))
		.some(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden')
	const links = () => Array.from(document.querySelectorAll<HTMLElement>('a[data-article-link]'))

	function navigate(anchor: HTMLElement | null, to: string, hero: boolean, options?: {
		commit: () => void
		scroll?: Scroll
		target?: () => HTMLElement | null
	}) {
		active?.cancel(true)
		hero &&= !pageSnapshot
		let superseded = false
		let transition: ViewTransition | undefined
		let settle = () => {}
		const state = {
			to,
			cancel: (byNavigation = false) => {
				superseded ||= byNavigation
				transition?.skipTransition()
				settle()
				options?.commit()
				cleanup()
			},
		}
		const commit = options?.commit ?? (() => {
			void router.push(to).then((failure) => {
				if (failure)
					state.cancel()
			}).catch(() => state.cancel())
		})

		function cleanup() {
			if (active !== state)
				return
			if (anchor)
				delete anchor.dataset.articleSource
			// 取消或结束快照后也不重新播放当前节点的 CSS 入场动画。
			document.querySelectorAll<HTMLElement>('.article-card, .article-item, .feed-card, .article, .post-header, #blog-aside > .blog-widget')
				.forEach(element => element.dataset.nativeEntered = '')
			delete root.dataset.articleTransition
			delete root.dataset.pageSnapshot
			document.querySelectorAll<HTMLElement>('[data-article-source]').forEach(element => delete element.dataset.articleSource)
			delete root.dataset.articleHero
			root.style.removeProperty('--article-radius-from')
			root.style.removeProperty('--article-radius-to')
			active = undefined
		}

		active = state
		root.dataset.articleTransition = 'old'
		if (pageSnapshot)
			root.dataset.pageSnapshot = ''
		if (hero) {
			if (!options?.target)
				root.dataset.articleHero = ''
			if (anchor) {
				anchor.dataset.articleSource = ''
				root.style.setProperty('--article-radius-from', radius(anchor))
			}
		}

		try {
			transition = document.startViewTransition(async () => {
				if (active !== state) {
					if (!superseded)
						commit()
					return
				}
				if (anchor)
					delete anchor.dataset.articleSource
				root.dataset.articleTransition = 'new'
				await new Promise<void>((resolve) => {
					const unhook = nuxtApp.hook('page:loading:end', () => settle())
					// 慢网络恢复普通加载，避免一直冻结在旧画面；导航本身继续。
					const timer = window.setTimeout(() => state.cancel(), 1500)
					settle = () => {
						window.clearTimeout(timer)
						unhook()
						resolve()
					}
					commit()
				})
				await nextTick()
				if (active !== state)
					return
				// 快照更新期间浏览器暂停 rAF，不能等路由的下一帧滚动。
				// 在捕获前完成同样的定位，随后路由再定位也不会改变坐标。
				const route = router.currentRoute.value
				if (route.fullPath === to) {
					if (options?.scroll)
						window.scrollTo({ ...options.scroll, behavior: 'instant' })
					else if (route.hash)
						document.getElementById(safelyDecodeUriComponent(route.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' })
					else if (route.meta.scrollToTop !== false)
						window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
				}
				const target = options?.target ? options.target() : document.querySelector<HTMLElement>('.post-header')
				if (hero && target) {
					if (options?.target)
						target.dataset.articleSource = ''
					root.style.setProperty('--article-radius-to', radius(target))
				}
			})
			transition.ready.catch(() => state.cancel())
			transition.finished.catch(() => {}).finally(cleanup)
		}
		catch {
			cleanup()
			commit()
		}
	}

	useEventListener(document, 'click', (event) => {
		if (nuxtApp.isHydrating || hasOverlay() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
			|| window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return
		}
		const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-article-link]') : null
		if (!anchor || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download'))
			return
		const url = new URL(anchor.href)
		if (url.origin !== window.location.origin || normalizeContentPath(url.pathname) === normalizeContentPath(router.currentRoute.value.path))
			return
		const to = router.resolve(url.pathname + url.search + url.hash)
		if (!to.matched.length)
			return
		event.preventDefault()
		// 按 history entry 区分同一路径的不同页码、滚动位置和重复入口。
		entries.set(position + 1, { from: router.currentRoute.value.fullPath, to: to.fullPath, index: links().indexOf(anchor), href: anchor.getAttribute('href') ?? '', scroll: scrollPosition() })
		navigate(anchor, to.fullPath, !url.hash)
	}, { capture: true })

	const unhookRouter = router.beforeEach((to) => {
		if (active && active.to !== to.fullPath)
			active.cancel(true)
	})
	const unhookResolve = router.beforeResolve((to, from) => {
		const nextPosition = window.history.state?.position as number
		positions.set(position, scrollPosition())
		if (active || nextPosition === position || nuxtApp.isHydrating || uaTransition || hasOverlay()
			|| window.matchMedia('(prefers-reduced-motion: reduce)').matches
			|| normalizeContentPath(to.path) === normalizeContentPath(from.path)) {
			return
		}
		const back = nextPosition < position
		const entry = entries.get(back ? position : nextPosition)
		const matched = entry && (back
			? entry.from === to.fullPath && entry.to === from.fullPath
			: entry.from === from.fullPath && entry.to === to.fullPath)
		const findCard = () => {
			const card = matched ? links()[entry.index] : null
			return card?.getAttribute('href') === entry?.href ? card ?? null : null
		}
		const source = matched ? (back ? document.querySelector<HTMLElement>('.post-header') : findCard()) : null
		return new Promise<void>((resolve) => {
			navigate(source ?? null, to.fullPath, !!source && !to.hash && !from.hash, {
				commit: resolve,
				scroll: positions.get(nextPosition) ?? (matched && back ? entry.scroll : undefined),
				target: back ? findCard : undefined,
			})
		})
	})
	const unhookAfter = router.afterEach((_to, _from, failure) => {
		if (failure)
			active?.cancel()
		else
			position = window.history.state?.position as number
		uaTransition = false
	})
	const unhookError = router.onError(() => active?.cancel())
	const unhookAppError = nuxtApp.hook('app:error', () => active?.cancel())
	nuxtApp.vueApp.onUnmount(() => {
		active?.cancel(true)
		unhookRouter()
		unhookResolve()
		unhookAfter()
		unhookError()
		unhookAppError()
	})
})
