<script setup lang="ts">
import MiniSearch from 'minisearch'

const props = defineProps<{
	show?: boolean
}>()

const layoutStore = useLayoutStore()
const appConfig = useAppConfig()
const segmenter = Intl.Segmenter && new Intl.Segmenter(appConfig.language, { granularity: 'word' })

// await useAsyncData() 会阻塞渲染
const { data, status } = await useLazyAsyncData(
	'search',
	() => queryCollectionSearchSections('content', {
		ignoredTags: ['pre'],
	}),
)

const miniSearch = new MiniSearch({
	fields: ['title', 'content'],
	storeFields: ['title', 'titles', 'content', 'level'],
	searchOptions: {
		prefix: true,
		fuzzy: 0.2,
		combineWith: 'AND',
		boost: { title: 3, titles: 2 },
	},
	processTerm: segmenter
		? term => Array.from(segmenter.segment(term)).map(seg => seg.segment.toLowerCase())
		: undefined,
})

const searchStore = useSearchStore()
const searchInput = ref<HTMLInputElement>()

const { word, debouncedWord } = storeToRefs(searchStore)
const result = computed(() => {
	void data.value
	return miniSearch.search(debouncedWord.value)
})

const isKeyboardMode = ref(false)
const listResult = useTemplateRef('list-result')

const activeIndex = ref(0)
const activeItem = computed(() => listResult.value?.children[activeIndex.value] as HTMLElement | undefined)

watch(() => props.show, focusInput)

watch(status, (newStatus) => {
	if (newStatus === 'success' && data.value) {
		miniSearch.addAll(data.value)
	}
})

watch(debouncedWord, () => {
	activeIndex.value = 0
})

useEventListener('mousemove', () => isKeyboardMode.value = false)
useEventListener('keydown', () => isKeyboardMode.value = true)

async function focusInput(allSelect = false) {
	await nextTick()
	searchInput.value?.focus()
	if (allSelect)
		searchInput.value?.select()
}

function updateActiveIndex(index: number, isKeyboard = false) {
	focusInput()
	if (index < 0 || index >= result.value?.length)
		return
	activeIndex.value = index
	if (isKeyboard)
		isKeyboardMode.value = true
	if (activeItem.value && isKeyboardMode.value) {
		activeItem.value.scrollIntoView({ block: 'nearest' })
	}
}

function openActiveItem() {
	// 触发 vue-router 点击事件
	activeItem.value?.click()
}
</script>

<template>
<BlogMask
	:show
	blur
	@click="layoutStore.toggle('search')"
/>

<Transition name="float-in">
	<div v-if="show" class="blog-search">
		<form class="input" @submit.prevent>
			<Icon :name="status === 'pending' ? 'line-md:loading-alt-loop' : 'ph:magnifying-glass-bold'" />

			<!-- 方向键切换搜索结果不应只在搜索框内触发 -->
			<input
				ref="searchInput"
				v-model="word"
				type="search"
				incremental
				class="search-input"
				placeholder="键入开始搜索"
				@keydown.up.prevent
				@keydown.down.prevent
			>
		</form>

		<TransitionGroup name="expand">
			<div v-if="debouncedWord && status === 'success' && !result.length" class="no-result">
				无结果
			</div>

			<menu
				v-if="result.length"
				ref="list-result"
				:key="result.length < 5 ? result.length : result[0]?.id"
				class="scrollcheck-y search-result"
			>
				<PopoverSearchItem
					v-for="(item, itemIndex) in result"
					:key="item.id"
					v-bind="item"
					:class="{ active: activeIndex === itemIndex }"
					@mousemove="updateActiveIndex(itemIndex)"
				/>
			</menu>

			<div v-if="result.length" class="tip" @click="searchInput?.focus()">
				<Key code="ArrowUp" prevent @press="updateActiveIndex(activeIndex - 1, true)" />
				<Key code="ArrowDown" prevent @press="updateActiveIndex(activeIndex + 1, true)" />
				切换&emsp;
				<Key code="Enter" icon @press="openActiveItem" />
				选择&emsp;
				<Key code="Escape" :icon="false" @press="layoutStore.toggle('search')" />
				关闭
			</div>
		</TransitionGroup>
	</div>
</Transition>
</template>

<style lang="scss" scoped>
.blog-search {
	--float-distance: 20vh;

	contain: paint;
	position: fixed;
	inset: 0;
	width: 90%;
	height: fit-content;
	max-width: $breakpoint-mobile;
	margin: auto;
	border: 1px solid var(--c-primary);
	border-radius: 1em;
	box-shadow: 0 0.5em 1em var(--ld-shadow);
	outline: 0.2em solid var(--c-primary-soft);
	background-color: var(--ld-bg-card);
	transition: all var(--delay);
	z-index: var(--z-index-popover);
}

.input {
	display: flex;
	align-items: center;
	gap: 1em;
	position: relative;
	padding: 0 1em;

	> .search-input {
		width: 100%;
		padding: 1em 0;
		outline: none;
	}
}

.no-result {
	// expand 时不要设置 padding
	max-height: 5em;
	line-height: 5em;
	text-align: center;
	color: var(--c-text-3);
	transition: all 0.5s;
}

.search-result {
	max-height: 75vh;
	max-height: 75dvh;
	transition: all 0.5s;
	scroll-padding: var(--fadeout-height);
}

.search-item {
	transition: background-color 0.1s, opacity 0.2s;
}

.tip {
	max-height: 1rem;
	margin: 0 1em 0.5rem;
	font-size: 0.8em;
	text-align: center;
	color: var(--c-text-3);
	transition: all 0.5s;
}

.expand-enter-active,
.expand-leave-active {
	transition: all 0.5s;
}

.expand-enter-from,
.expand-leave-to {
	opacity: 0;
	max-height: 0;
}
</style>
