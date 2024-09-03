<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
const repo = data.value?.github
</script>

<!-- TODO: add github card -->
<template>
    <h3 class="widget-title">
        GitHub 仓库
    </h3>
    <div class="widget-card">
        {{ repo }}
    </div>
</template>
