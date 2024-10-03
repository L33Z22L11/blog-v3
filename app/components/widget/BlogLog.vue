<script setup lang="ts">
const appConfig = useAppConfig()
const timeEstablished = appConfig.timeEstablished

const blogLog = [
    {
        date: timeEstablished,
        content: '发布第一篇文章',
    },
    {
        date: '2022-12-24',
        content: '更换到当前域名',
    },
    {
        date: '2022-12-24',
        content: '更换框架为 Hexo，升级博客',
    },
    {
        date: '2024-08-11',
        content: 'Nuxt Content 重构博客上线',
    },
]
</script>

<template>
    <h3 class="widget-title">
        更新日志
    </h3>
    <!-- TODO: 优化时间线样式 -->
    <div class="widget-card">
        <ul>
            <li v-for="(item, index) in blogLog" :key="index">
                <small>{{ item.date }}</small><br>
                {{ item.content }}
            </li>
        </ul>
    </div>
</template>
