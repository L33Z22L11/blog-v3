<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

const route = useRoute()
const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

// 如果此处出问题，还会影响到文章获取
// 若 watch route.path，SSG 下文章间路由时新文章数据会写入老文章键中
const { data } = await useAsyncData(
    route.path,
    () => queryContent(route.path).findOne(),
)

const toc = computed(() => data.value?.body?.toc)
const { activeTocItem } = useTocAutoHighlight(() => toc.value?.links ?? [])

function hasActiveChild(entry: TocLink, activeId: string | null): boolean {
    if (entry.id === activeId)
        return true
    return entry.children?.some(child => hasActiveChild(child, activeId)) ?? false
}
</script>

<template>
    <DefineTemplate v-slot="{ tocItem }">
        <ol>
            <li
                v-for="(entry, index) in tocItem as TocLink[]"
                :key="index"
                :class="{
                    'has-active': hasActiveChild(entry, activeTocItem),
                    'active': entry.id === activeTocItem,
                }"
            >
                <!-- 使用 <a> 确保键盘焦点切换 -->
                <a :href="`#${entry?.id}`">{{ entry.text }}</a>
                <ReuseTemplate v-if="entry.children" :toc-item="entry.children" />
            </li>
        </ol>
    </DefineTemplate>

    <h3 class="widget-title">
        <span>文章目录</span>
        <div class="buttons">
            <!-- use <a> for anchor -->
            <a href="#main-content">
                <Icon name="ph:arrow-circle-up-bold" />
            </a>
            <a href="#twikoo">
                <Icon name="ph:chat-circle-text-bold" />
            </a>
        </div>
    </h3>
    <div class="widget-body">
        <ReuseTemplate v-if="toc?.links" :toc-item="toc.links" />
        <p v-else class="no-toc">
            暂无目录信息
        </p>
    </div>
</template>

<style lang="scss" scoped>
.widget-body {
    position: relative;

    &::before {
        content: "";
        position: absolute;
        inset: 0.3rem;
        width: 3px;
        border-radius: 1rem;
        background-color: var(--c-bg-3);
    }

    ol {
        padding-left: 0;
        list-style: none;

        li {
            opacity: 0.67;
            padding-left: 0.8rem;
            font-size: 0.95em;
            color: var(--c-text);

            &.has-active {
                opacity: 1;
                font-size: 1em;
            }

            &.active::before {
                content: "";
                position: absolute;
                left: 0.3rem;
                height: 1em;
                margin: 0.2rem 0;
                padding: 0.6rem 1.5px;
                border-radius: 1rem;
                background-color: var(--c-primary-1);
            }

            a {
                display: block;
                overflow: hidden;
                padding: 0.2em 0.5em;
                border-radius: 0.5em;
                white-space: nowrap;
                text-overflow: ellipsis;
                transition: all 0.2s;

                &:hover {
                    background-color: var(--c-primary-soft);
                    white-space: normal;
                    color: var(--c-text);
                }
            }
        }

        .active {
            opacity: 1;
            font-size: 1em;
        }
    }
}

.no-toc {
    padding: 1em;
    text-align: center;
    color: var(--c-text-3);
}
</style>
