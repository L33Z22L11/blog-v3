<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
    error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <ZSidebar />
    <div class="content">
        <ZHeader />
        <main>
            <div>
                <ZTitle>出错了 - {{ error?.statusCode }}</ZTitle>
                <div class="error-message">
                    <pre>{{ error?.message }}</pre>
                </div>
                <br>
                <ZButton @click="handleError">
                    返回主页
                </ZButton>
            </div>
        </main>
    </div>
</template>
