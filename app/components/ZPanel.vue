<script setup lang="ts">
const route = useRoute()
const UIStore = useUIStore()
const hasAside = computed(() => route.meta.aside !== false)
</script>

<template>
    <div id="z-panel" :class="{ 'has-aside': hasAside }">
        <button id="toggle-sidebar" :class="{ active: UIStore.sidebarOpen }" @click="UIStore.toggleSidebar">
            <Icon name="ph:sidebar-duotone" />
        </button>
        <button v-if="hasAside" id="toggle-aside" :class="{ active: UIStore.asideOpen }" @click="UIStore.toggleAside">
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
    z-index: 3;

    @media (min-width: $breakpoint-widescreen) {
        display: none;
    }

    &:not(.has-aside) {
        @media (min-width: $breakpoint-mobile) {
            display: none;
        }
    }

    &:has(.active) {
        box-shadow: 0 0 0.5rem var(--c-text-2);
    }
}

#toggle-sidebar {
    display: none;

    @media (max-width: $breakpoint-mobile) {
        display: block;
    }
}

button {
    display: block;
    padding: 0.5rem;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
        background-color: var(--c-bg-a50);
        color: var(--c-primary-1);
    }

    &.active {
        background-color: var(--ld-hl-bg);
        color: var(--c-primary-1);
    }
}

.iconify {
    display: block;
    font-size: 1.5rem;
}
</style>
