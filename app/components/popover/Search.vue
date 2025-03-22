<script setup lang="ts">
const props = defineProps<{
    isOpening?: boolean
}>()

// 应通过 layoutStore 传递关闭事件
const layoutStore = useLayoutStore()
const searchStore = useSearchStore()
const searchInput = ref<HTMLInputElement>()

watch(() => props.isOpening, async (isOpen) => {
    await nextTick()
    isOpen && searchInput.value?.select()
})

// TODO: 随机展示热门搜索词
const { word, result } = storeToRefs(searchStore)
const activeIndex = ref(0)
const listResult = useTemplateRef('list-result')

const { data, execute: execSearch, status } = useLazyAsyncData(
    word.value,
    () => searchContent(word.value),
    { immediate: false, transform: data => data.value },
)

watchDebounced(word, () => {
    activeIndex.value = 0
    word.value && execSearch()
}, { debounce: 300 })

watch(() => data.value, (newData) => {
    result.value = newData as any
})

watch(activeIndex, (newVal, oldVal) => {
    if (!result.value?.length)
        return
    if (newVal < 0 || newVal >= result.value?.length) {
        activeIndex.value = oldVal
    }
})

function scrollToActiveItem() {
    (listResult.value?.children[activeIndex.value] as Element).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
    })
}

function openActiveItem() {
    const item = listResult.value?.children[activeIndex.value] as Element
    // 触发 vue-router 点击事件
    item.dispatchEvent(new Event('click'))
}
</script>

<template>
    <div class="z-search">
        <Transition>
            <div
                v-if="isOpening"
                id="z-search-bgmask"
                @click="layoutStore.toggle('search')"
            />
        </Transition>
        <Transition name="float-in">
            <div v-if="isOpening" id="z-search">
                <form class="input" :class="{ searching: status === 'pending' }" @submit.prevent>
                    <Icon name="ph:magnifying-glass-bold" />
                    <input
                        ref="searchInput"
                        v-model="word"
                        class="search-input"
                        placeholder="键入开始搜索"
                        @keydown.up.prevent
                        @keydown.down.prevent
                    >
                    <!-- 方向键切换搜索结果不应只在搜索框内触发 -->
                    <Icon v-if="word" class="close" name="ph:x-bold" @click="word = ''" />
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
                            @click="layoutStore.toggle('search')"
                            @mouseover="activeIndex = itemIndex"
                        />
                    </ol>
                    <div v-if="word && result?.length" class="tip" @click="searchInput?.focus()">
                        <Key code="arrowup" @press="activeIndex--, scrollToActiveItem()">
                            ↑
                        </Key> <Key code="arrowdown" @press="activeIndex++, scrollToActiveItem()">
                            ↓
                        </Key> 切换&emsp;
                        <Key code="enter" @press="openActiveItem">
                            Enter
                        </Key> 选择&emsp;
                        <Key code="escape" @press="layoutStore.toggle('search')">
                            Esc
                        </Key> 关闭
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
    position: relative;
    padding: 0 0.5em;

    &::before {
        content: "";
        position: absolute;
        left: -100%;
        width: 100%;
        height: 100%;
        border-right: 1px solid var(--c-primary);
        background: linear-gradient(to right, transparent 50%, var(--c-primary-soft)) no-repeat;
        z-index: -1;
    }

    &.searching::before {
        animation: scan 1s infinite;
    }

    .iconify {
        margin: 0 0.5em;
    }

    .search-input {
        width: 100%;
        padding: 1em 0;
        outline: none;
    }

    .close {
        color: var(--c-text-3);
        transition: color 0.2s;
        cursor: pointer;

        &:hover {
            color: var(--c-text-2);
        }
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
