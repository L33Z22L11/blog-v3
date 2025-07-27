interface UsePaginationOptions {
	initialPage?: number
	perPage?: number
	bindQuery?: string | false
}

export default function usePagination<T>(list: MaybeRefOrGetter<T[]>, options?: UsePaginationOptions) {
	const appConfig = useAppConfig()
	const {
		initialPage = 1,
		perPage = appConfig.pagination.perPage || 10,
		bindQuery = false,
	} = options ?? {}

	const totalPages = computed(() => Math.ceil(toValue(list).length / perPage) || initialPage)

	function transformPage(val: string) {
		const page = Number(val)
		return page >= 1 && page <= totalPages.value ? page : initialPage
	}

	const page = bindQuery
		? useRouteQuery(bindQuery, initialPage.toString(), { transform: transformPage })
		: ref(initialPage)

	const listPaged = computed(() => {
		const start = (page.value - 1) * perPage
		return toValue(list).slice(start, start + perPage)
	})

	// 不应在此处 watch list

	return {
		totalPages,
		page,
		listPaged,
	}
}

/**
 * 生成分页数组
 *
 * 根据当前页码、扩展范围和总页数，生成一个用于显示的分页数组，包含起始页、结束页和省略符号位置。
 *
 * @param current 当前页码
 * @param total 总页数
 * @param expand 当前页码的扩展范围，默认值为1
 * @returns  返回一个包含可显示页码的数组。
 * 数组中的 `Number.NEGATIVE_INFINITY` 表示向前省略页码符号（...）的位置；
 * 数组中的 `Number.POSITIVE_INFINITY` 表示向后省略页码符号（...）的位置。
 *
 */
export function genPageArr(current: number, total: number, expand: number = 1) {
	const start = Math.max(2, Math.min(current - expand, total - 2 * expand))
	const end = Math.min(total, start + 2 * expand)
	const pageArr = Array.from({ length: end - start + 1 }, (_, i) => start + i)
	start > 2 && pageArr.unshift(Number.NEGATIVE_INFINITY)
	start > 1 && pageArr.unshift(1)
	end < total - 1 && pageArr.push(Number.POSITIVE_INFINITY)
	end < total && pageArr.push(total)
	return pageArr
}
