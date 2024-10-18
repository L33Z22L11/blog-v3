<script setup lang="ts">
const popoverStore = usePopoverStore()
</script>

<template>
    <component
        :is="popover.comp"
        v-for="popover, index in popoverStore.pops"
        :key="index"
        class="popover"
        :show="popover.show"
    />
</template>

<style lang="scss" scoped>
.popover {
    z-index: 100;
}
</style>
