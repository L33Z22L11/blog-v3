<script setup lang="ts">
import { format } from 'date-fns'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import type ArticleProps from '~/types/article'

const props = defineProps<{
    to?: string
    useUpdated?: boolean
} & ArticleProps>()

const labelDate = props.useUpdated ? props.updated : props.date
const dateLabel = computed(() => format(new Date(labelDate), 'MM-dd'))
const auxDateLabel = computed(() => format(new Date(props.date), isSameYear(props.updated, props.date) ? 'MM-dd' : 'yyyy-MM-dd'))

const articleCard = ref<HTMLAnchorElement>()
const tip = joinWithBR(props.excerpt || props.description, props.link || props.to)

onMounted(() => {
    tippy(unrefElement(articleCard), {
        allowHTML: true,
        content: tip,
        delay: [200, 0],
    })
})
</script>

<template>
    <li class="article-line">
        <time :datetime="labelDate">{{ dateLabel }}</time>
        <ZRawLink ref="articleCard" class="article-link gradient-card" :to="to">
            <span class="article-title">
                {{ title }}
            </span>
            <time v-if="useUpdated" class="aux-date" :datetime="labelDate">·{{ auxDateLabel }}</time>
            <NuxtImg v-if="cover" class="article-cover" :src="cover" :alt="title" />
        </ZRawLink>
    </li>
</template>

<style lang="scss" scoped>
.article-line {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 0.5rem;
    text-shadow: 0 0 4px var(--c-bg-1);

    @media (max-width: $breakpoint-mobile) {
        font-size: 0.9em;
    }

    @media (max-width: $breakpoint-phone) {
        font-size: 0.8em;
    }

    time {
        display: inline-block;
        color: var(--c-text-3);
        transition: color 0.2s;
    }

    &:hover > time {
        color: var(--c-text-1);
    }
}

.article-link {
    overflow: hidden;
    padding: 0.3rem 0.6rem;

    &:hover {
        .article-cover {
            width: 50%;
            object-position: center 44%;
        }
    }
}

.article-cover {
    position: absolute;
    top: 0;
    right: 0;
    width: min(50%, 180px);
    height: 100%;
    margin: 0;
    mask: linear-gradient(to right, transparent, var(--c-bg-a50));
    transition: 0.2s;
    object-fit: cover;
    z-index: -1;
}
</style>
