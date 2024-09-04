<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

const timeEstablished = '2019-07-20'
const timeUpdated = runtimeConfig.public.buildTime as string

const bloglog = [
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
        date: new Date().toLocaleDateString('en-CA'),
        content: `运营${timeElapse(timeEstablished)}，${timeElapse(timeUpdated)}前更新，无要事相告`,
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
            <li v-for="(item, index) in bloglog" :key="index" data-allow-mismatch="text">
                <small>{{ item.date }}</small><br>
                {{ item.content }}
            </li>
        </ul>
    </div>
</template>
