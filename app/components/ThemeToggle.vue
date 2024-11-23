<script setup lang="ts">
const appConfig = useAppConfig()
const colorMode = useColorMode()
const themeToggle = ref<HTMLDivElement[] | undefined>()

const themes = appConfig.themes
type ThemeType = keyof typeof themes
function toggleTheme(themeName: ThemeType) {
    colorMode.preference = themeName
}
</script>

<template>
    <div class="theme-toggle">
        <button
            v-for="(themeData, themeName) in themes"
            :key="themeName"
            ref="themeToggle"
            v-tippy="themeData.tip"
            type="button"
            :aria-label="themeData.tip"
            :class="{ active: colorMode.preference === themeName }"
            @click="toggleTheme(themeName)"
        >
            <Icon :name="themeData.icon" />
        </button>
    </div>
</template>

<style lang="scss" scoped>
.theme-toggle {
    display: flex;
    justify-content: center;
    gap: 3px;
    width: fit-content;
    margin: 0 auto;
    padding: 2px;
    border: 1px solid var(--c-border);
    border-radius: 1rem;
    background-color: var(--c-bg-2);

    > button {
        display: grid;
        place-items: center;
        padding: 4px 1rem;
        border-radius: 1rem;
        transition: all 0.1s;

        &:hover {
            background-color: var(--c-bg-soft);
            color: var(--c-text-1);
        }

        &.active {
            box-shadow: 0 0 0.5rem var(--ld-shadow);
            background-color: var(--ld-bg-card);
            color: var(--c-text-1);
            cursor: auto;
        }
    }
}
</style>
