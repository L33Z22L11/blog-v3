<script setup lang="ts">
defineProps<{
	name?: string
	inPlace?: boolean
}>()

const expand = defineModel<boolean>()
</script>

<template>
<div class="z-expand">
	<Transition name="collapse">
		<div v-show="expand" class="expand-content">
			<slot />
		</div>
	</Transition>

	<button class="toggle-btn" :class="{ 'in-place': inPlace }" @click="expand = !expand">
		<Icon class="toggle-icon" :class="{ expand }" name="ph:caret-double-down-bold" />
		<span>{{ `${expand ? '收起' : '展开'}${name}` }}</span>
	</button>
</div>
</template>

<style lang="scss" scoped>
.z-expand {
	display: flex;
	flex-direction: column;
}

.toggle-btn {
	display: block;
	width: fit-content;
	margin: 0 auto;
	padding: 0.3em;
	font-size: 0.9em;
	color: var(--c-text-2);

	&.in-place {
		order: -1;
	}
}

.toggle-icon {
	transition: transform 0.2s;

	&.expand {
		transform: scaleY(-1);
	}
}
</style>
