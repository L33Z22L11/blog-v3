<script setup lang="ts">
const scroll = ref(true)
</script>

<template>
    <div class="md-table">
        <div class="table-header">
            <ZButton @click="scroll = !scroll">
                {{ scroll ? '自动换行' : '横向滚动' }}
            </ZButton>
        </div>
        <table class="scrollcheck-x" :class="{ scroll }">
            <slot />
        </table>
    </div>
</template>

<style lang="scss" scoped>
.md-table {
    position: relative;
    margin: 1rem 0;
    font-size: 0.9em;
    line-height: 1.4;
    word-break: break-all;

    table.scroll {
        display: block;
        overflow: auto;
        white-space: nowrap;
        word-break: normal;
    }

    &:hover {
        .table-header {
            opacity: 0.4;

            &:hover {
                opacity: 1;
            }
        }
    }

    .table-header {
        position: sticky;
        opacity: 0;
        top: 0;
        height: 0;
        text-align: right;
        transition: opacity 0.2s;
        z-index: 1;
    }

    :deep(table) {
        border-collapse: collapse;

        // 表头 thead 滚动吸附

        th {
            background-color: var(--c-bg-2);
            font-weight: var(--font-weight-bold);
            text-align: center;
        }

        tr {
            transition: background-color 0.2s;

            &:hover {
                background-color: var(--c-bg-2);
            }
        }

        th, td {
            padding: 0.5em 0.8em;
            border: 1px solid var(--c-border);
        }
    }
}
</style>
