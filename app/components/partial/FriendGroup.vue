<script lang="ts" setup>
import type { LinkGroup } from '~/types/friend'

defineProps<LinkGroup>()
</script>

<template>
    <div class="friend-group">
        <h2 class="friend-title">
            {{ name }}
        </h2>
        <p class="friend-desc">
            {{ desc }}
        </p>
        <ul class="friend-list">
            <li v-for="friend in items" :key="friend.name" class="friend-card">
                <ZFriendCard v-bind="friend" />
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.friend-group {
    margin: 1rem;

    &:hover > .friend-title {
        color: var(--c-text-3);
    }
}

.friend-title {
    position: sticky;
    opacity: 0.5;
    top: 0;
    margin-bottom: -2rem;
    mask: linear-gradient(var(--c-bg-1) 50%, transparent);
    font-size: 5rem;
    text-align: center;
    color: transparent;
    transition: color 0.2s;
    z-index: -1;
    -webkit-text-stroke: 1px var(--c-text-3);
}

.friend-desc {
    text-align: center;
    color: var(--c-text-2);
}

.friend-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.5rem;
    margin: 1rem auto;

    @media (width <= 460px) {
        width: 75%;
    }
}

.friend-card > a {
    width: auto;
    margin: 0;
}
</style>
