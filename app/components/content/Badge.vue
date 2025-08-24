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
		return getFavicon(getDomain(props.link))
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
<ZRawLink v-tip="tip" class="badge" :class="{ round }" :to="link">
	<NuxtImg v-if="img" class="badge-icon" :src="img" :alt="img" />
	<span class="badge-text">
		<slot>{{ text }}</slot>
	</span>
</ZRawLink>
</template>

<style lang="scss" scoped>
// 对齐到基线，同时保持图片垂直居中
.badge {
	display: inline-flex;
	align-items: baseline;
	margin: 0.1em;
	border: 1px solid var(--c-border);
	border-radius: 4px;
	box-sizing: content-box;
	background-color: var(--c-bg-2);
	font-size: 0.875em;
	transition: color 0.2s;

	@supports (color: color-mix(in srgb, transparent, transparent)) {
		border-color: color-mix(in srgb, currentcolor 10%, transparent);
		background-color: color-mix(in srgb, currentcolor 5%, transparent);
		color: color-mix(in srgb, currentcolor 80%, transparent);
	}

	&[href]:hover {
		color: var(--c-text);
	}

	&.round, &.round > .badge-icon {
		border-radius: 0.8em;
	}
}

.badge-icon {
	align-self: normal;
	height: 1.6em;
	border-radius: 3.5px;

	+ .badge-text {
		margin-left: -0.1em;
	}
}

.badge-text {
	padding: 0.2em 0.4em;
	line-height: 1.2;

	&:empty {
		display: none;
	}
}
</style>
