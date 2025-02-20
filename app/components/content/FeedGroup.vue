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
        <TransitionGroup tag="menu" class="feed-list" appear name="float-in">
            <li
                v-for="entry in group.entries"
                :key="entry.link"
                :style="`--delay: ${(Math.random() * .8).toFixed(2)}s;`"
                data-allow-mismatch="style"
            >
                <FeedCard v-bind="entry" />
            </li>
        </TransitionGroup>
    </section>
</template>

<style lang="scss" scoped>
.feed-label {
    margin: 2rem 1rem -1rem;
}

.feed-group {
    // position: relative;
    container-type: inline-size;
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
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
    gap: 0.2rem 0.5rem;
    margin: 1rem auto;

    @mixin feed-narrow {
        grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
        font-size: 0.9em;

        :deep(.feed-card) {
            flex-direction: column;
            text-align: center;

            .avatar.avatar {
                margin: 0 0 0.2rem;
            }
        }
    }

    @media (max-width: $breakpoint-phone) {
        @include feed-narrow;
    }

    @container (max-width: #{$breakpoint-phone}) {
        @include feed-narrow;
    }
}

:deep(.feed-card.feed-card) {
    width: auto;
    margin: 0;
}
</style>
