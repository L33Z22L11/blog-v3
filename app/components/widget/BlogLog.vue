<script setup lang="ts">
import blogLog from '~/assets/blog_log'

const timeline = blogLog.timeline
</script>

<template>
    <h3 class="widget-title">
        更新日志
    </h3>
    <div class="widget-card">
        <ul>
            <li v-for="item in timeline" :key="item.date">
                <small>{{ new Date(item.date).toLocaleDateString('en-CA') }}</small><br>
                {{ item.content }}
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.widget-card {
    line-height: 1.5;
}
</style>
