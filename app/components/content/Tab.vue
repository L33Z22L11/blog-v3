<script setup lang="ts">
const props = defineProps<{
    /** tab 下标从 1 开始 */
    tabs: string[]
    center?: boolean
    active?: number
}>()

// 使用 v-bind:active 以传递 Number 值
const activeTab = ref(Number(props.active) || 1)
</script>

<template>
    <div :class="{ center }">
        <div class="tabs">
            <button
                v-for="(tab, tabIndex) in tabs"
                :key="tabIndex"
                :class="{ active: activeTab === tabIndex + 1 }"
                @click="activeTab = tabIndex + 1"
            >
                {{ tab }}
            </button>
        </div>
        <div class="tab-content">
            <!-- <Transition> -->
            <slot :name="`tab${activeTab}`" />
            <!-- </Transition> -->
        </div>
    </div>
</template>

<style lang="scss" scoped>
.float-in-leave-active {
    position: revert;
}

.center {
    width: fit-content;
    max-width: 100%;
    margin-inline: auto;
}

.tabs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5em;
    position: relative;
    width: fit-content;
    margin: 0 auto;
    padding: 0.5em 0;
    font-size: 0.9em;
    line-height: normal;

    &::before {
        content: "";
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 2px;
        border-radius: 1em;
        background-color: var(--c-border);
    }
}

button {
    padding: 0.3em 0.5em;
    border-radius: 0.4em;
    color: var(--c-text-2);
    transition: all 0.2s;

    &:hover {
        background-color: var(--c-bg-soft);
        color: var(--c-text);
    }

    &.active {
        position: relative;
        box-shadow: 0 1px 0.5em var(--ld-shadow);
        background-color: var(--ld-bg-card);
        color: var(--c-text);

        &::before {
            content: "";
            display: block;
            position: absolute;
            right: 0.8em;
            bottom: -0.5em;
            left: 0.8em;
            height: 2px;
            border-radius: 1em;
            background-color: var(--c-primary);
        }
    }
}

.tab-content {
    padding: 0.5em 0;
}
</style>
