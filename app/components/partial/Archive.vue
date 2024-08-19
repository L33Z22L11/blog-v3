<script setup lang="ts">
import { format } from 'date-fns'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import type ArticleProps from '~/types/article'

const props = defineProps<{
    to?: string
    useUpdated?: boolean
} & ArticleProps>()

const mainDate = computed(() => (props.useUpdated ? props.updated : props.date))
const dateLabel = computed(() => format(new Date(mainDate.value ?? 0), 'MM-dd'))
const auxDateLabel = computed(() => format(
    new Date(props.date ?? 0),
    isSameYear(props.updated, props.date) ? 'MM-dd' : 'yyyy-MM-dd',
))

const articleCard = ref<HTMLAnchorElement>()
const tip = joinWithBR(props.description, props.link || props.to)

onMounted(() => {
    tippy(unrefElement(articleCard)!, {
        allowHTML: true,
        content: tip,
        delay: [200, 0],
    })
})
</script>

<template>
    <li class="article-line">
        <time :datetime="mainDate">{{ dateLabel }}</time>
        <ZRawLink ref="articleCard" class="article-link gradient-card" :to="to">
            <span class="article-title">
                {{ title }}
            </span>
            <time v-if="useUpdated && dateLabel !== auxDateLabel" class="aux-date" :datetime="date">／{{ auxDateLabel }}</time>
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
    margin: 4px 0;
    text-shadow: 0 0 4px var(--c-bg-1);

    @media (max-width: $breakpoint-mobile) {
        font-size: 0.9em;
    }

    time {
        display: inline-block;
        opacity: 0.4;
        transition: opacity 0.2s;
    }

    &:hover > time {
        opacity: 1;
    }
}

.article-title {
    color: var(--c-text);
}

.article-link {
    overflow: hidden;
    padding: 0.3rem 0.6rem;

    &:hover {
        .article-cover {
            opacity: 1;
            width: 50%;
            object-position: center 44%;
        }
    }
}

.article-cover {
    position: absolute;
    opacity: 0.8;
    top: 0;
    right: 0;
    width: min(50%, 180px);
    height: 100%;
    margin: 0;
    mask: linear-gradient(to right, transparent, #fff7);
    transition: all 0.2s;
    object-fit: cover;
    z-index: -1;
}
</style>
