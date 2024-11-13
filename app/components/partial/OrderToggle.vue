<script setup lang="ts">
const emit = defineEmits<{
    direction: []
}>()

enum SortOrder {
    Ascending = '升序',
    Descending = '降序',
}

const appConfig = useAppConfig()
const orderMap = appConfig.article.order
const orderDirection = ref(SortOrder.Descending)

const orderBy = defineModel<keyof typeof orderMap>({
    required: true,
    default: 'date',
})

function toggleOrder() {
    const orderKeys = Object.keys(orderMap) as (keyof typeof orderMap)[]
    orderBy.value = orderKeys[(orderKeys.indexOf(orderBy.value) + 1) % orderKeys.length]!
}

function toggleDirection() {
    orderDirection.value = orderDirection.value === SortOrder.Descending
        ? SortOrder.Ascending
        : SortOrder.Descending
    emit('direction')
}
</script>

<template>
    <div class="order-toggle">
        <button @click="toggleDirection">
            <Icon
                :name="orderDirection === SortOrder.Descending
                    ? 'ph:sort-ascending-bold' : 'ph:sort-descending-bold'"
            />
            <span>{{ orderDirection }}</span>
        </button>

        <button @click="toggleOrder">
            <Icon name="ph:clock-bold" />
            <span class="order-text">{{ orderMap[orderBy] }}</span>
        </button>
    </div>
</template>

<style lang="scss" scoped>
.order-toggle {
    text-align: right;

    > button {
        color: var(--c-text-2);
        transition: color 0.1s;

        &:hover {
            color: var(--c-primary);
        }

        & + button {
            margin-left: 1em;
        }

        .iconify + span {
            margin-left: 0.1em;
        }
    }
}
</style>
