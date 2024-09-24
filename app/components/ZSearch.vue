<script setup lang="ts">
import type { SearchResult } from 'minisearch'

const UIStore = useUIStore()
const searchInput = ref<HTMLInputElement>()
// TODO: 随机展示热门搜索词
const word = ref('')
const result = ref([] as SearchResult[])

watch(() => UIStore.isSearchOpen, async (isOpen) => {
    await nextTick()
    isOpen && searchInput.value?.focus()
})

watchDebounced(word, async () => {
    // TODO: 搜索 description 字段
    result.value = (await searchContent(word)).value
})

useEventListener(window, 'keydown', (event) => {
    if (event.ctrlKey && event.key === 'k') {
        event.preventDefault()
        UIStore.toggleSearch()
    }
})
</script>

<template>
    <Transition>
        <div v-if="UIStore.isSearchOpen" id="z-search-bgmask" @click="UIStore.toggleSearch" />
    </Transition>
    <Transition>
        <div v-if="UIStore.isSearchOpen" id="z-search">
            <form @submit.prevent>
                <div class="input">
                    <Icon name="ph:magnifying-glass-bold" />
                    <input ref="searchInput" v-model="word" class="search-input" placeholder="键入开始搜索">
                </div>
                <ol v-if="word" class="scrollcheck-y search-result">
                    <li v-if="result.length === 0" class="no-result">
                        无结果
                    </li>
                    <ZSearchItem
                        v-for="item in result"
                        :key="item.id"
                        v-bind="item"
                        @click="UIStore.toggleSearch"
                    />
                </ol>
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
    z-index: 100;

    &.v-enter-active,
    &.v-leave-active {
        transition: top 0.2s;
    }

    &.v-enter-from,
    &.v-leave-to {
        top: 100%;
    }

    .input {
        display: flex;
        align-items: center;

        .iconify {
            margin: 0 0.5em 0 1em;
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
    backdrop-filter: blur(0.5em);
    z-index: 100;

    &.v-enter-active,
    &.v-leave-active {
        transition: opacity 0.2s;
    }

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }
}

.search-result {
    max-height: 80vh;
    max-height: 80dvh;
    padding: 0.5em;

    .no-result {
        padding: 1em;
        text-align: center;
        color: var(--c-text-3);
    }
}
</style>
