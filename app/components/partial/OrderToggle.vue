<script setup lang="ts">
const appConfig = useAppConfig()

const orderMap = appConfig.article.order

const orderBy = defineModel<keyof typeof orderMap>({
    required: true,
    default: 'date',
})

function switchOrder() {
    const orderKeys = Object.keys(orderMap) as (keyof typeof orderMap)[]
    const currentIndex = orderKeys.indexOf(orderBy.value)
    orderBy.value = orderKeys[(currentIndex + 1) % orderKeys.length]!
}
</script>

<template>
    <div class="order-toggle">
        <button @click="switchOrder">
            <Icon name="ph:sort-ascending-bold" /> <span class="order-text">{{ orderMap[orderBy] }}</span>
        </button>
    </div>
</template>

<style scoped lang="scss">
.order-toggle {
    text-align: right;

    > button {
        color: var(--c-text-2);
        transition: color 0.1s;

        &:hover {
            color: var(--c-primary);
        }
    }
}
</style>
