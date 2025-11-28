<script setup lang="ts">
const popoverStore = usePopoverStore()
const { pops } = storeToRefs(popoverStore)
</script>

<template>
<template v-for="{ vnode, zIndex, show, duration } in pops" :key="zIndex">
	<component :is="vnode" :show :duration :style="{ zIndex }" />
</template>
</template>
