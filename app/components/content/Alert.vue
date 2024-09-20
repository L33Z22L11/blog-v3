<script setup lang="ts">
const props = withDefaults(defineProps<{
    type?: keyof typeof typeMap
    icon?: string
    color?: string
    title?: string
    text?: string
}>(), {
    type: 'tip',
})

const typeMap = {
    tip: {
        icon: 'ph:notepad-bold',
        color: '#3b7',
        title: '提醒',
    },
    info: {
        icon: 'ph-info-bold',
        color: 'currentColor',
        title: '信息',
    },
    question: {
        icon: 'ph:question-bold',
        color: '#3af',
        title: '问题',
    },
    warning: {
        icon: 'ph:warning-bold',
        color: '#f80',
        title: '警告',
    },
    error: {
        icon: 'ph:x-circle-bold',
        color: '#f33',
        title: '错误',
    },
}

const {
    icon: defaultIcon,
    color: defaultColor,
    title: defaultTitle,
} = typeMap[props.type] || typeMap.tip

const icon = computed(() => props.icon || defaultIcon)
const color = computed(() => props.color || defaultColor)
const title = computed(() => props.title || defaultTitle)
</script>

<template>
    <div class="alert card" :style="{ '--c-primary': color }">
        <div class="alert-title">
            <Icon :name="icon" />
            <slot name="title">
                {{ title }}
            </slot>
        </div>
        <slot><p>{{ text }}</p></slot>
    </div>
</template>

<style lang="scss" scoped>
.alert {
    padding: 0.2em 0.8em;
    background-image:
        radial-gradient(circle at 4em -25em, var(--c-primary), transparent 30em),
        linear-gradient(var(--c-primary) -2000%, transparent);
    font-size: 0.9em;

    .alert-title {
        display: flex;
        align-items: center;
        gap: 0.5em;
        margin: 0.5em 0;
        font-size: 1em;
        font-weight: var(--font-weight-medium);
        color: var(--c-primary);

        :deep(p) {
            margin: 0;
            text-indent: 0;
        }
    }
}
</style>
