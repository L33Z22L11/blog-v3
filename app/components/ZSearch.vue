<script setup lang="ts">
const UIStore = useUIStore()
const searchInput = ref<HTMLInputElement>()

watch(() => UIStore.isSearchOpen, async (isOpen) => {
    await nextTick()
    isOpen && searchInput.value?.focus()
})

// TODO: 随机展示热门搜索词
const word = ref('')
const activeIndex = ref(0)
const listResult = ref()

const { data: result, execute: execSearch, status } = await useAsyncData(
    word.value,
    () => searchContent(word.value),
    { immediate: false, transform: data => data.value },
)

watchDebounced(word, () => word.value && execSearch(), { debounce: 300 })
useEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey)
        && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        UIStore.toggleSearch()
    }
})

watch(activeIndex, () => {
    listResult.value?.children[activeIndex.value].scrollIntoView({ block: 'nearest' })
})

function handleKey(event: KeyboardEvent) {
    if (!result.value?.length)
        return
    if (event.key === 'Enter') {
        const item = listResult.value.children[activeIndex.value] as HTMLLIElement
        item.dispatchEvent(new Event('click'))
    }
    else if (event.key === 'ArrowDown') {
        event.preventDefault()
        activeIndex.value = Math.min(result.value?.length - 1, activeIndex.value + 1)
    }
    else if (event.key === 'ArrowUp') {
        event.preventDefault()
        activeIndex.value = Math.max(0, activeIndex.value - 1)
    }
    else {
        activeIndex.value = 0
    }
}
</script>

<template>
    <Transition>
        <div
            v-if="UIStore.isSearchOpen"
            id="z-search-bgmask"
            @click="UIStore.toggleSearch"
        />
    </Transition>
    <Transition>
        <div v-if="UIStore.isSearchOpen" id="z-search">
            <form @submit.prevent>
                <div class="input">
                    <Icon :class="{ searching: status === 'pending' }" name="ph:magnifying-glass-bold" />
                    <input
                        ref="searchInput"
                        v-model="word"
                        class="search-input"
                        placeholder="键入开始搜索"
                        @keydown="handleKey"
                    >
                    <Icon v-if="word" class="close" name="ph:x-bold" @click="word = ''" />
                </div>
                <TransitionGroup>
                    <div v-if="word && status === 'success' && !result?.length" class="no-result">
                        <div>无结果</div>
                    </div>
                    <ol
                        v-if="word && result?.length"
                        ref="listResult"
                        class="scrollcheck-y search-result"
                    >
                        <TransitionGroup>
                            <ZSearchItem
                                v-for="(item, index) in result"
                                :key="item.id"
                                v-bind="item"
                                :class="{ active: activeIndex === index }"
                                @click="UIStore.toggleSearch"
                                @mouseover="activeIndex = index"
                            />
                        </TransitionGroup>
                    </ol>
                    <div v-if="word && result?.length" class="tip">
                        <kbd>↑</kbd> <kbd>↓</kbd> 切换&emsp;
                        <kbd>Enter</kbd> 选择&emsp;
                        <kbd>Esc</kbd> 关闭
                    </div>
                </TransitionGroup>
            </form>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
@keyframes twinkle {
    from { opacity: 1; }
    to { opacity: 0.2; }
}

#z-search {
    position: fixed;
    top: 10vh;
    top: 10dvh;
    width: 95%;
    max-width: $breakpoint-mobile;
    border: 1px solid var(--c-primary);
    border-radius: 1em;
    box-shadow: 0 0.5em 1em var(--ld-shadow);
    background-color: var(--ld-bg-card);
    transition: all 0.2s;
    z-index: 100;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
        top: 20%;
    }
}

#z-search-bgmask {
    position: fixed;
    inset: 0;
    background-color: #0003;
    backdrop-filter: blur(0.2em);
    transition: backdrop-filter 1s;
    transition: opacity 0.2s;
    z-index: 100;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }
}

.input {
    display: flex;
    align-items: center;
    padding: 0 0.5em;

    .iconify {
        margin: 0 0.5em;

        &.searching {
            animation: twinkle 0.5s alternate infinite linear;
        }
    }

    input {
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
    text-align: center;
    color: var(--c-text-3);
    transition: all 0.5s;

    div { padding: 1em 1em 2em; }

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
        max-height: 0;
    }
}

.search-result {
    max-height: 75vh;
    max-height: 75dvh;
    transition: all 0.5s;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
        max-height: 0;
    }
}

.search-item {
    transition: all 0.5s, background-color 0.1s;
}

.tip {
    padding: 0.5em;
    font-size: 0.8em;
    text-align: center;
    color: var(--c-text-3);
}
</style>
