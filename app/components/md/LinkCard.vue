<script setup lang="ts">
const props = defineProps<{
    link: string
    title: string
    description?: string
    icon?: string
}>()
</script>

<template>
    <div class="link-card">
        <a :href="props.link" target="_blank" class="link-card__link">
            <div class="link-card__icon">
                <img v-if="props.icon" :src="props.icon" alt="icon">
            </div>
            <div class="link-card__content" />
            <div class="link-card__title">{{ props.title }}</div>
            <div class="link-card__description">{{ props.description }}</div>
        </a>
    </div>
</template>
