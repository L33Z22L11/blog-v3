<script lang="tsx" setup>
const slots = defineSlots<{
    default: () => VNode[]
}>()

function render() {
    const slotContent = slots.default()
    if (!slotContent)
        return <span>时间线为空</span>

    return slotContent.map((node: VNode) => {
        // WARN: 此处使用了非标准的 v-slot:default
        const textContent: string = (node.children as any)?.default?.()[0].children || ''
        const match = textContent?.match?.(/^\{(?<caption>.*)\}$/)
        return match?.groups
            ? <div class="timeline-caption">{match.groups.caption}</div>
            : <div class="timeline-body card">{node}</div>
    })
}
</script>

<template>
    <div class="timeline">
        <render />
    </div>
</template>

<style lang="scss" scoped>
// TODO: 优化时间线样式
.timeline {
    position: relative;
    padding-left: 1.5em;
    font-size: 0.9em;

    &::before {
        content: "";
        position: absolute;
        top: 0.5em;
        bottom: 0;
        left: 0.5em;
        width: 0.3em;
        background-color: var(--c-bg-soft);
    }
}

:deep() {
    .timeline-caption {
        opacity: 0.8;
        font-size: 0.9em;

        &::before {
            content: "";
            position: absolute;
            left: 0.3em;
            width: 0.8em;
            height: 0.8em;
            margin-top: 0.5em;
            border-radius: 1em;
            background-color: var(--c-text-2);
        }
    }

    .timeline-body {
        width: fit-content;
        margin-bottom: 1em;
        padding: 0 1em;
    }
}
</style>
