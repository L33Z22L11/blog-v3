<script setup>
const appConfig = useAppConfig()

onMounted(() => {
    const script = document.createElement('script')
    script.src = appConfig.twikoo.js
    script.type = 'text/javascript'
    script.async = true
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
    <section class="z-comment">
        <h3>评论区</h3>
        <ClientOnly>
            <div id="tk-comment" />
            <template #fallback>
                <p><br>评论加载中...</p>
            </template>
        </ClientOnly>
    </section>
</template>

<style lang="scss" scoped>
.z-comment {
    margin: 3rem 1rem;

    > h3 {
        margin-top: 3rem;
        font-size: 1.25rem;
    }
}

:deep(#twikoo) {
    .tk-admin-container {
        position: fixed;
        z-index: 1;
    }

    .tk-time {
        color: var(--c-text-3);
    }

    .tk-main {
        margin-top: -0.1rem;
    }

    .tk-content {
        margin-top: 0.1rem;
    }

    p {
        margin: 0.2em 0;
        line-height: 1.5;
    }

    br {
        content: "";
        display: block;
        height: 0.2em;
    }

    .tk-extras, .tk-footer {
        font-size: 0.7rem;
        color: var(--c-text-3);
    }

    .tk-replies:not(.tk-replies-expand) {
        mask: linear-gradient(var(--c-bg-1) 50%, transparent);
    }

    .tk-expand {
        border-radius: 0.5em;
        transition: 0.1s;
    }
}
</style>
