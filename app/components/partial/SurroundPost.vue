<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(`surround-${route.path}`, () => queryContent()
    .only(['_path', 'title', 'date', 'type'])
    .sort({ date: 1 })
    .where({ _original_dir: { $eq: '/posts' } })
    .findSurround(route.path))
const [prev, next] = data.value ?? []
</script>

<template>
    <div class="surround-post">
        <ZRawLink :to="next?._path" class="next">
            <Icon name="solar:rewind-back-bold-duotone" />
            <div v-if="next">
                <h4 class="title" :class="{ story: next?.type === 'story' }">
                    {{ next.title }}
                </h4>
                <time datetime="{{ next?.date }}">{{ getPostTime(next.date) }}</time>
            </div>
            <h4 v-else>
                新故事即将发生
            </h4>
        </ZRawLink>
        <ZRawLink :to="prev?._path" class="prev">
            <div v-if="prev">
                <h4 class="title" :class="{ story: prev?.type === 'story' }">
                    {{ prev.title }}
                </h4>
                <time datetime="{{ prev?.date }}">{{ getPostTime(prev.date) }}</time>
            </div>
            <h4 v-else>
                已抵达时间尽头
            </h4>
            <Icon name="solar:rewind-forward-bold-duotone" />
        </ZRawLink>
    </div>
</template>

<style lang="scss" scoped>
.surround-post {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 3rem 1rem;

    >a {
        display: flex;
        align-items: center;
        gap: 0.5em;
        transition: all 0.2s;

        &:not([href]) {
            color: var(--c-text-3);
            cursor: not-allowed;
        }

        time {
            opacity: 0.6;
            font-size: 0.8rem;
        }

        .story {
            font-family: var(--font-serif);
        }

        &.prev {
            text-align: right;
        }

        > .iconify {
            opacity: 0.5;
            font-size: 2rem;
            transition: all 0.2s;
        }

        &[href]:hover {
            gap: 0;
            color: var(--c-primary-1);

            > .iconify {
                opacity: 0.2;
                transform: scale(2);
            }
        }
    }
}
</style>
