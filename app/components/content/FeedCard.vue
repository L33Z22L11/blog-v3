<script setup lang="ts">
import type { FeedEntry } from '~/types/feed'
import { ZRawLink } from '#components'

const props = defineProps<FeedEntry>()
const mainDomain = computed(() => getMainDomain(props.link, true))
const domainIcon = computed(() => getDomainIcon(props.link))
</script>

<template>
    <Tooltip :delay="200" interactive hide-on-click="toggle">
        <ZRawLink
            class="feed-card gradient-card"
            :to="error ? undefined : link"
            :data-error="error"
        >
            <div class="avatar">
                <NuxtImg :src="avatar ?? icon" :alt="author" loading="lazy" :title="feed ? undefined : '无订阅源'" />
                <Icon v-if="!feed" class="no-feed" name="ph:bell-simple-slash-bold" />
            </div>
            <span class="name">{{ author }}</span>
            <span class="title">{{ sitenick }}</span>
        </ZRawLink>
        <template #content>
            <div class="site-content">
                <NuxtImg class="site-icon" :src="icon" :alt="title ?? sitenick ?? author" />
                <div class="site-info">
                    <h3>{{ title ?? sitenick ?? author }}</h3>
                    <code class="domain" :title="getDomainType(mainDomain)">
                        <span>{{ getDomain(link) }}</span>
                        <Icon v-if="domainIcon" class="domain-mark" :name="domainIcon" />
                    </code>
                </div>
                <Icon
                    v-for="arch in archs" :key="arch"
                    class="arch" :name="getArchIcon(arch)" :title="arch"
                />
            </div>
            <div class="desc-content">
                <div class="date">
                    {{ date }}
                </div>
                <p>{{ error ?? desc }}</p>
                <p v-if="comment">
                    <Icon name="ph:chat-centered-dots-bold" /> {{ comment }}
                </p>
            </div>
        </template>
    </Tooltip>
</template>

<style lang="scss" scoped>
.feed-card {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    width: fit-content;
    margin: 1rem auto;
    padding: 0.5rem;
    line-height: initial;
    animation: float-in 0.2s var(--delay) backwards;

    &:hover {
        transform: translateY(-2px);
    }

    &[data-error] {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .avatar {
        position: relative;
        margin: 0 0.5rem 0 0;

        img {
            display: block;
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 4em;
            box-shadow: 2px 4px 0.5em var(--ld-shadow);
            background-color: white;
            object-fit: cover;
        }

        .no-feed {
            position: absolute;
            right: -0.5em;
            bottom: 0;
        }
    }

    .title {
        opacity: 0.4;
        font-size: 0.8em;
    }

    .no-feed {
        opacity: 0.6;
        font-size: 0.8em;
    }
}

// https://vue-tippy.netlify.app/props#appendto
// Tooltip 位于组件根部时，interactive tippy 会插入到父组件
:deep() ~ [data-tippy-root] > .tippy-box {
    padding: 0;

    &[data-placement="top"] > .tippy-svg-arrow {
        fill: var(--c-bg-1);
    }
}

.site-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5em 1em;

    .site-icon {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.2em;
        object-fit: contain;
    }

    .site-info {
        flex: 1;

        .domain {
            font-size: 0.9em;
        }

        .domain-mark {
            font-size: 0.4rem;
            vertical-align: super;
        }
    }
}

.desc-content {
    position: relative;
    overflow: hidden;
    padding: 0.5em 1em;
    border-radius: 0 0 0.5em 0.5em;
    background-color: var(--c-bg-1);

    p + p {
        margin-top: 0.5em;
    }

    .date {
        position: absolute;
        opacity: 0.1;
        right: -0.1em;
        bottom: -0.3em;
        font-size: 3em;
        font-weight: bold;
        white-space: nowrap;
        pointer-events: none;
    }
}
</style>
