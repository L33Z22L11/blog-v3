import {
    LazyWidgetBlogLog,
    LazyWidgetBlogStats,
    LazyWidgetConnectivity,
    LazyWidgetEmpty,
    LazyWidgetGithubCard,
    LazyWidgetToc,
} from '#components'
import { pascal } from 'radash'

const rawWidgets = {
    LazyWidgetBlogLog,
    LazyWidgetBlogStats,
    LazyWidgetConnectivity,
    LazyWidgetEmpty,
    LazyWidgetGithubCard,
    LazyWidgetToc,
}

type RawWidgetName = keyof typeof rawWidgets

type KecabCase<S extends string> = S extends `${infer First}${infer Rest}`
    ? `${First extends Capitalize<First> ? '-' : ''}${Lowercase<First>}${KecabCase<Rest>}`
    : ''

type TrimLeadingString<S extends string, Prefix extends string> = S extends `${Prefix}${infer Rest}` ? Rest : S

export type WidgetName = TrimLeadingString<KecabCase<RawWidgetName>, '-lazy-widget-'>

export default function useWidgets(widgetList: MaybeRefOrGetter<WidgetName[]>) {
    const widgets = computed(() => (toValue(widgetList) || []).map(widget => ({
        name: widget,
        comp: rawWidgets[`LazyWidget${pascal(widget)}` as RawWidgetName],
    })))
    return {
        widgets,
    }
}
