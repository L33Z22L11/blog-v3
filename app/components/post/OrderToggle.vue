<script setup lang="ts">
import type { ArticleOrderType } from '~/types/article'

const props = defineProps<{
	// 强制允许或禁止升序
	enableAscending?: boolean
	disableAscending?: boolean
	categories?: (string | undefined)[]
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
<div class="order-toggle">
	<slot />

	<ZDropdown trigger="focusin" tabindex="0">
		<ZButton
			:disabled="!categories"
			variant="text"
			:icon="getCategoryIcon(category)"
			:text=" category ?? '全部分类' "
		/>

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
		<ZButton
			v-if="allowAscending"
			class="toggle-direction"
			:class="{ ascending: isAscending }"
			icon="ph:sort-ascending-bold"
			variant="text"
			aria-label="切换排序方向"
			@click="toggleDirection"
		/>

		<ZButton
			icon="ph:sort-ascending-bold"
			variant="text"
			:text="orderMap[sortOrder]"
			aria-label="切换排序方式"
			@click="toggleOrder"
		/>
	</span>
</div>
</template>

<style lang="scss" scoped>
.order-toggle {
	display: flex;
	gap: 1rem;
	color: var(--c-text-2);

	.toggle-direction {
		display: inline-block;
		margin-inline-end: 0.1em;
		transition: transform 0.2s;

		&.ascending {
			transform: scaleY(-1);
		}
	}
}

:deep(.secret-container) {
	margin-inline-end: auto;
}

.iconify + span {
	margin-inline-start: 0.1em;
}
</style>
