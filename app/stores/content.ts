export const useContentStore = defineStore('content', () => {
	const toc = ref()
	const meta = ref()
	return {
		toc,
		meta,
	}
})
