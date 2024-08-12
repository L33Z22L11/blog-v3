<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'
import type ArticleProps from '~/types/article'

defineProps<ArticleProps & ParsedContent>()
const appConfig = useAppConfig()
</script>

<template>
    <div class="post-footer">
        <section class="license">
            <div class="title">
                许可协议
            </div>
            <div class="content">
                <p>
                    本文采用 <ZLink :to="appConfig.copyright.url">
                        {{ appConfig.copyright.name }}
                    </ZLink>
                    许可协议，转载请注明出处。
                </p>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.post-footer {
    margin: 2rem 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--c-border);
    border-radius: 1rem;
    background-color: var(--c-bg-3);
}

.title {
    margin: 0.5rem 0;
    font-size: 1.2rem;
    font-weight: bold;
}

.content {
    font-size: 0.9rem;

    p {
        margin: 0.5em 0;
    }
}
</style>
