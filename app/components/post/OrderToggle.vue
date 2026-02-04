<script setup lang="ts">
import type { ArticleOrderType } from '~/types/article'

const props = defineProps<{
	// 强制允许或禁止升序
	enableAscending?: boolean
	disableAscending?: boolean
	categories?: (string | undefined)[]
	secretDelay?: string
}>()

const appConfig = useAppConfig()
const orderMap = computed(() => appConfig.article.order)
// 配置文件中允许升序时，且未明确禁用升序时，允许升序
const allowAscending = computed(() => appConfig.pagination.allowAscending ? !props.disableAscending : props.enableAscending)

const category = defineModel<string>('category')
const sortOrder = defineModel<ArticleOrderType>('sortOrder', { default: 'date' })
const isAscending = defineModel<boolean>('isAscending')

function toggleOrder() {
	const orderKeys = Object.keys(orderMap.value) as (ArticleOrderType)[]
	sortOrder.value = orderKeys[(orderKeys.indexOf(sortOrder.value) + 1) % orderKeys.length] || 'date'
}

function toggleDirection() {
	if (!allowAscending.value)
		return
	isAscending.value = !isAscending.value
}
</script>

<template>
<div class="order-toggle" :style="{ '--secret-delay': secretDelay }">
	<slot />

	<!-- 外层元素用于占位 -->
	<div class="secret-container">
		<div class="secret">
			<slot name="secret" />
		</div>
	</div>

	<ZDropdown trigger="focusin" tabindex="0">
		<button :disabled="!categories">
			<Icon :name="getCategoryIcon(category)" />
			<span class="order-text">{{ category ?? '全部分类' }}</span>
		</button>

		<template #content="{ hide }">
			<button :class="{ active: !category }" @click="hide(), category = undefined">
				<Icon :name="getCategoryIcon()" />
				<span>全部分类</span>
			</button>

			<button v-for="item in categories" :key="item" :class="{ active: item === category }" @click="hide(), category = item">
				<Icon :name="getCategoryIcon(item)" />
				<span>{{ item }}</span>
			</button>
		</template>
	</ZDropdown>

	<span>
		<button v-if="allowAscending" aria-label="切换排序方向" @click="toggleDirection">
			<Icon name="ph:sort-ascending-bold" class="toggle-direction" :class="{ ascending: isAscending }" />
		</button>

		<button @click="toggleOrder">
			<Icon v-if="!allowAscending" name="ph:sort-ascending-bold" />
			<span class="order-text">{{ orderMap[sortOrder] }}</span>
		</button>
	</span>
</div>
</template>

<style lang="scss" scoped>
.order-toggle {
	display: flex;
	gap: 1rem;
	color: var(--c-text-2);

	:deep(button), :deep(a) {
		transition: color 0.2s;

		&:hover {
			color: var(--c-primary);
		}
	}

	.toggle-direction {
		display: inline-block;
		margin-inline-end: 0.1em;
		transition: transform 0.2s;

		&.ascending {
			transform: scaleY(-1);
		}
	}
}

.secret-container {
	margin-inline-end: auto;
}

.secret {
	position: relative;
	opacity: 0;
	transition: all 0.2s var(--secret-delay, 0.5s), color 0.2s;
	z-index: -1;

	:hover > &,
	:focus-within > & {
		opacity: 1;
		z-index: 0;
	}
}

.iconify + span {
	margin-inline-start: 0.1em;
}
</style>
