<script setup lang="ts">
defineProps<{
    totalPages: number
    perPage: number
}>()

const page = defineModel<number>({ required: true })
</script>

<template>
    <nav class="pagination">
        <ZButton
            :disabled="page <= 1"
            class="pagination-button"
            icon="ph:arrow-fat-left-duotone"
            aria-label="上一页"
            @click="page--"
        />
        <span class="pagination-info">
            第 {{ page }} / {{ totalPages }} 页
        </span>
        <ZButton
            :disabled="page >= totalPages"
            class="pagination-button"
            icon="ph:arrow-fat-right-duotone"
            aria-label="下一页"
            @click="page++"
        />
    </nav>
</template>

<style scoped lang="scss">
.pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: 1rem 0;
}
</style>
