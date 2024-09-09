<script setup lang="ts">
import type { ArticleCategory } from '~/types/article'
import type ArticleProps from '~/types/article'

const props = defineProps < { useUpdated: boolean } & ArticleProps>()

const appConfig = useAppConfig()

const publishedLabel = getPostDate(props.date)
const updatedLabel = getPostDate(props.updated)

const categoryLabel = props.categories?.[0] as ArticleCategory
const categoryColor = appConfig.article.categories?.[categoryLabel]?.color
const categoryIcon = computed(() => appConfig.article.categories?.[categoryLabel]?.icon)
</script>

<template>
    <ZRawLink class="article-card card">
        <NuxtImg v-if="cover" class="article-cover" :src="cover" :alt="title" loading="lazy" />
        <article>
            <h2 class="article-title" :class="{ 'text-story': type === 'story' }">
                {{ title }}
            </h2>
            <p class="article-descrption">
                {{ description }}
            </p>
            <div class="article-info" data-allow-mismatch>
                <time v-if="!useUpdated" :datetime="date">
                    <Icon name="ph:calendar-dots-bold" />
                    {{ publishedLabel }}
                </time>
                <time v-if="publishedLabel !== updatedLabel" :datetime="updated">
                    <Icon name="ph:calendar-plus-bold" />
                    {{ updatedLabel }}
                </time>
                <time v-if="useUpdated" :datetime="date">
                    <Icon name="ph:calendar-dots-bold" />
                    {{ publishedLabel }}
                </time>
                <span
                    v-if="categoryLabel"
                    class="article-category"
                    :style="{ '--cg-color': categoryColor }"
                >
                    <Icon :name="categoryIcon" />
                    {{ categoryLabel }}
                </span>
                <span class="article-words">
                    <Icon name="ph:paragraph-bold" />
                    {{ readingTime?.words }}字
                </span>
            </div>
        </article>
    </ZRawLink>
</template>

<style lang="scss" scoped>
.article-card {
    container-type: inline-size;
    display: block;
    position: relative;
    border-radius: 0.8rem;
    color: var(--c-text);

    &:hover {
        .article-cover {
            opacity: 1;
        }
    }

    & + & {
        margin-top: 1rem;
    }

    > article {
        padding: 0.5rem 1rem;

        > * {
            margin: 0.7rem 0;
        }
    }
}

.article-info {
    display: flex;
    gap: 0.5em 1.2em;
    column-gap: clamp(1em, 3cqw, 1.5em);
    font-size: 0.8em;
    flex-wrap: wrap;
    color: var(--c-text-2);

    > * {
        display: inline-flex;
        align-items: center;
        gap: 0.2em;
    }
}

.article-title {
    font-size: 1.2em;
    font-weight: var(--font-weight-normal);
    color: var(--c-text);
}

.article-descrption {
    font-size: 0.9em;
    color: var(--c-text-2);
}

.article-category {
    color: var(--cg-color);
}

.article-cover {
    position: absolute;
    opacity: 0.8;
    top: 0;
    right: 0;
    width: min(320px, 50%);
    height: 100%;
    margin: 0;
    mask: linear-gradient(to right, transparent, #fff 50%);
    transition: all 0.2s;
    object-fit: cover;

    & + * {
        position: relative;
        width: 60%;
        text-shadow: 0 0 0.5rem var(--ld-bg-card), 0 0 1rem var(--ld-bg-card);
    }

    @mixin cover-narrow {
        position: initial;
        width: 100%;
        height: auto;
        max-width: none;
        max-height: 256px;
        aspect-ratio: 2.4;
        margin-bottom: -10%;
        mask: linear-gradient(#fff 50%, transparent);

        & + * {
            width: auto;
        }
    }

    @media (max-width: $breakpoint-phone) {
        @include cover-narrow;
    }

    @container (max-width: #{$breakpoint-phone}) {
        @include cover-narrow;
    }
}
</style>
