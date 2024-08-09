<script setup lang="ts">
import tippy from 'tippy.js'

const UIStore = useUIStore()
const asideTest = ref<HTMLElement>()

onMounted(() => {
    tippy(asideTest.value!, {
        content: '你知道得太多了。',
    })
})
</script>

<template>
    <aside id="z-aside" :class="{ show: UIStore.asideOpen }">
        <div class="container">
            <div class="widget">
                <h3 class="widget-title">
                    右侧栏
                </h3>
                <div ref="asideTest" class="card gradient-card">
                    <p>我是一个右侧栏，正如你所见，我是一个还没有开发好的右侧栏。</p>
                </div>
            </div>
        </div>
    </aside>
    <Transition>
        <div v-if="UIStore.asideOpen" id="z-aside-bgmask" @click="UIStore.toggleAside" />
    </Transition>
</template>

<style scoped lang="scss">
#z-aside {
    overflow: auto;

    .container {
        margin: 0.5rem;
    }

    &.v-enter-active,
    &.v-leave-active {
        transition: opacity 0.2s;
    }

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }

    @media (max-width: $breakpoint-widescreen) {
        position: fixed;
        top: 0;
        right: -100vw;
        width: 320px;
        min-width: auto;
        max-width: 100%;
        transition: right 0.2s;
        z-index: 2;

        .container {
            padding: 0.5rem;
            border-radius: 1rem;
            box-shadow: 0 0 48px -36px;
            background-color: var(--ld-blur-bg);
            backdrop-filter: blur(0.5rem);
        }

        &.show {
            right: 0;
        }
    }
}

#z-aside-bgmask {
    position: fixed;
    inset: 0;
    backdrop-filter: contrast(0.8) brightness(0.9);
    z-index: 1;

    &.v-enter-active,
    &.v-leave-active {
        transition: opacity 0.2s;
    }

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }

    @media (min-width: $breakpoint-widescreen) {
        display: none;
    }
}

.widget {
    margin: 0.5rem 0;

    & + & {
        margin-top: 1rem;
    }
}

.widget-title {
    margin: 0.5rem;
    font: inherit;
    color: var(--c-text-3);
}

.card {
    padding: 0.5rem;
}
</style>
