<script setup lang="ts">
import { pascal } from 'radash'
import {
    LazyWidgetBlogLog,
    LazyWidgetConnectivity,
    LazyWidgetGithubCard,
    LazyWidgetToc,
} from '#components'

const UIStore = useUIStore()
const route = useRoute()

const widgetList = {
    LazyWidgetBlogLog,
    LazyWidgetConnectivity,
    LazyWidgetGithubCard,
    LazyWidgetToc,
}

const widgets = computed(() => (route.meta.aside || []).map(componentAlias =>
    `LazyWidget${pascal(componentAlias)}` as keyof typeof widgetList),
)
</script>

<template>
    <aside id="z-aside" :class="{ show: UIStore.asideOpen }">
        <Transition>
            <div v-if="UIStore.asideOpen" id="z-aside-bgmask" @click="UIStore.toggleAside" />
        </Transition>
        <div class="container">
            <div v-for="widget in widgets" :key="widget" class="widget">
                <!-- 更换页面时通过 key 更新这些组件，防止旧数据导致问题 -->
                <component :is="widgetList[widget]" :key="$route.path" />
            </div>
        </div>
    </aside>
</template>

<style scoped lang="scss">
#z-aside {
    overflow: auto;
    padding: 0.5rem;

    @media (max-width: $breakpoint-widescreen) {
        position: fixed;
        top: 0;
        right: -100%;
        width: 320px;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        transition: right 0.2s;
        z-index: 100;

        .container {
            padding: 0.5rem;
            border-radius: 1rem;
            box-shadow: 0 0 1rem var(--ld-shadow);
            background-color: var(--ld-bg-blur);
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
    background-color: #0003;

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
    font-size: 0.9em;

    & + .widget {
        margin-top: 1rem;
    }

    > .widget-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin: 0.5rem;
        font: inherit;
        color: var(--c-text-2);

        > .buttons {
            display: flex;
            gap: 0.5rem;

            > a {
                display: flex;
                align-items: center;
                transition: color 0.2s;
            }

            > [onclick]:hover, > [href]:hover {
                color: var(--c-primary);
            }
        }
    }

    > .widget-card {
        padding: 0.2rem 0.8rem;
        border-radius: 0.8rem;
        background-color: var(--c-bg-2);

        p, li {
            margin: 0.5em 0;
        }
    }
}
</style>
