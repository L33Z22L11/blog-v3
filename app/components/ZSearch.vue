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
const listResult = useTemplateRef('list-result')

const { data: result, execute: execSearch, status } = await useAsyncData(
    word.value,
    () => searchContent(word.value),
    { immediate: false, transform: data => data.value },
)

watchDebounced(word, () => {
    activeIndex.value = 0
    word.value && execSearch()
}, { debounce: 300 })

useEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey)
        && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        UIStore.toggleSearch()
    }
})

watch(activeIndex, (newVal, oldVal) => {
    if (!result.value?.length)
        return
    if (newVal < 0 || newVal >= result.value?.length) {
        activeIndex.value = oldVal
    }
    (listResult.value?.children[activeIndex.value] as HTMLLIElement).scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
    })
})

function openActiveItem() {
    const item = listResult.value?.children[activeIndex.value] as HTMLLIElement
    item.dispatchEvent(new Event('click'))
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
            <form class="input" @submit.prevent>
                <Icon :class="{ searching: status === 'pending' }" name="ph:magnifying-glass-bold" />
                <input
                    ref="searchInput"
                    v-model="word"
                    class="search-input"
                    placeholder="键入开始搜索"
                >
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
                    <TransitionGroup name="expand">
                        <ZSearchItem
                            v-for="(item, itemIndex) in result"
                            :key="item.id"
                            v-bind="item"
                            :class="{ active: activeIndex === itemIndex }"
                            @click="UIStore.toggleSearch"
                            @mouseover="activeIndex = itemIndex"
                        />
                    </TransitionGroup>
                </ol>
                <div v-if="word && result?.length" class="tip" @click="searchInput?.focus()">
                    <ZKey code="ArrowUp" @press="activeIndex--">
                        ↑
                    </ZKey> <ZKey code="ArrowDown" @press="activeIndex++">
                        ↓
                    </ZKey> 切换&emsp;
                    <ZKey code="Enter" @press="openActiveItem">
                        Enter
                    </ZKey> 选择&emsp;
                    <ZKey code="Escape" @press="UIStore.toggleSearch">
                        Esc
                    </ZKey> 关闭
                </div>
            </TransitionGroup>
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
    padding: 1em 1em 2em;
    text-align: center;
    color: var(--c-text-3);
    transition: all 0.5s;
}

.search-result {
    max-height: 75vh;
    max-height: 75dvh;
    transition: all 0.5s;

    // FIXME: 滚动边距
    scroll-margin: 2rem;
}

.search-item {
    transition: all 0.5s, background-color 0.1s, opacity 0.2s;

    &.expand-enter-to,
    &.expand-leave-from {
        max-height: 10em;
    }
}

.tip {
    max-height: 1rem;
    margin: 0 1em 0.5rem;
    font-size: 0.8em;
    text-align: center;
    color: var(--c-text-3);
    transition: all 0.5s;
}

// 注意 CSS 优先级
.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
    margin-block: 0;
    padding-block: 0;
}
</style>
