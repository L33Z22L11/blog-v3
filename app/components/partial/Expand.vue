<script setup lang="ts">
defineProps<{
	name?: string
	inPlace?: boolean
}>()

const expand = defineModel<boolean>()
</script>

<template>
<div class="z-expand" :class="inPlace ? 'reverse' : ''">
	<div v-if="expand" class="content">
		<slot />
	</div>

	<button class="toggle-btn" @click="expand = !expand">
		<Icon class="toggle-icon" :class="{ expand }" name="ph:caret-double-down-bold" />
		<span>{{ expand ? '收起' : '展开' }}{{ name }}</span>
	</button>
</div>
</template>

<style lang="scss" scoped>
.z-expand {
	display: flex;
	flex-direction: column;

	&.reverse {
		flex-direction: column-reverse;
	}
}

.toggle-btn {
	display: block;
	width: fit-content;
	margin: 0 auto;
	padding: 0.3em;
	font-size: 0.9em;
	color: var(--c-text-2);
}

.toggle-icon {
	transition: transform 0.2s;

	&.expand {
		transform: scaleY(-1);
	}
}
</style>
