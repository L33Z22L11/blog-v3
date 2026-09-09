import type { ShallowRef, Slots } from 'vue'

interface LayoutSlotsProvider {
	slots: ShallowRef<Slots | null>
	ready: Promise<void>
	getOwner?: (name: string) => number | undefined
}

const layoutSlotsKey = Symbol.for('dxup:layout-slots')

export function useLayoutSlotProvider() {
	return inject<LayoutSlotsProvider>(layoutSlotsKey)
}

/** dxup 在 setup 注册插槽；布局只发布已由 Nuxt 提交的页面插槽。 */
export function provideLayoutSlots() {
	const provider = useLayoutSlotProvider()
	const slots = shallowRef(provider?.slots.value ?? null)
	const route = useRoute()
	if (provider) {
		// 保留 dxup 的 use/ready，页面仍向原 provider 注册。
		provide<LayoutSlotsProvider>(layoutSlotsKey, {
			...provider,
			slots,
			// aside 跨页面复用同类型 widget；文章目录仍由文章路径的 key 区分。
			getOwner: name => name === 'aside' ? 0 : provider.getOwner?.(name),
		})
		provider.ready.then(() => {
			slots.value = provider.slots.value
		})
		watch(() => route.fullPath, () => {
			if (provider.slots.value)
				slots.value = provider.slots.value
		}, { flush: 'sync' })
	}
	return { slots }
}
