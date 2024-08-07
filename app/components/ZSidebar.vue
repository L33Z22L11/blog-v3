<script setup lang="ts">
const appConfig = useAppConfig()
const sidebarStore = useSidebarStore()
</script>

<template>
    <aside id="z-sidebar" :class="{ show: sidebarStore.isOpen }">
        <header class="sidebar-header">
            <ZLIcon />
            <span>{{ appConfig.title }}</span>
            <Icon name="ph:x" class="close-sidebar" @click="sidebarStore.toggle()" />
        </header>
        <nav class="sidebar-nav">
            <template v-for="(group, groupIndex) in appConfig.nav" :key="groupIndex">
                <h3 v-if="group.title">
                    {{ group.title }}
                </h3>
                <ul>
                    <li v-for="(item, itemIndex) in group.items" :key="itemIndex">
                        <ZRawLink :to="item.url">
                            <Icon :name="item.icon" />
                            <span class="nav-text">{{ item.text }}</span>
                        </ZRawLink>
                    </li>
                </ul>
            </template>
        </nav>
        <footer class="sidebar-footer">
            <ZThemeToggle />
            <ZLink class="footer-link" :to="appConfig.sidebar.footerLink.url">
                {{ appConfig.sidebar.footerLink.text }}
            </ZLink>
        </footer>
    </aside>
    <Transition>
        <div v-if="sidebarStore.isOpen" id="z-sidebar-bgmask" @click="sidebarStore.toggle()" />
    </Transition>
</template>

<style scoped lang="scss">
#z-sidebar {
    display: grid;
    grid-template-rows: auto 1fr auto;
    position: sticky;

    .close-sidebar {
        display: none;
        cursor: pointer;
    }

    &.v-enter-active,
    &.v-leave-active {
        transition: opacity 0.2s;
    }

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }

    @media (max-width: $breakpoint-mobile) {
        position: fixed;
        left: -100vw;
        width: 320px;
        min-width: auto;
        max-width: 100vw;
        box-shadow: 0 0 48px -36px;
        background-color: var(--c-bg-2);
        transition: left 0.2s;
        z-index: 3;

        &.show {
            left: 0;

            .close-sidebar {
                display: block;
            }
        }
    }
}

#z-sidebar-bgmask {
    position: fixed;
    inset: 0;
    backdrop-filter: contrast(0.8) brightness(0.9);
    z-index: 2;

    &.v-enter-active,
    &.v-leave-active {
        transition: opacity 0.2s;
    }

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }

    @media (min-width: $breakpoint-mobile) {
        display: none;
    }
}

.sidebar-header {
    display: grid;
    grid-template-columns: 1.5rem 1fr auto;
    align-items: center;
    gap: 0.5rem;
    height: 48px;
    padding-inline: 1rem;
    font-weight: 600;
}

.sidebar-nav {
    overflow: auto;
    padding: 0.5rem;

    h3 {
        margin: 2rem 0 1rem 1rem;
        font: inherit;
        color: var(--c-text-2);
    }

    li {
        margin: 6px 0;

        >a {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 6px 12px;
            border-radius: 0.5rem;
            transition: background-color 0.2s, color 0.1s;

            &:hover {
                background-color: var(--c-primary-soft);
            }

            &.router-link-active {
                background-color: var(--c-primary-soft);

                &::after {
                    content: "⦁";
                    width: 1rem;
                    text-align: center;
                    color: var(--c-text-3);
                }
            }

            .iconify {
                font-size: 1.5rem;
            }

            .nav-text {
                flex-grow: 1;
            }

            .external-tip {
                opacity: 0.5;
                font-size: 1rem;
            }
        }
    }
}

.sidebar-footer {
    padding: 0.5rem;
    font-size: 0.8em;
    line-height: 1.5;
    text-align: center;
    color: var(--c-text-2);

    .footer-link {
        display: inline-block;
        margin: 1rem;
    }
}
</style>
