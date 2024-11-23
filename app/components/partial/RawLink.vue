<script setup lang="ts">
import { NuxtLink } from '#components'

defineProps<{ to?: string }>()
</script>

<template>
    <component :is="to ? NuxtLink : 'span'" :to :target="isExtLink(to) ? '_blank' : undefined">
        <slot />
    </component>
</template>
