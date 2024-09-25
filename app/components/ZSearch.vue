<script setup lang="ts">
import type { SearchResult } from 'minisearch'

const UIStore = useUIStore()
const searchInput = ref<HTMLInputElement>()

watch(() => UIStore.isSearchOpen, async (isOpen) => {
    await nextTick()
    isOpen && searchInput.value?.focus()
})

// TODO: 随机展示热门搜索词
const word = ref('')
const result = ref<SearchResult[]>([])

const showSearching = ref(false)
const showNoResult = ref(false)

watchDebounced(word, async () => {
    showNoResult.value = false
    if (!word.value) {
        return
    }
    showSearching.value = true
    result.value = (await searchContent(word)).value
    showSearching.value = false
    if (result.value.length === 0 && word.value)
        showNoResult.value = true
}, { debounce: 300 })

useEventListener(window, 'keydown', (event) => {
    if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        UIStore.toggleSearch()
    }
})
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
        <div v-if="UIStore.isSearchOpen" id="z-search" :class="{ searching: showSearching }">
            <form @submit.prevent>
                <div class="input">
                    <Icon :class="{ searching: showSearching }" name="ph:magnifying-glass-bold" />
                    <input ref="searchInput" v-model="word" class="search-input" placeholder="键入开始搜索">
                    <Icon v-if="word" name="ph:x-bold" @click="word = ''" />
                </div>
                <Transition>
                    <div v-if="showNoResult" class="no-result">
                        <div>无结果</div>
                    </div>
                </Transition>
                <Transition>
                    <ol v-if="word && result.length" class="scrollcheck-y search-result">
                        <ZSearchItem
                            v-for="item in result"
                            :key="item.id"
                            v-bind="item"
                            @click="UIStore.toggleSearch"
                        />
                    </ol>
                </Transition>
            </form>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
#z-search {
    position: fixed;
    top: 10vh;
    top: 10dvh;
    width: 80%;
    max-width: $breakpoint-mobile;
    border: 1px solid var(--c-primary);
    border-radius: 0.5em;
    box-shadow: 0 0.5em 1em var(--ld-shadow);
    background-color: var(--ld-bg-card);
    transition: all 0.2s;
    z-index: 100;

    &.v-enter-from,
    &.v-leave-to {
        top: 100%;
    }

    .input {
        display: flex;
        align-items: center;
        padding: 0 0.5em;

        .iconify {
            margin: 0 0.5em;

            @keyframes twinkle {
                from { opacity: 1; }
                to { opacity: 0.2; }
            }

            &.searching {
                animation: twinkle 0.5s alternate infinite linear;
            }
        }

        input {
            width: 100%;
            padding: 1em 0;
            outline: none;
        }
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
    max-height: 80vh;
    max-height: 80dvh;
    transition: all 0.5s;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
        max-height: 0;
    }
}
</style>
