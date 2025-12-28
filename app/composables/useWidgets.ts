import {
	ContentRenderer,
	LazyBlogWidget,
	LazyWidgetBlogLog,
	LazyWidgetBlogStats,
	LazyWidgetBlogTech,
	LazyWidgetCommGroup,
	LazyWidgetEmpty,
	LazyWidgetToc,
} from '#components'
import { pascal } from 'radash'

// @keep-sorted
const rawWidgets = {
	LazyWidgetBlogLog,
	LazyWidgetBlogStats,
	LazyWidgetBlogTech,
	LazyWidgetCommGroup,
	LazyWidgetEmpty,
	LazyWidgetToc,
}

type RawWidgetName = keyof typeof rawWidgets

/** 若首字母大写还需移除`-`前缀 */
type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
	? `${First extends Capitalize<First> ? '-' : ''}${Lowercase<First>}${KebabCase<Rest>}`
	: ''

type RemovePrefix<S extends string, Prefix extends string> = S extends `${Prefix}${infer Rest}` ? Rest : S

export type WidgetName = RemovePrefix<KebabCase<RawWidgetName>, '-lazy-widget-'> | `meta-aside-${string}`

export default function useWidgets(widgetList: MaybeRefOrGetter<WidgetName[]>) {
	const store = useContentStore()

	function renderMetaSlots(widgetName: WidgetName) {
		const slotsTree = store.meta.slots[widgetName.slice('meta-'.length)]
		return h(
			LazyBlogWidget,
			{ card: !slotsTree, ...slotsTree?.props },
			() => slotsTree
				? h(ContentRenderer, { value: slotsTree })
				: `${widgetName} 不存在`,
		)
	}

	const widgets = computed(() => toValue(widgetList).map(widgetName => ({
		name: widgetName,
		comp: widgetName.startsWith('meta-aside-')
			? renderMetaSlots(widgetName)
			: rawWidgets[`LazyWidget${pascal(widgetName)}` as RawWidgetName],
	})))

	return {
		widgets,
	}
}
