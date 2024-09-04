<script setup lang="ts">
import type { Nav } from '~/types/nav'

const appConfig = useAppConfig()
const UIStore = useUIStore()
</script>

<template>
    <Transition>
        <div v-if="UIStore.sidebarOpen" id="z-sidebar-bgmask" @click="UIStore.toggleSidebar" />
    </Transition>
    <aside id="z-sidebar" :class="{ show: UIStore.sidebarOpen }">
        <ZhiluHeader class="sidebar-header" to="/" />
        <nav class="sidebar-nav">
            <div class="notify gradient-card active">
                <p>
                    <Icon name="ph:lego-bold" /> 本站仍处于开发阶段，不代表最终呈现样式。
                </p>
            </div>
            <template v-for="(group, groupIndex) in appConfig.nav as Nav" :key="groupIndex">
                <h3 v-if="group.title">
                    {{ group.title }}
                </h3>
                <menu>
                    <li v-for="(item, itemIndex) in group.items" :key="itemIndex">
                        <ZRawLink :to="item.url">
                            <Icon :name="item.icon" />
                            <span class="nav-text">{{ item.text }}</span>
                            <Icon v-if="item?.external" class="external-tip" name="ph:arrow-up-right" />
                        </ZRawLink>
                    </li>
                </menu>
            </template>
        </nav>
        <footer class="sidebar-footer">
            <ZThemeToggle />
            <div class="footer-link">
                <ZLink :to="appConfig.sidebar.footerLink.url">
                    {{ appConfig.sidebar.footerLink.text }}
                </ZLink>
            </div>
        </footer>
    </aside>
</template>

<style scoped lang="scss">
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
    z-index: 100;

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

.notify {
    position: sticky;
    margin: 1em 0.2em;
    padding: 0.5em;
    backdrop-filter: blur(2px);
    z-index: 1;
}

.sidebar-nav {
    overflow: auto;
    padding: 0 0.5rem;
    font-size: 0.9em;

    h3 {
        margin: 2em 0 1em 1em;
        font: inherit;
        color: var(--c-text-2);
    }

    li {
        margin: 0.5em 0;

        >a {
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
    }
}

.sidebar-footer {
    padding-top: 1rem;
    font-size: 0.8em;
    text-align: center;
    color: var(--c-text-2);

    .footer-link {
        display: inline-block;
        margin: 1rem 0;
    }
}
</style>
