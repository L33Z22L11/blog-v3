<script lang="ts" setup>
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import type { Friend } from '~/types/friend'

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
    <ZRawLink ref="friendCard" class="friend-card gradient-card" :to="props.link" rel="noopener">
        <NuxtImg class="icon" :src="props.icon" :alt="name" />
        <div class="card-info">
            <div><span class="name">{{ name }}</span> <span class="title">{{ title }}</span></div>
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
    line-height: 1.2em;

    &:hover {
        transform: translateY(-2px);
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
    display: grid;
    justify-items: start;
    gap: 2px;

    .title {
        opacity: 0.4;
        font-size: 0.8em;
    }

    .domain {
        opacity: 0.5;
        padding: 0 0.2em;
        border-radius: 4px;
        background: var(--c-primary-soft);
        font-size: 0.8em;
    }
}
</style>
