<script lang="ts" setup>
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import type { Link } from '~/types/friend'

const props = defineProps<Link>()
const friendCard = ref<HTMLElement>()

const mainDomain = getMainDomain(props.link)

const tip = joinWithBR(props.desc, props.link, props.comment)

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
        <NuxtImg class="icon" :src="props.icon" alt="Icon" />
        <div class="card-info">
            <p><span class="name">{{ props.name }}</span> <span class="title">{{ title }}</span></p>
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
    width: 3rem;
    height: 3rem;
    border-radius: 4rem;
    box-shadow: 2px 4px 0.5rem var(--ld-shadow);
    background-color: white;
}

.card-info {
    display: grid;
    justify-items: start;
    gap: 2px;

    .title {
        font-size: 0.8em;
        color: var(--c-text-3);
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
