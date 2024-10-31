<script setup lang="ts">
// 即使 boolean 可选，其值也不会是 undefined
const props = defineProps<{
    img?: string
    text?: string
    link?: string
    round?: boolean
    square?: boolean
}>()

// 有图时默认为圆形样式，除非指定为方形
// 无图时默认为方形样式，除非指定为圆形
const round = computed(() => props.img ? !props.square : props.round)

const ghAvatar = computed(() => {
    const username = getGhUsername(props.link)
    return username ? getFeedIcon(username, { size: 92 }) : ''
})

const img = computed(() => props.img || ghAvatar.value)
</script>

<template>
    <ZRawLink class="badge" :class="{ 'badge-img': img, 'badge-round': round }" :to="link">
        <NuxtImg v-if="img" class="badge-icon" :src="img" :alt="img" />
        <span class="badge-text">
            <slot>{{ text }}</slot>
        </span>
    </ZRawLink>
</template>

<style lang="scss" scoped>
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
    }
}

.badge-img {
    vertical-align: top;

    .badge-icon {
        height: 1.8em;
        aspect-ratio: 1;
        border-radius: 3.5px;
        object-fit: cover;
    }
}

.badge-text {
    margin: 0.2em 0.5em;

    &:empty {
        display: none;
    }
}
</style>
