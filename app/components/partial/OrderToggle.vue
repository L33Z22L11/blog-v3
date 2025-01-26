<script setup lang="ts">
const props = defineProps<{
    // 强制允许或禁止升序
    enableAscending?: boolean
    disableAscending?: boolean
    categories?: (string | undefined)[]
}>()

const appConfig = useAppConfig()
const orderMap = appConfig.article.order
// 配置文件中允许升序时，且未明确禁用升序时，允许升序
const allowAscending = computed(() => appConfig.pagination.allowAscending ? !props.disableAscending : props.enableAscending)

const category = defineModel<string>('category')
const sortOrder = defineModel<keyof typeof orderMap>('sortOrder', { default: 'date' })
const isAscending = defineModel<boolean>('isAscending')

function toggleOrder() {
    const orderKeys = Object.keys(orderMap) as (keyof typeof orderMap)[]
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
        <DropdownMenuRoot>
            <DropdownMenuTrigger>
                <Icon :name="getCategoryIcon(category)" />
                <span class="order-text">{{ category ?? '全部分类' }}</span>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent class="order-category">
                    <DropdownMenuItem @click="category = undefined">
                        <Icon :name="getCategoryIcon()" />
                        <span>全部分类</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem v-for="item in categories" :key="item" @click="category = item">
                        <Icon :name="getCategoryIcon(item)" />
                        <span>{{ item }}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenuRoot>

        <div>
            <button v-if="allowAscending" aria-label="切换排序方向" @click="toggleDirection">
                <Icon name="ph:sort-ascending-bold" class="toggle-direction" :class="{ ascending: isAscending }" />
            </button>

            <button @click="toggleOrder">
                <Icon v-if="!allowAscending" name="ph:sort-ascending-bold" />
                <span class="order-text">{{ orderMap[sortOrder] }}</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.order-toggle {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    button {
        color: var(--c-text-2);
        transition: color 0.2s;

        &:hover {
            color: var(--c-primary);
        }
    }

    .toggle-direction {
        display: inline-block;
        margin-right: 0.1em;
        transition: transform 0.2s;

        &.ascending {
            transform: scaleY(-1);
        }
    }
}

.iconify + span {
    margin-left: 0.1em;
}

:deep(.order-category) {
    padding: 0.3em;
    border-radius: 0.6em;
    box-shadow: 0.1em 0.2em 0.5em var(--ld-shadow);
    background-color: var(--ld-bg-card);

    > div {
        padding: 0.3em 0.5em;
        border-radius: 0.3em;
        transition: background-color 0.2s;
        cursor: pointer;

        &:hover {
            background-color: var(--c-bg-soft);
        }
    }
}
</style>
