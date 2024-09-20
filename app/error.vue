<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
    error: Object as () => NuxtError,
})

const UIStore = useUIStore()
UIStore.setAside(['blog_log'])

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <ZSidebar />
    <div id="content">
        <main>
            <div class="app-error">
                <Icon name="solar:siren-rounded-bold-duotone" />
                <h2>出错了 - {{ error?.statusCode }}</h2>
                <!-- TODO: Shiki 高亮错误信息 -->
                <!-- <Shiki :code="error?.message" /> -->
                <pre>{{ error?.message }}</pre>
                <ZButton @click="handleError">
                    返回主页
                </ZButton>
            </div>
            <ZFooter />
        </main>
        <ZAside v-if="!$route.meta.hideAside" />
    </div>
</template>

<!-- eslint-disable-next-line vue/enforce-style-attribute -->
<style lang="scss">
// [...slug].vue #empty 复用了此样式
.app-error {
    text-align: center;
    color: var(--c-text-3);

    > * {
        margin: 2rem auto;
    }

    > .iconify {
        margin-top: 1.5em;
        font-size: 5rem;
    }

    // 短则居中，长则换行
    pre {
        width: fit-content;
        padding: 1rem;
        white-space: pre-wrap;
        word-break: break-all;
        text-align: left;
    }
}
</style>
