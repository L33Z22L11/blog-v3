<script setup lang="ts">
//排序方向枚举
enum SortOrder{
    Ascending = '升序',
    Descending = '降序',
}

const appConfig = useAppConfig()

const orderMap = appConfig.article.order
const orderDirection = ref(SortOrder.Descending)
const orderText = computed(()=>orderDirection.value)

const orderBy = defineModel<keyof typeof orderMap>({
    required: true,
    default: 'date',
})
const emit = defineEmits([
    'direction'
])

function switchOrder() {
    const orderKeys = Object.keys(orderMap) as (keyof typeof orderMap)[]
    const currentIndex = orderKeys.indexOf(orderBy.value)
    orderBy.value = orderKeys[(currentIndex + 1) % orderKeys.length]!
}
const switchDirection = ()=>{
    emit('direction'); //触发排序方向改变事件
    orderDirection.value = orderDirection.value === SortOrder.Descending ? 
        SortOrder.Ascending : SortOrder.Descending
}
</script>

<template>
    <div class="order-toggle">
        <Icon :name="orderDirection === SortOrder.Descending ? 
            'ph:sort-ascending-bold' : 'ph:sort-descending-bold'"
        /> 
        <button @click="switchDirection">
            <span style="margin-right: 1em;">{{ orderText }}</span>
        </button>
        
        <button @click="switchOrder">
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
    }
}
</style>
