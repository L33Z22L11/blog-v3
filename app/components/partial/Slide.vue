<script setup lang="ts">
import Autoplay from 'embla-carousel-autoplay'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaOptionsType } from 'embla-carousel'
import type ArticleProps from '~/types/article'

defineProps<{ list: ArticleProps[] }>()

const emblaOptions = reactive<EmblaOptionsType>({
    loop: true,
    dragFree: true,
})

const [emblaRef, emblaApi] = emblaCarouselVue(emblaOptions, [Autoplay()])
</script>

<template>
    <div class="z-slide">
        <div class="z-slide-title">
            <span class="title">精选文章</span>
            <div class="tip">
                <Icon name="ph:hand-grabbing-bold" />
                拖拽查看
            </div>
        </div>
        <div ref="emblaRef" class="embla">
            <div class="slide-list">
                <ZRawLink
                    v-for="(article, index) in list"
                    :key="index"
                    class="slide-item"
                    :to="article._path"
                >
                    <NuxtImg class="cover" :src="article.cover" :alt="article.title" />
                    <div class="info">
                        {{ article.title }}
                    </div>
                </ZRawLink>
            </div>
            <ZButton class="embla-button prev" @click="emblaApi.scrollPrev()">
                <Icon name="ph:caret-left-bold" />
            </ZButton>
            <ZButton class="embla-button next" @click="emblaApi.scrollNext()">
                <Icon name="ph:caret-right-bold" />
            </ZButton>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.z-slide-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    overflow: hidden;
    height: 3rem;
    margin: 1rem;
    margin-bottom: -0.2rem;
    mask: linear-gradient(#fff, transparent);
    color: var(--c-text-3);
    flex-wrap: wrap;

    .title {
        font-size: 3rem;
        font-weight: var(--font-weight-bold);
        line-height: 1;
    }
}

.embla {
    --fadeout-width: 2rem;

    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;
    mask: linear-gradient(to right, transparent, #fff var(--fadeout-width), #fff calc(100% - var(--fadeout-width)), transparent);

    .embla-button {
        position: absolute;
        &.prev { left: 0; }
        &.next { right: 0; }
    }
}

.slide-list {
    display: flex;
    scroll-snap-type: x mandatory;

    .slide-item {
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
        width: max(12rem, 28%);
        max-width: 80%;
        aspect-ratio: 1.77;
        margin: 0 min(0.5em, 1%);
        border-radius: 0.5rem;
        scroll-snap-align: center;
        scroll-snap-stop: always;

        .cover {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .info {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            opacity: 0;
            inset: 0;
            padding: 1em;
            text-align: center;
            color: #fff;
            transition: opacity 0.2s;
        }

        &:hover > .info {
            opacity: 1;
            backdrop-filter: brightness(0.8) saturate(10) contrast(0.8) blur(2em);
        }
    }
}
</style>
