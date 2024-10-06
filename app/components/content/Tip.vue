<script setup lang="ts">
const props = defineProps<{
    text?: string
    tip?: string
    icon?: string
    copy?: boolean
}>()

const tip = useTemplateRef('tip')
const tooltipText = computed(() => props.tip || (props.copy ? '点击复制' : ''))
const icon = computed(() => props.icon || (props.copy ? 'ph:copy-bold' : 'ph:question-bold'))

props.copy && useCopy(tip, tip)
</script>

<template>
    <span ref="tip" v-tippy="tooltipText" class="tip">
        <!-- 元素间不留空格 -->
        <slot>{{ text }}</slot>
        <Icon :name="icon" class="tip-icon" />
    </span>
</template>

<style lang="scss" scoped>
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
