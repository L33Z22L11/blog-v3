<script setup lang="ts">
const appConfig = useAppConfig()

function initTwikoo() {
    (window as any).twikoo?.init?.({
        envId: appConfig.twikoo.envId,
        el: '#twikoo',
    })
}

// 从其他页面路由至文章页面时，通过 onLoaded 事件初始化，onMounted 不起作用
useScriptTag(appConfig.twikoo.js, () => initTwikoo(), { defer: true })
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

    .tk-input {
        font-family: var(--font-monospace);
    }

    .tk-time {
        color: var(--c-text-3);
    }

    .tk-main {
        margin-top: -0.1rem;
    }

    .tk-content {
        margin-top: 0.1rem;

        img {
            border-radius: 0.5em;
        }
    }

    .tk-comments-title, .tk-nick > strong {
        font-weight: var(--font-weight-medium);
    }

    pre {
        border-radius: 0.5rem;
        font-size: 0.8125rem;
    }

    p {
        margin: 0.2em 0;
    }

    // 段间距
    br {
        content: "";
        display: block;
        height: 0.2em;
    }

    menu, ol, ul {
        margin-block: 0.5em;
        padding: 0 0 0 1.5em;
        list-style: revert;

        &::marker {
            color: var(--c-text-2);
        }

        > li {
            margin: 0.2em 0;

            &::marker {
                font-size: 0.8em;
            }
        }
    }

    blockquote {
        margin: 0.5em 0;
        padding: 0.2em 0.5em;
        border-left: 4px solid var(--c-border);
        border-radius: 4px;
        background-color: var(--c-bg-2);
        font-size: 0.9rem;

        > .z-codeblock {
            margin: 0 -0.8rem;
        }
    }

    .tk-owo-emotion {
        width: auto;
        height: 1.4em;
        vertical-align: text-bottom;
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
