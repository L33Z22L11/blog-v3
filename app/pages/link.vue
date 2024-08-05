<script setup lang="ts">
import friends from '~/assets/friend'

useHead({ title: '友链' })
definePageMeta({
    aside: false,
})
</script>

<template>
    <ZFriendGroup v-for="friendGroup in friends" :key="friendGroup.name" v-bind="friendGroup" />
</template>
