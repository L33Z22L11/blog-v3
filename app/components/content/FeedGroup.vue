<script setup lang="ts">
import type { FeedGroup } from '~/types/feed'

defineProps<{
    label: string
    feeds: FeedGroup[]
}>()
</script>

<template>
    <h2 class="feed-label">
        {{ label }}
    </h2>
    <section v-for="group in feeds" :key="group.name" class="feed-group">
        <h3 class="feed-title">
            {{ group.name }}
        </h3>
        <p class="feed-desc">
            {{ group.desc }}
        </p>
        <TransitionGroup tag="menu" class="feed-list" appear>
            <li
                v-for="entry, index in group.entries"
                :key="index"
                class="feed-card"
                :style="`--dalay: ${index * 0.05}s;`"
            >
                <FeedCard v-bind="entry" />
            </li>
        </TransitionGroup>
    </section>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
    transition: all 0.2s;
    transition-delay: var(--dalay);
}

.v-leave-active {
    position: absolute;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateY(10%);
}

.feed-label {
    margin: 2rem 1rem -1rem;
}

.feed-group {
    // position: relative;
    margin: 2rem 1rem;
}

.feed-title {
    position: sticky;
    opacity: 0.5;
    top: 0;
    margin-bottom: -0.3em;
    mask: linear-gradient(#fff 50%, transparent);
    font: 800 5rem/1 var(--font-stroke-free);
    text-align: center;
    color: transparent;
    transition: color 0.2s;
    z-index: -1;
    -webkit-text-stroke: 1px var(--c-text-3);

    :hover > & {
        color: var(--c-text-3);
    }
}

.feed-desc {
    text-align: center;
    color: var(--c-text-2);
}

.feed-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(12.5rem, 1fr));
    gap: 0.5rem;
    margin: 1rem auto;

    @media (max-width: $breakpoint-phone) {
        grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
        font-size: 0.9em;
    }
}

.feed-card > a {
    width: auto;
    margin: 0;
}
</style>
