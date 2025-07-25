<script setup lang="ts">
import { sort } from 'radash'

const appConfig = useAppConfig()
useSeoMeta({
	description: appConfig.description,
	ogImage: appConfig.author.avatar,
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'connectivity'])

const { data: listRaw } = await usePostsIndex()
const { listSorted, isAscending, sortOrder } = useArticleSort(listRaw)
const { category, categories, listCategorized } = useCategory(listSorted, { bindQuery: 'category' })
const { page, totalPages, listPaged } = usePagination(listCategorized, { bindParam: 'id' })

watch(category, () => {
	page.value = 1
})

useSeoMeta({ title: () => (page.value > 1 ? `第${page.value}页` : '') })

const listRecommended = computed(() => sort(
	listRaw.value.filter(item => item?.recommend),
	post => post.recommend || 0,
	true,
))

const displayWarning = ref(false)
function hideWarning() {
	displayWarning.value = false
	localStorage?.setItem('hide_20250725', 'true')
}
onMounted(() => {
	displayWarning.value = localStorage.getItem('hide_20250725') !== 'true'
})
</script>

<template>
<div class="mobile-only">
	<!-- 若不包裹，display: none 在 JS 加载后才有足够优先级 -->
	<ZhiluHeader to="/" />
</div>

<!-- TODO 谨慎升级 预计2025-10-25下线 -->
<Alert v-if="displayWarning" type="warning" style="margin: 1em;">
	<template #title>
		<span style="flex-grow: 1;">主题用户谨慎合并上游</span>
		<Icon name="ph:x-bold" style="cursor: pointer;" @click="hideWarning" />
	</template>
	<p style="margin: 0.5em 0;">
		已升级 Nuxt 4 / Nuxt Content 3，具有大量破坏性更改且功能实现尚不完善，建议非必要不合并上游。
		<!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
		<ProseA href="https://github.com/L33Z22L11/blog-v3/pull/20" target="_blank">PR</ProseA>
	</p>
</Alert>

<PostSlide v-if="listRecommended.length && page === 1 && !category" :list="listRecommended" />

<div class="post-list">
	<div class="toolbar">
		<div>
			<!-- 外层元素用于占位 -->
			<ZRawLink to="/preview" class="preview-entrance">
				<Icon name="ph:file-lock-bold" />
				查看预览文章
			</ZRawLink>
		</div>

		<ZOrderToggle
			v-model:is-ascending="isAscending"
			v-model:sort-order="sortOrder"
			v-model:category="category"
			:categories
		/>
	</div>

	<NuxtPage :list="listPaged" :sort-order />

	<ZPagination v-model="page" :total-pages />
</div>
</template>

<style lang="scss" scoped>
.toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.preview-entrance {
	position: relative;
	opacity: 0;
	transition: all 0.2s 1s, color 0.2s;
	z-index: -1;

	:hover > & {
		opacity: 1;
		color: var(--c-primary);
		z-index: 0;
	}
}

.post-list {
	margin: 1rem;
}
</style>
