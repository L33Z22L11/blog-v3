import type { Toc } from '@nuxt/content'

export const useContentStore = defineStore('content', () => {
	const router = useRouter()
	const toc = ref<Toc>()
	const meta = ref()

	// 离开 /(.*)* 路由 ([...slug].vue) 时清除文章数据
	router.beforeEach((to, from) => {
		if (to.name !== from.name) {
			toc.value = undefined
			meta.value = undefined
		}
	})

	return {
		toc,
		meta,
	}
})
