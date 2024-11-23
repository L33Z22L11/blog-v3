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
    <div v-for="group in feeds" :key="group.name" class="feed-group">
        <h3 class="feed-title">
            {{ group.name }}
        </h3>
        <p class="feed-desc">
            {{ group.desc }}
        </p>
        <menu class="feed-list">
            <li v-for="enery in group.entries" :key="enery.link" class="feed-card">
                <FeedCard v-bind="enery" />
            </li>
        </menu>
    </div>
</template>

<style lang="scss" scoped>
.feed-label {
    margin: 2rem 1rem -1rem;
}

.feed-group {
    // position: relative;
    margin: 2rem 1rem;

    &:hover > .feed-title {
        color: var(--c-text-3);
    }
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
