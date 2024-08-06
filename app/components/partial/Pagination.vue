<script setup lang="ts">
const props = defineProps<{
    currentPage: number
    totalItems: number
    perPage: number
}>()

const emit = defineEmits<{
    (event: 'pageChange', page: number): void
}>()

const totalPages = Math.ceil(props.totalItems / props.perPage)

function changePage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
        emit('pageChange', newPage)
    }
}
</script>

<template>
    <nav class="pagination">
        <ZButton
            :disabled="currentPage <= 1"
            class="pagination-button"
            icon="ph:arrow-fat-left-duotone"
            @click="changePage(currentPage - 1)"
        />
        <span class="pagination-info">
            第 {{ currentPage }} / {{ totalPages }} 页
        </span>
        <ZButton
            :disabled="currentPage >= totalPages"
            class="pagination-button"
            icon="ph:arrow-fat-right-duotone"
            @click="changePage(currentPage + 1)"
        />
    </nav>
</template>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: 1rem 0;
}
</style>
