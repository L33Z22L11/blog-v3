<script setup lang="ts">
export interface ButtonProps {
    icon?: string
    text?: string
    desc?: string
}
defineProps<ButtonProps>()
</script>

<template>
    <button class="button card" type="button">
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
    padding: 0.4em 0.6em;
    border: 1px solid var(--c-border);
    line-height: normal;
    cursor: pointer;

    & + & {
        margin-left: 0.8em;
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
}

.button-desc {
    font-size: 0.75em;
    text-align: center;
    color: var(--c-text-2);
}
</style>
