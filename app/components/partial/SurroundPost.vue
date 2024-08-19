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
        <ZRawLink v-if="next" :to="next?._path" class="next">
            <Icon name="solar:rewind-back-bold-duotone" />
            <div>
                <h4 class="title" :class="{ story: next?.type === 'story' }">
                    {{ next.title }}
                </h4>
                <time datetime="{{ next?.date }}">{{ getPostTime(next.date ?? 0) }}</time>
            </div>
        </ZRawLink>
        <div v-else class="disabled">
            <Icon name="solar:document-add-bold-duotone" />
            新故事即将发生
        </div>

        <ZRawLink v-if="prev" :to="prev?._path" class="prev">
            <div>
                <h4 class="title" :class="{ story: prev?.type === 'story' }">
                    {{ prev.title }}
                </h4>
                <time datetime="{{ prev?.date }}">{{ getPostTime(prev.date ?? 0) }}</time>
            </div>
            <Icon name="solar:rewind-forward-bold-duotone" />
        </ZRawLink>
        <div v-else class="disabled">
            已抵达博客尽头
            <Icon name="solar:reel-bold-duotone" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.surround-post {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 3rem 1rem;

    > * {
        display: flex;
        align-items: center;
        gap: 0.5em;
        transition: all 0.2s;

        &.disabled {
            color: var(--c-text-3);
            user-select: none;

            > .iconify {
                opacity: 0.8;
            }
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
