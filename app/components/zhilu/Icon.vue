<script setup lang="ts">
import blogConfig from '~~/blog.config'
</script>

<template>
    <NuxtImg
        alt=""
        class="icon"
        :src="blogConfig.favicon"
    />
</template>

<style scoped>
.icon {
    width: 1.2em;
    vertical-align: text-bottom;
}
</style>
