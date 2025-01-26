<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
    <NuxtImg
        alt=""
        class="icon"
        :src="appConfig.favicon"
    />
</template>

<!-- eslint-disable-next-line vue/block-lang -->
<style scoped>
.avatar {
    width: 1.2em;
    vertical-align: text-bottom;
}
</style>
