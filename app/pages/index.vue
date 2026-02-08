<script setup lang="ts">
import { sort } from 'radash'

const appConfig = useAppConfig()
useSeoMeta({
	description: appConfig.description,
	ogImage: appConfig.author.avatar,
})

const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-stats', 'blog-tech', 'comm-group'])

const { data: listRaw } = await useAsyncData('index_posts', () => useArticleIndexOptions(), { default: () => [] })
const { listSorted, isAscending, sortOrder } = useArticleSort(listRaw, { bindDirectionQuery: 'asc', bindOrderQuery: 'sort' })
const { category, categories, listCategorized } = useCategory(listSorted, { bindQuery: 'category' })
const { page, totalPages, listPaged } = usePagination(listCategorized, { bindQuery: 'page' })

watch(category, () => {
	page.value = 1
})

useSeoMeta({ title: () => (page.value > 1 ? `第${page.value}页` : '') })

const listRecommended = computed(() => sort(
	listRaw.value.filter(item => item?.recommend),
	post => post.recommend || 0,
	true,
))
</script>

<template>
<BlogHeader class="mobile-only" to="/" tag="h1" />

<UtilHydrateSafe>
	<PostSlide v-if="listRecommended.length && page === 1 && !category" :list="listRecommended" />

	<div class="post-list">
		<PostOrderToggle
			v-model:is-ascending="isAscending"
			v-model:sort-order="sortOrder"
			v-model:category="category"
			:categories
		>
			<template #secret>
				<UtilLink to="/preview" class="preview-entrance">
					<Icon name="ph:file-lock-bold" />
					查看预览文章
				</UtilLink>
			</template>
		</PostOrderToggle>

		<TransitionGroup tag="menu" class="proper-height" name="float-in">
			<PostArticle
				v-for="article, index in listPaged"
				:key="article.path"
				v-bind="article"
				:to="article.path"
				:use-updated="sortOrder === 'updated'"
				:style="getFixedDelay(index * 0.05)"
			/>
		</TransitionGroup>

		<ZPagination v-model="page" sticky :total-pages="totalPages" />
	</div>
</UtilHydrateSafe>
</template>

<style lang="scss" scoped>
.post-list {
	margin: 1rem;
}

.float-in-leave-to {
	position: absolute;
}
</style>
