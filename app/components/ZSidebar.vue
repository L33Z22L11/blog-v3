<script setup lang="ts">
const appConfig = useAppConfig()
const UIStore = useUIStore()

const keycut = computed(() => navigator?.userAgent.includes('Mac OS') ? '⌘K' : 'Ctrl+K')
</script>

<template>
    <Transition>
        <div v-if="UIStore.isSidebarOpen" id="z-sidebar-bgmask" @click="UIStore.toggleSidebar" />
    </Transition>
    <!-- 此处不能使用 Transition，因为半宽屏状态始终显示 -->
    <aside id="z-sidebar" :class="{ show: UIStore.isSidebarOpen }">
        <ZhiluHeader class="sidebar-header" to="/" />
        <nav class="sidebar-nav">
            <div class="search-btn sidebar-nav-item gradient-card" @click="UIStore.toggleSearch">
                <Icon name="ph:magnifying-glass-bold" />
                <span class="nav-text">搜索</span>
                <span class="keycut widescreen-only">{{ keycut }}</span>
            </div>
            <template v-for="(group, groupIndex) in appConfig.nav" :key="groupIndex">
                <h3 v-if="group.title">
                    {{ group.title }}
                </h3>
                <menu>
                    <li v-for="(item, itemIndex) in group.items" :key="itemIndex">
                        <ZRawLink :to="item.url" class="sidebar-nav-item">
                            <Icon :name="item.icon" />
                            <span class="nav-text">{{ item.text }}</span>
                            <Icon v-if="item?.external" class="external-tip" name="ph:arrow-up-right" />
                        </ZRawLink>
                    </li>
                </menu>
            </template>
        </nav>
        <footer class="sidebar-footer">
            <ThemeToggle />
        </footer>
    </aside>
</template>

<style scoped lang="scss">
// TODO: 减少侧边栏代码冗余
#z-sidebar {
    display: grid;
    grid-template-rows: auto 1fr auto;
    color: var(--c-text-2);

    @media (max-width: $breakpoint-mobile) {
        position: fixed;
        left: -100%;
        width: 320px;
        max-width: 100%;
        padding: 0 0.5rem;
        box-shadow: 0 0 1rem var(--ld-shadow);
        background-color: var(--ld-bg-blur);
        backdrop-filter: blur(0.5rem);
        color: currentcolor;
        transition: left 0.2s;
        z-index: 100;

        &.show {
            left: 0;
        }
    }
}

#z-sidebar-bgmask {
    position: fixed;
    inset: 0;
    background-color: #0003;
    transition: opacity 0.2s;
    z-index: 100;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }

    @media (min-width: $breakpoint-mobile) {
        display: none;
    }
}

.sidebar-nav {
    padding: 0 0.5rem;
    font-size: 0.9em;

    h3 {
        margin: 2em 0 1em 1em;
        font: inherit;
        color: var(--c-text-2);
    }

    li {
        margin: 0.5em 0;
    }
}

.sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.5em 1em;
    border-radius: 0.5em;
    transition: all 0.2s;

    &:hover, &.router-link-active {
        background-color: var(--c-bg-soft);
        color: var(--c-text);
    }

    &.router-link-active::after {
        content: "⦁";
        width: 1em;
        text-align: center;
        color: var(--c-text-3);
    }

    .iconify {
        font-size: 1.5em;
    }

    .nav-text {
        flex-grow: 1;
    }

    .external-tip {
        opacity: 0.5;
        font-size: 1em;
    }
}

.search-btn {
    margin-block: 1rem;
    outline: 1px solid var(--c-border);
    outline-offset: -1px;
    cursor: text;

    &:hover {
        outline-color: transparent;
        background-color: transparent;
    }

    .keycut {
        opacity: 0.5;
        padding: 0 0.2em;
        border-radius: 0.2em;
        background-color: var(--c-bg-soft);
        font-size: 0.8em;
    }
}

.sidebar-footer {
    padding-block: 1rem;
    font-size: 0.8em;
    text-align: center;
    color: var(--c-text-2);
}
</style>
