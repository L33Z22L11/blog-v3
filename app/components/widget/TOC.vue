<script setup lang="ts">
const route = useRoute()
const [DefineTemplate, ReuseTemplate] = createReusableTemplate()

const { data } = await useAsyncData(route.path, () =>
    queryContent(route.path).findOne())
const toc = computed(() => data.value?.body?.toc)
</script>

<template>
    <DefineTemplate v-slot="{ tocItem }">
        <ul>
            <li v-for="(entry, index) in tocItem" :key="index">
                <a :href="`#${entry?.id}`">
                    {{ entry.text }}
                </a>
                <ReuseTemplate v-if="entry.children?.length" :toc-item="entry.children" />
            </li>
        </ul>
    </DefineTemplate>

    <h3 class="widget-title">
        文章目录
    </h3>
    <div class="widget-card">
        <ReuseTemplate v-if="toc?.links?.length" :toc-item="toc.links" />
        <p v-else>
            暂无目录信息
        </p>
    </div>
</template>

<style lang="scss" scoped>
.widget-card {
    ul {
        padding-left: 0;
        line-height: 1.5;
        list-style: none;

        li {
            padding-left: 0.5rem;

            a {
                font-size: 0.9em;
                color: var(--c-text-2);
                transition: 0.2s;

                &:hover {
                    color: var(--c-text-1);
                }
            }
        }
    }
}
</style>
