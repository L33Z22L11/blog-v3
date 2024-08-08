<script setup lang="ts">
withDefaults(defineProps<{
    hasAside: boolean
}>(), {
    hasAside: true,
})
const sidebarStore = useSidebarStore()
const asideStore = useAsideStore()
</script>

<template>
    <div id="z-panel" :class="{ 'has-aside': hasAside }">
        <button id="toggle-sidebar" :class="{ active: sidebarStore.isOpen }" @click="sidebarStore.toggle">
            <Icon name="ph:sidebar-duotone" />
        </button>
        <button v-if="hasAside" id="toggle-aside" :class="{ active: asideStore.isOpen }" @click="asideStore.toggle">
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
    z-index: 2;

    @media (min-width: $breakpoint-widescreen) {
        display: none;
    }

    &:not(.has-aside) {
        @media (min-width: $breakpoint-mobile) {
            display: none;
        }
    }

    &:has(.active) {
        box-shadow: 2px 4px 0.5rem rgb(0 0 0 / 25%);
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
    padding: auto;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
        background-color: var(--c-bg-a50);
        color: var(--c-primary-1);
    }

    &.active {
        background-color: var(--c-bg-1);
        color: var(--c-primary-1);
    }
}

.iconify {
    font-size: 1.5rem;
}
</style>
