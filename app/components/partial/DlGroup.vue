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
<section class="dl-group" :class="size">
	<dl v-for="{ label, value, tip } in items" :key="label" :title="toValue(tip)">
		<dt>{{ label }}</dt>
		<dd>
			<!-- 支持 string, Ref<String>, VNode, () => VNode -->
			<component :is="() => toValue(value)" />
		</dd>
	</dl>
</section>
</template>

<style lang="scss" scoped>
.dl-group {
	> dl {
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

	> dl {
		flex: 1;
		white-space: nowrap;
	}
}

.dl-group.medium {
	> dl {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 8%;
		padding: 0.2em 0;

		>dt {
			font-size: inherit;
			text-align: right;
		}
	}
}
</style>
