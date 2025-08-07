<script setup lang="ts">
const appConfig = useAppConfig()
useSeoMeta({
	title: '预览',
	description: `${appConfig.title}的文章预览。`,
})
const layoutStore = useLayoutStore()
layoutStore.setAside(['blog-log'])

const { data: listRaw } = useArticleIndex('previews/%')
const { listSorted, isAscending, sortOrder } = useArticleSort(listRaw)
const { category, categories, listCategorized } = useCategory(listSorted)
</script>

<template>
<div class="preview">
	<div class="preview-header">
		<h1>
			<ZRawLink class="mobile-only" to="/">
				<Icon name="ph:caret-left-bold" />
			</ZRawLink>暂存
		</h1>
		<ZOrderToggle
			v-model:is-ascending="isAscending"
			v-model:sort-order="sortOrder"
			v-model:category="category"
			:categories
		/>
	</div>
	<p>这里是一些因为不太满意因而还未发布的文章笔记。</p>

	<menu>
		<ZArticle
			v-for="article in listCategorized"
			:key="article.path"
			v-bind="article"
			:to="article.path"
			:use-updated="sortOrder === 'updated'"
		/>
	</menu>
</div>
</template>

<style lang="scss" scoped>
.preview {
	margin: 1rem;
}

.preview-header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	h1 {
		mask: linear-gradient(#FFF, transparent);
	}
}
</style>
