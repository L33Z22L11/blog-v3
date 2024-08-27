<script setup lang="ts">
const route = useRoute()
const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const { data } = await useAsyncData(
    route.path,
    () => queryContent(route.path).findOne(),
    { watch: [() => route.path] },
)
const toc = computed(() => data.value?.body?.toc)
const { activeTocItem } = useTOCAutoHighlight(toc.value?.links ?? [])
</script>

<template>
    <DefineTemplate v-slot="{ tocItem }">
        <ol>
            <li v-for="(entry, index) in tocItem" :key="index" :class="{ active: entry.id === activeTocItem }">
                <!-- 若使用 NuxtLink 则键盘焦点不会切换 -->
                <a :href="`#${entry?.id}`">{{ entry.text }}</a>
                <ReuseTemplate v-if="entry.children?.length" :toc-item="entry.children" />
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
        <ReuseTemplate v-if="toc?.links?.length" :toc-item="toc.links" />
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
        width: 2px;
        border-radius: 1rem;
        background-color: var(--c-bg-3);
    }

    ol {
        padding-left: 0;
        list-style: none;

        li {
            padding-left: 1em;
            color: var(--c-text-2);

            &:not(:has(.active)) {
                font-size: 0.95em;
                color: var(--c-text-3);
            }

            &.active {
                font-size: 1em;
                color: var(--c-text);

                &::before {
                    content: "";
                    position: absolute;
                    left: 0.3rem;
                    height: 1em;
                    padding: 0.8rem 1px;
                    border-radius: 1rem;
                    background-color: var(--c-primary-1);
                }
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
    }
}

.no-toc {
    padding: 1em;
    text-align: center;
    color: var(--c-text-3);
}
</style>
