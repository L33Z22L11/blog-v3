<script setup lang="ts">
import MiniSearch from 'minisearch'

const props = defineProps<{
	show?: boolean
}>()

// await 会阻塞渲染
const { data, status } = useAsyncData(
	'search',
	() => queryCollectionSearchSections('content', {
		ignoredTags: ['pre'],
	}),
)

// TODO: 优化中文分词逻辑
const miniSearch = new MiniSearch({
	fields: ['title', 'content'],
	storeFields: ['title', 'titles', 'content', 'level'],
	searchOptions: {
		prefix: true,
		fuzzy: 0.2,
	},
})

const searchStore = useSearchStore()
const searchInput = ref<HTMLInputElement>()

const { word } = storeToRefs(searchStore)
const result = computed(() => {
	void data.value
	return miniSearch.search(word.value)
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

watch(word, () => {
	activeIndex.value = 0
})

useEventListener('mousemove', () => isKeyboardMode.value = false)
useEventListener('keydown', () => isKeyboardMode.value = true)

async function focusInput() {
	await nextTick()
	searchInput.value?.focus()
}

function updateActiveIndex(index: number, isKeyboard = false) {
	focusInput()

	if (index < 0 || index >= result.value?.length)
		return
	activeIndex.value = index

	if (isKeyboard)
		isKeyboardMode.value = true

	if (activeItem.value && isKeyboardMode.value) {
		activeItem.value.scrollIntoView({
			block: 'nearest',
		})
	}
}

function openActiveItem() {
	// 触发 vue-router 点击事件
	activeItem.value?.click()
}
</script>

<template>
<div class="z-search">
	<Transition>
		<div
			v-if="show"
			id="z-search-bgmask"
			@click="searchStore.toggle()"
		/>
	</Transition>
	<Transition name="float-in">
		<div v-if="show" id="z-search">
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
				<div v-if="word && status === 'success' && !result?.length" class="no-result">
					无结果
				</div>

				<ol
					v-if="word && result?.length"
					ref="list-result"
					class="scrollcheck-y search-result"
				>
					<ZSearchItem
						v-for="(item, itemIndex) in result"
						:key="item.id"
						v-bind="item"
						:class="{ active: activeIndex === itemIndex }"
						@click="searchStore.toggle()"
						@mousemove="updateActiveIndex(itemIndex)"
					/>
				</ol>

				<div v-if="word && result?.length" class="tip" @click="searchInput?.focus()">
					<Key code="ArrowUp" prevent @press="updateActiveIndex(activeIndex - 1, true)" />
					<Key code="ArrowDown" prevent @press="updateActiveIndex(activeIndex + 1, true)" />
					切换&emsp;
					<Key code="Enter" icon @press="openActiveItem" />
					选择&emsp;
					<Key code="Escape" :icon="false" @press="searchStore.toggle()" />
					关闭
				</div>
			</TransitionGroup>
		</div>
	</Transition>
</div>
</template>

<style lang="scss" scoped>
.z-search {
	--float-distance: 20vh;

	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	inset: 0;
}

@keyframes scan {
	0% { left: -100%; }
	100% { left: 150%; }
}

#z-search {
	overflow: hidden;
	width: 95%;
	max-width: $breakpoint-mobile;
	border: 1px solid var(--c-primary);
	border-radius: 1em;
	box-shadow: 0 0.5em 1em var(--ld-shadow);
	background-color: var(--ld-bg-card);
	transition: all var(--delay, 200);
	z-index: 1000;
}

#z-search-bgmask {
	position: fixed;
	inset: 0;
	background-color: #0003;
	backdrop-filter: blur(0.2em);
	transition: backdrop-filter 1s;
	transition: opacity var(--delay, 200);
	z-index: 100;

	&.v-enter-from,
	&.v-leave-to {
		opacity: 0;
	}
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
	// 设置 max-height 时不要设置 padding
	max-height: 5em;
	padding: 1em 1em 2em;
	text-align: center;
	color: var(--c-text-3);
	transition: all 0.5s;
}

.search-result {
	max-height: 75vh;
	max-height: 75dvh;
	transition: all 0.5s;
	scroll-padding: 2rem;
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
