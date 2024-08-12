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
        <ZRawLink :to="prev?._path" class="prev ">
            <Icon name="ph:arrow-circle-left-duotone" />
            <span class="title">
                {{ prev?.title ?? '无更早文章' }}
            </span>
        </ZRawLink>
        <ZRawLink :to="next?._path" class="next">
            <Icon name="ph:arrow-circle-right-duotone" />
            <span class="title">
                {{ next?.title ?? '无更新文章' }}
            </span>
        </ZRawLink>
    </div>
</template>

<style lang="scss" scoped>
.surround-post {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;

    >a {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        transition: all 0.2s;

        &:not([href]) {
            color: var(--c-text-3);
        }

        &[href]:hover {
            color: var(--c-primary-1);
        }
    }

    .iconify {
        font-size: 2rem;
    }

    .next {
        align-items: flex-end;
        text-align: right;
    }
}
</style>
