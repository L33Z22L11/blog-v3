<script setup lang="ts">
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

const props = defineProps<{
    text: string
    tip?: string
    icon?: string
    copy?: boolean
}>()

const tip = ref<HTMLElement>()

const icon = props.icon || (props.copy ? 'ph:copy' : 'ph:question')

const tooltipText = props.tip || (props.copy ? '点击复制' : '')

onMounted(() => {
    tippy(tip.value!, {
        content: tooltipText,
    })
    if (props.copy)
        copy(tip.value!, tip.value!)
})
</script>

<template>
    <span ref="tip" class="tip">
        {{ text }}
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
