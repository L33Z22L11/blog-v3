<script lang="ts" setup>
import allMyFriends from '~/assets/friend'
</script>

<template>
    <div v-for="group in allMyFriends" :key="group.name" class="friend-group" v-bind="group">
        <h2 class="friend-title">
            {{ group.name }}
        </h2>
        <p class="friend-desc">
            {{ group.desc }}
        </p>
        <ul class="friend-list">
            <li v-for="friend in group.items" :key="friend.name" class="friend-card">
                <FriendCard v-bind="friend" />
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.friend-group {
    // position: relative;
    margin: 2rem 0;

    &:hover > .friend-title {
        color: var(--c-text-3);
    }
}

.friend-title {
    position: sticky;
    opacity: 0.5;
    top: 0;
    margin-bottom: -0.3em;
    mask: linear-gradient(#fff 50%, transparent);
    font-size: 5rem;
    line-height: 1;
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
