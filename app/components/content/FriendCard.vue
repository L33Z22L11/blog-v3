<script lang="ts" setup>
import tippy from 'tippy.js'
import type { Friend } from '~/types/friend'
import 'tippy.js/dist/tippy.css'

const props = defineProps<Friend>()
const friendCard = ref<HTMLElement>()

const mainDomain = getMainDomain(props.link)

const tip = joinWithBR(props.desc, `${props.date ?? ''} ${props.link}`, props.comment)

onMounted(() => {
    tippy(unrefElement(friendCard)!, {
        allowHTML: true,
        delay: [200, 0],
        content: tip,
    })
})
</script>

<template>
    <!-- 覆盖掉 noreferrer，情绪价值给足 -->
    <ZRawLink ref="friendCard" class="friend-card gradient-card" :to="link" rel="noopener">
        <NuxtImg class="icon" :src="icon" :alt="name" />
        <div class="card-info">
            <div class="name-title">
                <span class="name">{{ name }}</span>
                <span class="title">{{ title }}</span>
            </div>
            <span class="domain" :class="{ 'domain-zhilu': mainDomain === 'thisis.host' }">
                {{ mainDomain }}
            </span>
        </div>
    </ZRawLink>
</template>

<style scoped lang="scss">
.friend-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: fit-content;
    margin: 1rem auto;
    padding: 0.5rem;
    line-height: initial;

    &:hover {
        transform: translateY(-2px);
    }

    @media (max-width: $breakpoint-phone) {
        flex-direction: column;
    }
}

.icon {
    width: 3em;
    height: 3em;
    border-radius: 4em;
    box-shadow: 2px 4px 0.5em var(--ld-shadow);
    background-color: white;
}

.card-info {
    @media (max-width: $breakpoint-phone) {
        text-align: center;

        .name-title {
            flex-direction: column;
        }
    }

    .name-title {
        display: flex;
        align-items: center;
        gap: 0 0.2em;

        .title {
            opacity: 0.4;
            font-size: 0.8em;
        }
    }

    .domain {
        opacity: 0.5;
        padding: 0 0.2em;
        border-radius: 4px;
        background: var(--c-bg-soft);
        font-size: 0.8em;
    }
}
</style>
