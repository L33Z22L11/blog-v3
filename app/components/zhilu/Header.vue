<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
    <header class="zhilu-header">
        <div v-if="appConfig.header.emojiTail" class="emoji-tail">
            <span
                v-for="(char, index) in appConfig.header.emojiTail"
                :key="index"
                :style="`--delay: ${index * .6 - 3}s`"
            >{{ char }}</span>
        </div>
        <NuxtImg :src="appConfig.header.logo" class="zhilu-logo" :class="{ 'with-text': appConfig.header.text }" />
        <div v-if="appConfig.header.text" class="zhilu-text">
            <div class="header-title">
                <span
                    v-for="(char, index) in appConfig.title"
                    :key="index"
                    :style="`--delay:${(index + 1) * .1}s`"
                >{{ char }}</span>
            </div>
            <div class="header-subtitle">
                {{ appConfig.header.subtitle }}
            </div>
        </div>
    </header>
</template>

<style lang="scss">
.zhilu-header {
    display: flex;
    align-items: center;
    gap: 0.5em;
    position: relative;
    margin: 2.5rem 1rem 1rem;
    line-height: initial;
}

.zhilu-logo {
    height: 3em;

    &.with-text {
        aspect-ratio: 1;
        border-radius: 2em;
        box-shadow: 2px 4px 0.5rem var(--c-border);
    }
}

.header-title {
    font-family: AlimamaFangYuanTi;
    font-size: 1.5em;
    font-synthesis: none;
    font-variation-settings: "wght" 600, "BEVL" 100;

    span {
        animation: 3.14s infinite alternate vf-weight, 2.72s infinite alternate vf-bevel;
        animation-delay: var(--delay);
        animation-play-state: paused;
    }
}

.header-subtitle {
    font-size: 0.8em;
    color: var(--c-text-2);
}

@keyframes vf-weight {
    0% {
        font-weight: 600;
    }

    38.2% {
        font-weight: 300;
    }

    100% {
        font-weight: 900;
    }
}

@keyframes vf-bevel {
    from {
        font-variation-settings: "BEVL" 100;
    }

    to {
        font-variation-settings: "BEVL" 1;
    }
}

.emoji-tail {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    align-content: center;
    justify-items: center;
    position: absolute;
    opacity: 0.2;
    inset: 0;
    font-size: 4rem;
    transition: opacity 1s;
    filter: blur(2px);
    pointer-events: none;
    z-index: -2;

    >* {
        animation: 5s infinite alternate emoji-floating;
        animation-delay: var(--delay);
        animation-play-state: paused;
    }
}

.zhilu-header:hover {
    .emoji-tail {
        opacity: 0.5;
    }

    * {
        animation-play-state: running;
    }
}

@keyframes emoji-floating {
    50% {
        transform: translate(-12px, -4px) scale(1.2);
        filter: blur(4px);
    }

    100% {
        transform: translate(-4px, -12px) scale(0.9);
        filter: blur(1px);
    }
}
</style>
