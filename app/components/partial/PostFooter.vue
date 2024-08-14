<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'
import type ArticleProps from '~/types/article'

defineProps<ArticleProps & ParsedContent>()
const appConfig = useAppConfig()
</script>

<template>
    <div class="post-footer">
        <section v-if="references" class="reference">
            <div class="title">
                参考链接
            </div>
            <div class="content">
                <ul>
                    <li v-for="(link, index) in references" :key="index">
                        <ZLink :to="link.link">
                            {{ link.title }}
                        </ZLink>
                    </li>
                </ul>
            </div>
        </section>
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
    border: 1px solid var(--c-border);
    border-radius: 1rem;
    background-color: var(--c-bg-3);
}

section {
    padding: 1rem;

    & + & {
        border-top: 1px solid var(--c-border);
    }
}

.title {
    font-size: 1.2rem;
    font-weight: bold;
}

.content {
    font-size: 0.9rem;

    > * {
        margin-top: 0.5em;
    }
}
</style>
