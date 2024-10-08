<script setup lang="ts">
const layoutStore = useLayoutStore()
const lightboxStore = useLightboxStore()

const image = ref()
const _elImage = useCurrentElement(image)
</script>

<template>
    <Transition>
        <div v-if="layoutStore.isOpen('lightbox')" class="z-lightbox">
            <Transition>
                <div
                    v-if="layoutStore.isOpen('lightbox')"
                    id="z-lightbox-bgmask"
                    @click="layoutStore.toggle('lightbox')"
                />
            </Transition>
            <NuxtImg ref="image" class="image" :src="lightboxStore.url" />
            <div class="caption">
                {{ lightboxStore.caption }}
                <button class="close" type="button" aria-label="关闭灯箱">
                    <Icon name="ph:x-bold" @click="layoutStore.toggle('lightbox')" />
                </button>
            </div>
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
#z-lightbox-bgmask {
    position: fixed;
    inset: 0;
    background-color: #0007;
    transition: backdrop-filter 1s;
    transition: opacity 0.2s;
    z-index: 0;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }
}

.z-lightbox {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    inset: 0;
    transition: opacity 0.2s;
    z-index: 100;

    &.v-enter-from,
    &.v-leave-to {
        opacity: 0;
    }

    .close {
        cursor: pointer;
    }

    .image {
        max-width: 90%;
        max-height: 90%;
    }

    .caption {
        display: flex;
        align-items: center;
        gap: 1em;
        position: absolute;
        bottom: clamp(2rem, 10vh, 5rem);
        max-width: min(40rem, 80%);
        padding: 0.5em 1em;
        border-radius: 0.5em;
        box-shadow: 0 0.5em 1em var(--ld-shadow);
        background-color: var(--c-text-1);
        color: var(--c-bg-2);
    }
}
</style>
