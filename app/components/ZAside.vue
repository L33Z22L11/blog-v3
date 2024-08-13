<script setup lang="ts">
import { LazyWidgetBlogLog, LazyWidgetTOC } from '#components'

const UIStore = useUIStore()
const route = useRoute()

const widgetList = {
    blog_log: LazyWidgetBlogLog,
    toc: LazyWidgetTOC,
}

const widgets = computed(() => (route.meta.aside || []) as Array<keyof typeof widgetList>)
</script>

<template>
    <aside id="z-aside" :class="{ show: UIStore.asideOpen }">
        <div class="container">
            <div v-for="widget in widgets" :key="widget" class="widget">
                <component :is="widgetList[widget]" />
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
        // BFC
        overflow: auto;
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
        height: auto;
        max-width: 100%;
        max-height: 100vh;
        max-height: 100dvh;
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

:deep(.widget) {
    margin: 0.5rem 0;

    & + & {
        margin-top: 1rem;
    }

    > .widget-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin: 0.5rem;
        font: inherit;
        color: var(--c-text-3);

        > .buttons {
            display: flex;
            gap: 0.5rem;
            font-size: 1.2em;

            > a {
                display: flex;
                align-items: center;
                transition: 0.2s;
            }

            > [onclick]:hover, > [href]:hover {
                color: var(--c-primary-1);
                cursor: pointer;
            }
        }
    }

    > .widget-card {
        padding: 0.5rem;
    }
}
</style>
