<script lang="ts" setup>
import tippy from 'tippy.js'
import type { Friend } from '~/types/friend'
import 'tippy.js/dist/tippy.css'

const props = defineProps<Friend>()
const friendCard = ref<HTMLElement>()

const mainDomain = getMainDomain(props.link)

// TODO: 优化鼠标悬浮提示
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
        <div class="card-content">
            <div class="name-title">
                <span class="name">{{ name }}</span>
                <span class="title">{{ title }}</span>
            </div>
            <!-- TODO: 域名Provider图标 with title attr -->
            <div class="domain-arch">
                <span class="domain" :class="{ 'domain-zhilu': mainDomain === 'thisis.host' }">
                    {{ mainDomain }}
                </span>
                <Icon
                    v-for="arch in archs"
                    :key="arch"
                    class="arch"
                    :name="getArchIcon(arch)"
                    :title="arch"
                />
            </div>
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

        .domain-arch {
            opacity: 1;
            font-size: 0.75em;
            letter-spacing: -0.03em;
        }

        .arch {
            opacity: 0.6;
            max-width: 5em;
            transition: max-width 0.5s;
        }
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

.card-content {
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

    .domain-arch {
        opacity: 0.5;
        max-width: 100%;
        font-size: 0.8em;
        white-space: nowrap;
        transition: all 0.5s;
    }

    .domain {
        padding: 0 0.2em;
        border-radius: 4px;
        background: var(--c-bg-soft);
    }

    .arch {
        opacity: 0;
        max-width: 0;
        margin-left: 0.2em;
        transition: all 0.5s;
    }
}
</style>
