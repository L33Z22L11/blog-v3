<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
    error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <ZSidebar />
    <div id="content">
        <main>
            <ZHeader />
            <div class="app-error">
                <Icon name="solar:siren-rounded-bold-duotone" />
                <h2>出错了 - {{ error?.statusCode }}</h2>
                <pre>{{ error?.message }}</pre>
                <ZButton @click="handleError">
                    返回主页
                </ZButton>
            </div>
            <ZFooter />
        </main>
        <ZAside v-if="$route.meta.aside !== false" />
    </div>
</template>

<style lang="scss">
.app-error {
    text-align: center;
    color: var(--c-text-3);

    >* {
        margin: 2rem auto;
    }

    >.iconify {
        font-size: 5rem;
    }

    pre {
        width: fit-content;
        padding: 1rem;
        white-space: pre-wrap;
        word-break: break-all;
        text-align: left;
    }
}
</style>
