<script setup lang="ts">
const props = defineProps<{
    text?: string
    tip?: string
    icon?: string | boolean
    copy?: boolean
}>()

const tip = computed(() => ({
    content: props.tip || (props.copy ? '点击复制' : ''),
    inlinePositioning: true,
}))
const tipSource = useTemplateRef('tip-text')

const { copy, copied } = useCopy(tipSource)
const icon = computed(() => props.icon
    || (copied.value && 'ph:check-bold')
    || (props.copy && 'ph:copy-bold')
    || 'ph:question-bold',
)
</script>

<template>
    <span ref="tip-text" v-tip="tip" class="tip" @click="props.copy && copy()">
        <slot>{{ text }}</slot>
        <Icon v-if="typeof icon === 'string'" :name="icon" class="tip-icon" />
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
