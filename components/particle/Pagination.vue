<script setup lang="ts">
const props = defineProps({
    total: {
        type: Number,
        required: true,
    },
    perPage: {
        type: Number,
        required: true,
    },
    current_page: {
        type: Number,
        required: true,
    },
})

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.ceil(props.total / props.perPage))

function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
        emit('page-change', page)
    }
}

function nextPage() {
    if (props.current_page < totalPages.value) {
        emit('page-change', props.current_page + 1)
    }
}

function prevPage() {
    if (props.current_page > 1) {
        emit('page-change', props.current_page - 1)
    }
}
</script>

<template>
    <nav class="pagination">
        <button :disabled="current_page === 1" @click="prevPage">
            Previous
        </button>
        <span>Page {{ current_page }} of {{ totalPages }}</span>
        <button :disabled="current_page === totalPages" @click="nextPage">
            Next
        </button>
        <ul class="pagination-list">
            <li v-for="page in totalPages" :key="page">
                <button
                    :class="{ active: page === current_page }"
                    @click="goToPage(page)"
                >
                    {{ page }}
                </button>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.pagination-list {
    display: flex;
    gap: 5px;
}

.pagination-list button {
    padding: 5px 10px;
}

.pagination-list button.active {
    background-color: #007bff;
    font-weight: bold;
    color: white;
}
</style>
