<script setup lang="ts">
withDefaults(defineProps<{
    tip?: string
    delay?: number
    wrap?: boolean
    hoverable?: boolean
}>(), {
    delay: 100,
})
</script>

<template>
    <TooltipProvider :disable-hoverable-content="!hoverable">
        <TooltipRoot :delay-duration="delay">
            <TooltipTrigger :as-child="!wrap">
                <slot />
            </TooltipTrigger>
            <TooltipPortal v-if="tip || $slots.tip">
                <TooltipContent class="tip-content">
                    <slot name="tip">
                        {{ tip }}
                    </slot>
                    <TooltipArrow class="tip-arrow" />
                </TooltipContent>
            </TooltipPortal>
        </TooltipRoot>
    </TooltipProvider>
</template>

<style lang="scss" scoped>
:deep() {
    .tip-content {
        padding: 0.3em 0.6em;
        border-radius: 0.5em;
        box-shadow: 0 0 1rem var(--ld-shadow);
        background-color: var(--ld-bg-card);
        font-size: 0.8em;
        color: var(--c-text-2);
        animation: float-in 0.2s;
    }

    .tip-arrow {
        fill: var(--ld-bg-card);
    }
}
</style>
