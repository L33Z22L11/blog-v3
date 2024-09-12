<script setup lang="ts">
import { Autoplay } from 'swiper/modules'

import { Swiper, SwiperSlide } from 'swiper/vue'
import type ArticleProps from '~/types/article'
import 'swiper/css/scrollbar'
import 'swiper/css/bundle'

defineProps<{ list: ArticleProps[] }>()
const modules = [Autoplay]
</script>

<template>
    <div class="z-slide">
        <div class="z-slide-title">
            <span class="title">精选文章</span>
            <div class="tip">
                <Icon name="ph:hand-grabbing-bold" />拖拽查看
            </div>
        </div>
        <Swiper
            :autoplay="{ delay: 5000 }"
            free-mode
            :modules
            loop
            slide-to-clicked-slide
            slides-per-view="auto"
            :space-between="16"
        >
            <SwiperSlide v-for="(article, index) in list" :key="index">
                <LinkBanner
                    :banner="article.cover"
                    :title="article.title"
                    desc=" "
                    :link="article._path ?? ''"
                />
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<style lang="scss" scoped>
.z-slide-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 1rem -1.2rem;
    mask: linear-gradient(#fff, transparent);
    color: var(--c-text-3);

    .title {
        font-size: 3rem;
        font-weight: var(--font-weight-bold);
        line-height: 1;
    }
}

.swiper {
    --fadeout-width: 1rem;

    padding: 1rem var(--fadeout-width);
    mask: linear-gradient(to right, transparent, #fff var(--fadeout-width), #fff calc(100% - var(--fadeout-width)), transparent);

    .swiper-slide {
        width: 14rem;
        max-width: 100%;
    }
}

:deep(.link-banner) {
    margin: 0;
    font-size: 0.8rem;

    .link-banner-title {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
