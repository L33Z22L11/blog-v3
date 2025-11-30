<script setup lang="ts">
import type { VNodeChild } from 'vue'

interface DlItem {
	label: string
	value: MaybeRefOrGetter<VNodeChild>
	tip?: MaybeRefOrGetter<string>
}

withDefaults(defineProps<{
	items: DlItem[]
	size?: 'small' | 'medium' | 'large'
}>(), {
	size: 'medium',
})
</script>

<template>
<dl class="dl-group" :class="size">
	<div v-for="{ label, value, tip } in items" :key="label">
		<dt>{{ label }}</dt>
		<dd :title="toValue(tip)">
			<!-- 支持 string, Ref<String>, VNode, () => VNode -->
			<component :is="() => toValue(value)" />
		</dd>
	</div>
</dl>
</template>

<style lang="scss" scoped>
.dl-group {
	> div {
		padding: 0.2em 0;

		> dt {
			font-size: 0.9em;
			color: var(--c-text-2);
		}
	}
}

.dl-group.small {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5em 1em;
	text-align: center;

	> div {
		flex: 1;
		white-space: nowrap;
	}
}

.dl-group.medium {
	display: grid;
	grid-template-columns: auto auto;
	gap: 0.4em 8%;
	padding: 0.2em 0;

	> div {
		display: contents;

		> dt {
			font-size: inherit;
			text-align: end;
		}
	}
}
</style>
