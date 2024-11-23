<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
const repo = post.value?.github
</script>

<template>
    <h3 class="widget-title">
        GitHub 仓库
    </h3>
    <div class="widget-body">
        <ZRawLink v-if="repo" class="card" :to="repo.url">
            <div class="name">
                {{ repo.name }}
            </div>
            <div class="desc">
                {{ repo.description }}
            </div>
        </ZRawLink>
    </div>
</template>

<style lang="scss" scoped>
.card {
    padding: 0.5rem 0.8rem;

    .name {
        margin: 0.2rem 0;
    }

    .desc {
        opacity: 0.8;
        font-size: 0.8rem;
    }
}
</style>
