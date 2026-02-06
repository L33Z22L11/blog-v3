<script setup lang="ts">
import { group } from 'radash'

const appConfig = useAppConfig()
useSeoMeta({
	title: '归档',
	description: `${appConfig.title}的所有文章归档。`,
})
const birthYear = computed(() => appConfig.component.stats.birthYear)
const showTuning = ref(false)
const spacing = ref(0)
const column = ref(1)

const layoutStore = useLayoutStore()
const { panelTranslate } = storeToRefs(layoutStore)
layoutStore.setAside(['blog-stats', 'blog-log'])

const { data: listRaw } = await useAsyncData('index_posts', () => useArticleIndexOptions(), { default: () => [] })
const { listSorted, isAscending, sortOrder } = useArticleSort(listRaw)
const { category, categories, listCategorized } = useCategory(listSorted)

const listGrouped = computed(() => {
	const groupList = Object.entries(group(
		listCategorized.value,
		article => article[sortOrder.value] ? toZonedTemporal(article[sortOrder.value] as string).year.toString() : '',
	))
	return isAscending.value ? groupList : groupList.reverse()
})

// 不能使用 /api/stats，因为可能切换分组方式
const yearlyWordCount = computed(() => {
	return listGrouped.value.reduce<Record<string, string>>((acc, [year, yearGroup]) => {
		const totalWords = yearGroup?.reduce((sum, cur) => sum + cur.readingTime!.words, 0) || 0
		acc[year] = formatNumber(totalWords)
		return acc
	}, {})
})

watchImmediate(showTuning, (newVal) => {
	panelTranslate.value.archiveTuning = newVal ? '0, -3em' : undefined
})

onUnmounted(() => {
	panelTranslate.value.archiveTuning = undefined
})
</script>

<template>
<div class="archive proper-height">
	<PostOrderToggle
		v-model:is-ascending="isAscending"
		v-model:sort-order="sortOrder"
		v-model:category="category"
		:categories
	>
		<template #secret>
			<ZToggle
				v-model="showTuning"
				label="密度调节"
			/>
		</template>
	</PostOrderToggle>

	<section
		v-for="[year, yearGroup] in listGrouped"
		:key="year"
		class="archive-group"
		:class="{ 'hide-info': column > 1 }"
		:style="{
			'--archive-item-gap': `${spacing}em`,
			'--archive-item-column': column,
		}"
	>
		<div class="archive-title">
			<h2 class="archive-year">
				{{ year }}
			</h2>

			<div class="archive-age">
				<span>{{ Number(year) - birthYear }}</span>
				<span class="age-label">岁</span>
			</div>

			<div class="archive-info">
				<span>{{ yearlyWordCount[year] }}字</span>
				<span>{{ yearGroup?.length }}篇</span>
			</div>
		</div>

		<TransitionGroup tag="menu" class="archive-list" name="float-in">
			<PostArchive
				v-for="article, index in yearGroup"
				:key="article.path"
				v-bind="article"
				:to="article.path"
				:use-updated="sortOrder === 'updated'"
				:style="getFixedDelay(index * 0.03)"
			/>
		</TransitionGroup>
	</section>

	<div v-if="showTuning" class="archive-tuning card">
		<ZSlider
			v-model="spacing"
			label="间距"
			:spring-min="-0.4"
			:spring-max="0.1"
			:list="['-0.3', '0']"
			min="-1"
			max=".2"
			step=".1"
		/>

		<ZSlider
			v-model="column"
			label="列数"
			min="1"
			max="8"
		/>
	</div>
</div>
</template>

<style lang="scss" scoped>
.archive {
	padding: 1rem; // 防止内部 outline 被 mask
	mask-image: linear-gradient(#FFF 50%, #FFF7);
}

.archive-group {
	margin: 1rem 0 3rem;

	> .archive-list {
		display: grid;
		grid-template-columns: repeat(var(--archive-item-column), 1fr);
		column-gap: calc((5 - var(--archive-item-column)) * 0.2em);
	}

	&.hide-info :deep(.dim-hover) {
		display: none;
	}
}

.archive-tuning {
	position: sticky;
	bottom: min(2em, 5%);

	> .z-slider {
		margin: 0.5em 0.8em;
	}
}

.archive-title {
	display: flex;
	justify-content: space-between;
	gap: 1em;
	position: sticky;
	opacity: 0.5;
	top: 0;
	font-size: min(1.5em, 5vw);
	color: transparent;
	transition: color 0.2s;

	&::selection, :hover > & {
		color: var(--c-text-3);
	}

	:hover > & .archive-age {
		opacity: 0;
	}

	> .archive-year, .archive-age {
		margin-bottom: -0.3em;
		mask-image: linear-gradient(#FFF 50%, transparent);
		font-family: var(--font-stroke-free);
		font-size: 3em;
		font-variant-numeric: tabular-nums;
		font-weight: 800;
		line-height: 1;
		z-index: -1;
		-webkit-text-stroke: 1px var(--c-text-3);
	}

	> .archive-age {
		position: absolute;
		inset-inline-end: 0;
		transition: opacity 0.2s;

		> .age-label {
			font-size: 0.5em;
			vertical-align: super;
		}
	}

	> .archive-info {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		column-gap: 0.5em;
	}
}
</style>
