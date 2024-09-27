<script setup lang="ts">
// 可以通过 to 传递链接
// 即使 boolean 可选，其值也不会是 undefined
const props = defineProps<{
    img?: string
    text?: string
    round?: boolean
    square?: boolean
}>()

const round = computed(() => props.img ? !props.square : props.round)
</script>

<template>
    <ZRawLink class="badge" :class="{ 'badge-img': img, 'badge-round': round }">
        <NuxtImg v-if="img" class="badge-icon" :src="img" :alt="img" />
        <span class="badge-text">
            <slot>{{ text }}</slot>
        </span>
    </ZRawLink>
</template>

<style scoped lang="scss">
.badge {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--c-border);
    border-color: color-mix(in srgb, currentcolor 10%, transparent);
    border-radius: 4px;
    background-color: var(--c-bg-3);
    background-color: color-mix(in srgb, currentcolor 5%, transparent);
    font-size: 0.9em;
    line-height: normal;
    transition: color 0.2s;

    & + & {
        margin-left: 1em;
    }

    &[href]:hover {
        color: var(--c-text);
    }

    &.badge-round {
        border-radius: 1em;

        .badge-icon {
            border-radius: 1em;

            + .badge-text {
                margin-left: 0.2em;
            }
        }

        .badge-text {
            margin: 0 0.5em;
        }
    }
}

.badge-img {
    margin-block: 2px;
    font-size: 0.8em;

    .badge-icon {
        height: 1.8em;
        aspect-ratio: 1;
        border-radius: 3px;
        object-fit: cover;
    }
}

.badge-text {
    margin: 0 0.2em;

    &:empty {
        display: none;
    }
}
</style>
