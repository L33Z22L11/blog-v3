<script setup lang="ts">
const layoutStore = useLayoutStore()

const { widgets } = useWidgets(() => layoutStore.asideWidgets)
</script>

<template>
    <Transition>
        <div v-if="layoutStore.isOpen('aside')" id="z-aside-bgmask" @click="layoutStore.toggle('aside')" />
    </Transition>
    <!-- 此处不能使用 Transition，因为宽屏状态始终显示 -->
    <!-- 如果为空数组则隐藏 -->
    <Transition>
        <aside v-if="layoutStore.asideWidgets?.length" id="z-aside" class="scrollcheck-y" :class="{ show: layoutStore.isOpen('aside') }">
            <div class="container">
                <TransitionGroup name="float-in">
                    <div v-for="widget in widgets" :key="widget.name" class="widget">
                        <!-- 更换页面时通过 key 更新这些组件，防止旧数据导致问题 -->
                        <component :is="widget.comp" :key="$route.path" />
                    </div>
                </TransitionGroup>
            </div>
        </aside>
    </Transition>
</template>

<style lang="scss" scoped>
#z-aside {
    overflow: auto;
    padding: 0.5rem;

    @media (max-width: $breakpoint-widescreen) {
        position: fixed;
        top: 0;
        right: 0;
        width: 320px;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        transform: translateX(100%);
        transition: transform 0.2s;
        z-index: 100;

        .container {
            padding: 0.5rem;
            border-radius: 1rem;
            box-shadow: 0 0 1rem var(--ld-shadow);
            background-color: var(--ld-bg-blur);
            backdrop-filter: blur(0.5rem);
        }

        &.show {
            transform: none;
        }
    }
}

#z-aside-bgmask {
    position: fixed;
    inset: 0;
    background-color: #0003;
    transition: opacity 0.2s;
    z-index: 100;

    @media (min-width: $breakpoint-widescreen) {
        display: none;
    }
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.v-enter-active,
.v-leave-active {
    transition: all 0.2s;
}

// 对于标准 widget 的规范样式
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

        > .title {
            flex-grow: 1;
        }

        a {
            transition: color 0.2s;
        }

        > [onclick]:hover, > [href]:hover {
            color: var(--c-primary);
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
