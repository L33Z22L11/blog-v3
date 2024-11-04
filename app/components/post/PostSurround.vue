<script setup lang="ts">
import type ArticleProps from '~/types/article'

const route = useRoute()

const { data: surrounds } = await useAsyncData(`surround-${route.path}`, () => queryContent()
    .only(['_path', 'date', 'title', 'type'])
    .sort({ date: 1 })
    .where({ _original_dir: { $eq: '/posts' } })
    .findSurround(route.path))

const [prev = null, next = null] = surrounds.value ?? []

const [DefineTemplate, ReuseTemplate] = createReusableTemplate<{
    post: ArticleProps | null
    icon: string
    fallbackIcon: string
    fallbackText: string
}>()
</script>

<template>
    <DefineTemplate v-slot="{ post, icon, fallbackIcon, fallbackText }">
        <ZRawLink :to="post?._path" class="surround-link">
            <Icon :name="post ? icon : fallbackIcon" />
            <div>
                <h4 class="title" :class="{ 'text-story': post?.type === 'story' }">
                    {{ post?.title || fallbackText }}
                </h4>
                <time v-if="post" :datetime="post.date">{{ getPostDate(post.date) }}</time>
            </div>
        </ZRawLink>
    </DefineTemplate>

    <div v-if="prev || next" class="surround-post">
        <ReuseTemplate
            :post="next" icon="solar:rewind-back-bold-duotone"
            fallback-icon="solar:document-add-bold-duotone" fallback-text="新故事即将发生"
        />
        <ReuseTemplate
            :post="prev" class="align-right" icon="solar:rewind-forward-bold-duotone"
            fallback-icon="solar:reel-bold-duotone" fallback-text="已抵达博客尽头"
        />
    </div>
</template>

<style lang="scss" scoped>
.surround-post {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 3rem 1rem;
}

.surround-link {
    display: flex;
    align-items: center;
    gap: 0.5em;
    transition: all 0.2s;

    &:not([href]) {
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

    &.align-right {
        flex-direction: row-reverse;
        text-align: right;
    }

    > .iconify {
        opacity: 0.5;
        font-size: 2rem;
        transition: all 0.2s;
    }

    &[href]:hover {
        gap: 0;
        color: var(--c-primary);

        > .iconify {
            opacity: 0.2;
            transform: scale(2);
        }
    }
}
</style>
