<script setup lang="ts">
const props = defineProps<{
    text?: string
    tip?: string
    icon?: string
    copy?: boolean
}>()

const tip = ref<HTMLElement>()
const tooltipText = props.tip || (props.copy ? '点击复制' : '')
const icon = props.icon || (props.copy ? 'ph:copy' : 'ph:question')

useTooltip(tip, tooltipText)
props.copy && useCopy(tip, tip)
</script>

<template>
    <span ref="tip" class="tip">
        <!-- 元素间不留空格 -->
        <slot>{{ text }}</slot>
        <Icon :name="icon" class="tip-icon" />
    </span>
</template>

<style scoped lang="scss">
.tip {
    position: relative;
    text-decoration: underline dashed var(--c-text-3);
    text-underline-offset: 4px;
    cursor: pointer;
}

.tip-icon {
    display: inline-block;
    font-size: 1em;
    vertical-align: top;
}
</style>
