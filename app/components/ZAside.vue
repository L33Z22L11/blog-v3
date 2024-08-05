<script setup lang="ts">
import tippy from 'tippy.js'

const asideTest = ref<HTMLElement>()

onMounted(() => {
    tippy(asideTest.value, {
        content: '你知道得太多了。',
    })
})
</script>

<template>
    <aside id="z-aside">
        <div class="widget">
            <h3 class="widget-title">
                右侧栏
            </h3>
            <div ref="asideTest" class="card gradient-card">
                <p>我是一个右侧栏，正如你所见，我是一个还没有开发好的右侧栏。</p>
            </div>
        </div>
    </aside>
</template>

<style scoped lang="scss">
.widget {
    margin: 1rem 0;
}

.widget-title {
    margin: 0.5rem;
    font: inherit;
    color: var(--c-text-3);
}

.card {
    padding: 0.5rem;
}
</style>
