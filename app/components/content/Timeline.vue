<script lang="tsx" setup>
const slots = defineSlots()
function render() {
    const slotContent = slots.default?.()
    if (!slotContent)
        return <span>时间线为空</span>

    return slotContent.map((node) => {
        const textContent = node.children?.default?.()[0].children || ''
        const match = textContent?.match?.(/^\{(.*?)\}$/)
        return match
            ? <div class="timeline-caption">{match[1]}</div>
            : <div class="timeline-body">{node}</div>
    })
}
</script>

<template>
    <div class="timeline">
        <render />
    </div>
</template>

<style scoped>
.timeline {
    font-size: 0.9em;
}

.timeline-caption {
    margin-bottom: 8px;
    font-style: italic;
}

.timeline-body {
    margin-bottom: 16px;
}
</style>
