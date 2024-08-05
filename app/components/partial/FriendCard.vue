<script lang="ts" setup>
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import type { Link } from '~/types/friend'

const props = defineProps<Link>()
const card = ref<HTMLElement>()

const tip = `${props.desc ? `${props.desc}<br>` : ''}${props.link}`

onMounted(() => {
    tippy(unrefElement(card), {
        content: tip,
        allowHTML: true,
    })
})
</script>

<template>
    <ZRawLink ref="card" class="card gradient-card" :to="props.link">
        <img class="icon" :src="props.icon" alt="Icon">
        <div class="card-info">
            <span class="name">{{ props.name }}</span>
            <span v-if="props.desc" class="desc">{{ props.desc }}</span>
        </div>
    </ZRawLink>
</template>

<style scoped lang="scss">
.card {
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
    box-shadow: 2px 4px 0.5rem var(--c-primary-soft);
    background-color: white;
}

.card-info {
    display: grid;
    place-self: center;

    .name {
        font-weight: 600;
    }

    .desc {
        flex-grow: 1;
        margin-bottom: 0.5em;
        font-size: 0.8em;
        color: var(--vp-c-text-3);
    }
}
</style>
