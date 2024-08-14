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
        <h5 class="poetry-info">
            {{ author }}
        </h5>
        <div class="poetry-content">
            <slot />
        </div>
        <h6 class="poetry-footer">
            {{ footer }}
        </h6>
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
