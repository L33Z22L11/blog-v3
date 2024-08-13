<script setup lang="ts">
const route = useRoute()
const { data } = await useAsyncData(`surround-${route.path}`, () => queryContent()
    .only(['_path', 'title'])
    .sort({ date: 1 })
    .where({ _original_dir: { $eq: '/posts' } })
    .findSurround(route.path))
const [prev, next] = data.value ?? []
</script>

<template>
    <div class="surround-post">
        <ZRawLink :to="prev?._path" class="prev">
            <Icon name="solar:rewind-back-bold-duotone" />
            <span class="title">
                {{ prev?.title ?? '已抵达时间尽头' }}
            </span>
        </ZRawLink>
        <ZRawLink :to="next?._path" class="next">
            <span class="title">
                {{ next?.title ?? '新故事即将发生' }}
            </span>
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

        &.next {
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
                transform: scale(2);
            }
        }
    }
}
</style>
