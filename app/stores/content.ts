export const useContentStore = defineStore('content', () => {
	// TODO: 将文章数据放在pinia，避免侧栏重复查询
	// 或是让侧栏组件更新时支持传入 props data
	const posts = ref()
	return {
		posts,
	}
})
