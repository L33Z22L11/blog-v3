<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError,
})

const UIStore = useUIStore()
UIStore.setAside(['blog_log'])

onMounted(() => {
    console.error(props.error)
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <ZSidebar />
    <div id="content">
        <main>
            <div class="app-error">
                <ZError
                    :code="error?.message"
                    :message="error?.url"
                    :title="`出错了 - ${error?.statusCode} ${error?.statusMessage}`"
                >
                    <ZButton @click="handleError">
                        返回主页
                    </ZButton>
                </ZError>
            </div>
            <ZFooter />
        </main>
        <ZAside v-if="!$route.meta.hideAside" />
    </div>
</template>

<style scoped lang="scss">
.app-error {
    margin: 1rem;

    pre {
        text-align: left;
    }

    .error-stack {
        font-size: 0.9em;
        white-space: pre-wrap;
    }
}
</style>
