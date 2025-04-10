<script setup lang="ts">
defineProps<{
    title: string
    author?: string
    footer?: string
}>()
</script>

<template>
    <section class="poetry">
        <h2 class="poetry-title text-center">
            {{ title }}
        </h2>
        <div class="text-center">
            {{ author }}
        </div>
        <div class="poetry-content">
            <slot />
        </div>
        <div class="text-center">
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
    }
}
</style>
