<script setup lang="ts">
const sidebarStore = useSidebarStore()
</script>

<template>
    <div id="z-header">
        <Icon id="toggle-sidebar" name="ph:sidebar-duotone" @click="sidebarStore.toggle" />
        <span class="header-text">{{ $route.meta.headerText }}</span>
    </div>
</template>

<style scoped lang="scss">
#z-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    position: sticky;
    top: 0;
    height: 48px;
    padding-inline: 1rem;
    background-color: var(--c-bg-a50);
    backdrop-filter: blur(1rem);
    font-weight: 600;
    z-index: 1;

    .header-text {
        flex-grow: 1;
    }
}

#toggle-sidebar {
    display: none;

    @media (max-width: $breakpoint-mobile) {
        display: block;
    }
}

.iconify {
    font-size: 1.5em;
    cursor: pointer;
}
</style>
