<script setup lang="ts">
const orderMap = {
    date: '创建日期',
    updated: '更新日期',
    // title: '标题',
}

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
    <div class="order-toggle" @click="switchOrder">
        <Icon name="ph:sort-ascending-bold" />
        <span class="order-text">{{ orderMap[orderBy] }}</span>
    </div>
</template>

<style scoped lang="scss">
.order-toggle {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.2rem;
    color: var(--c-text-3);
    transition: color 0.1s;
    cursor: pointer;

    &:hover {
        color: var(--c-primary-1);
    }
}
</style>
