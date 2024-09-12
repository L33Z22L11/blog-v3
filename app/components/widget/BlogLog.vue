<script setup lang="ts">
const timeEstablished = useAppConfig().timeEstablished

const blogLog = [
    {
        date: timeEstablished,
        content: '发布第一篇文章',
    },
    {
        date: '2020-08-24',
        content: '更换到当前域名',
    },
    {
        date: '2023-05-24',
        content: '更换框架为 Hexo，升级博客',
    },
    {
        date: '2024-08-11',
        content: 'Nuxt Content 重构博客上线',
    },
    {
        date: '2030-08-10',
        content: '域名到期，预计会提前重定向迁移，届时会通知友链中的各位',
    },
]
</script>

<template>
    <h3 class="widget-title">
        更新日志
    </h3>
    <!-- TODO: timeline style -->
    <div class="widget-card">
        <ul>
            <li v-for="(item, index) in blogLog" :key="index">
                <small>{{ item.date }}</small><br>
                {{ item.content }}
            </li>
        </ul>
    </div>
</template>
