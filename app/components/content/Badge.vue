<script setup lang="ts">
// 即使 boolean 可选，其值也不会是 undefined
const props = defineProps<{
    img?: string
    text?: string
    link?: string
    round?: boolean
    square?: boolean
}>()

const img = computed(() => {
    if (props.img)
        return props.img
    const ghUsername = getGhUsername(props.link)
    if (ghUsername)
        return getGhAvatar(ghUsername)
    if (props.link && isExtLink(props.link))
        return `https://unavatar.webp.se/${getDomain(props.link)}`
    return ''
})

// 有图时默认为圆形样式，除非指定为方形
// 无图时默认为方形样式，除非指定为圆形
const round = computed(() => img.value ? !props.square : props.round)

const tip = computed(() => {
    if (!props.link)
        return ''
    if (isExtLink(props.link))
        return getDomain(props.link)
    return decodeURIComponent(props.link)
})
</script>

<template>
    <ZRawLink v-tippy="tip" class="badge" :class="{ 'badge-img': img, 'badge-round': round }" :to="link">
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
    vertical-align: text-bottom;
    color: color-mix(in srgb, currentcolor 80%, transparent);
    transition: color 0.2s;

    &[href]:hover {
        color: var(--c-text);
    }

    &.badge-round {
        border-radius: 1em;

        .badge-icon {
            border-radius: 1em;
        }
    }
}

.badge-img {
    .badge-icon {
        width: 1.6em;
        height: 1.6em;
        border-radius: 3.5px;
        object-fit: cover;
    }

    .badge-text {
        margin-left: 0.3em;
    }
}

.badge-text {
    margin: 0.1em 0.4em;

    &:empty {
        display: none;
    }
}
</style>
