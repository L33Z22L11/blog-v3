<script setup lang="ts">
const UIStore = useUIStore()
const hasAside = computed(() => UIStore.aside?.length)

useEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        UIStore.closeAll()
    }
})
</script>

<template>
    <div id="z-panel" :class="{ 'has-active': UIStore.isSidebarOpen || UIStore.isAsideOpen }">
        <button
            id="toggle-sidebar"
            :class="{ active: UIStore.isSidebarOpen }"
            aria-label="切换菜单"
            @click="UIStore.toggleSidebar"
        >
            <Icon name="ph:sidebar-duotone" />
        </button>
        <button
            v-if="hasAside"
            id="toggle-aside"
            :class="{ active: UIStore.isAsideOpen }"
            aria-label="切换侧边栏"
            @click="UIStore.toggleAside"
        >
            <Icon name="ph:align-right-duotone" />
        </button>
    </div>
</template>

<style scoped lang="scss">
#z-panel {
    position: fixed;
    overflow: hidden;
    right: 2rem;
    bottom: 2rem;
    border-radius: 0.5rem;
    background-color: var(--c-bg-a50);
    backdrop-filter: blur(0.5rem);
    font-size: 1.4rem;
    z-index: 100;

    @media (min-width: $breakpoint-widescreen) {
        display: none;
    }

    &.has-active {
        box-shadow: 0 0 0.5rem var(--ld-shadow);
    }
}

#toggle-sidebar, #toggle-search {
    display: none;

    @media (max-width: $breakpoint-mobile) {
        display: block;
    }
}

button {
    display: block;
    padding: 0.5rem;
    transition: all 0.2s;

    &:hover {
        background-color: var(--c-bg-a80);
        color: var(--c-primary);
    }

    &.active {
        background-color: var(--ld-bg-active);
        color: var(--c-primary);
    }
}
</style>
