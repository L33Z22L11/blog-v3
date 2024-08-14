<script setup lang="ts">
defineProps<{
    title: string
    author?: string
    footer?: string
}>()
</script>

<template>
    <section class="poetry">
        <h2 class="poetry-title">
            {{ title }}
        </h2>
        <div class="title-like">
            {{ author }}
        </div>
        <div class="poetry-content">
            <slot />
        </div>
        <div class="title-like">
            {{ footer }}
        </div>
    </section>
</template>

<style lang="scss" scoped>
.poetry {
    width: fit-content;
    margin: 2em auto;
    white-space: pre-wrap;

    .poetry-title {
        font-size: 1.2em;
    }

    :deep(p) {
        margin-block: 0.5em;
        text-indent: 0;
    }
}
</style>
