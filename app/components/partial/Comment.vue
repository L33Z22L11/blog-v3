<script setup>
const appConfig = useAppConfig()

function initTwikoo() {
    window.twikoo?.init?.({
        envId: appConfig.twikoo.envId,
        el: '#twikoo',
    })
}

// 从其他页面路由至文章页面时，通过 onLoaded 事件初始化，onMounted 不起作用
useScriptTag(appConfig.twikoo.js, () => initTwikoo(), {
    defer: true,
    onerror: () => {
        console.error('Twikoo评论区加载失败')
    },
})

// 在文章页面之间路由时不会触发 onLoaded 事件，需要手动初始化
onMounted(() => initTwikoo())
</script>

<template>
    <section class="z-comment">
        <h3>评论区</h3>
        <ClientOnly>
            <div id="twikoo" />
            <template #fallback>
                <p id="twikoo">
                    评论加载中...
                </p>
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
    margin: 2em 0;

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
        mask: linear-gradient(#fff 50%, transparent);
    }

    .tk-expand {
        border-radius: 0.5rem;
        transition: background-color 0.1s;
    }
}
</style>
