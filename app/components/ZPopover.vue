<script setup lang="ts">
const popoverStore = usePopoverStore()
const { pops } = storeToRefs(popoverStore)
</script>

<template>
<template v-for="{ vnode, zIndex, isOpening, duration } in pops" :key="zIndex">
	<component :is="vnode" :is-opening :duration :style="{ zIndex }" />
</template>
</template>
