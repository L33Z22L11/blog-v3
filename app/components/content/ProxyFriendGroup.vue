<script lang="ts" setup>
import friends from '~/assets/friend'
</script>

<template>
    <ZFriendGroup v-for="friendGroup in friends" :key="friendGroup.name" v-bind="friendGroup" />
</template>

<style scoped lang="scss">
:deep(ul) {
    padding: 0;
    list-style: none;
}
</style>
