<script setup lang="ts">
export interface ButtonProps {
    icon?: string
    text?: string
    desc?: string
}
defineProps<ButtonProps>()
</script>

<template>
    <button class="button">
        <div class="button-main">
            <Icon v-if="icon" :name="icon" />
            {{ text }}
            <slot />
        </div>
        <div v-if="desc" class="button-desc">
            {{ desc }}
        </div>
    </button>
</template>

<style scoped lang="scss">
.button {
    display: inline-block;
    align-items: center;
    padding: 0.4em 0.6em;
    border: 1px solid var(--c-border);
    border-radius: 0.4em;
    box-shadow: 0.05em 0.1em 0.5em var(--c-primary-soft);
    background-color: var(--c-bg-1);
    vertical-align: middle;
    transition: background-color 0.2s;
    cursor: pointer;

    & + & {
        margin-left: 0.8em;
    }

    &:hover {
        background-color: var(--c-bg-3);
    }

    &:disabled {
        background-color: initial;
        cursor: not-allowed;
    }
}

.button-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2em;

    .iconify {
        font-size: 1.2em;
    }
}

.button-desc {
    font-size: 0.75em;
    text-align: center;
    color: var(--c-text-2);
}
</style>
