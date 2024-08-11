<script setup>
const appConfig = useAppConfig()

onMounted(() => {
    const script = document.createElement('script')
    script.src = appConfig.twikoo.js
    script.type = 'text/javascript'
    script.onload = () => {
        window.twikoo.init({
            envId: appConfig.twikoo.envId,
            el: '#tk-comment',
        })
    }
    script.onerror = () => {
        console.error('Twikoo 评论区加载失败')
    }
    document.head.appendChild(script)
})

onBeforeUnmount(() => {
// 移除Twikoo脚本
})
</script>

<template>
    <ClientOnly>
        <div id="tk-comment" />
        <template #fallback>
            <p>加载评论中...</p>
        </template>
    </ClientOnly>
</template>
