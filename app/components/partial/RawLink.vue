<script setup lang="ts">
defineProps<{ to?: string }>()
</script>

<template>
<a v-if="to?.startsWith('#')" :href="to"><slot /></a>
<span v-else-if="to === undefined"><slot /></span>
<NuxtLink v-else :to :target="isExtLink(to) ? '_blank' : undefined">
	<slot />
</NuxtLink>
</template>
