<script setup lang="ts">
import type { NavItem } from '~/types/nav'

defineProps<{
    list: NavItem[]
}>()
</script>

<template>
    <menu>
        <ZTip v-for="item in list" :key="item.text" :tip="item.text">
            <ZRawLink :to="item.url" :aria-label="item.text">
                <Icon :name="item.icon" />
            </ZRawLink>
        </ZTip>
    </menu>
</template>

<style lang="scss" scoped>
menu {
    display: flex;
    justify-content: center;

    a {
        padding: 0.5em;
        border-radius: 2em;
        transition: background-color 0.2s;

        &:hover {
            background-color: var(--c-bg-soft);
        }

        .iconify {
            display: block;
        }
    }
}
</style>
