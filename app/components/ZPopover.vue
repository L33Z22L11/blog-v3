<script setup lang="ts">
const popoverStore = usePopoverStore()
const { pops } = storeToRefs(popoverStore)
</script>

<template>
    <template v-for="{ component, zIndex, isOpening, duration } in pops" :key="zIndex">
        <component :is="component" :is-opening :duration :style="{ zIndex }" />
    </template>
</template>
