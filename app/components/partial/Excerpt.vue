<script setup lang="ts">
const props = defineProps<{
    excerpt: string
}>()

const appConfig = useAppConfig()

const excerpt = ref(props.excerpt)
const caret = ref('')

if (appConfig.excerpt?.animation !== false) {
    excerpt.value = ''
    caret.value = appConfig.excerpt?.caret ?? '_'
    onMounted(async () => {
        for (const char of props.excerpt) {
            excerpt.value += char
            await delay(50)
        }
        caret.value = ''
    })
}
</script>

<template>
    <div class="md-excerpt gradient-card">
        <Icon name="ph:highlighter-bold" />{{ excerpt }}{{ caret }}
    </div>
</template>

<style lang="scss" scoped>
.md-excerpt {
    margin: 1rem;
    padding: 0.5rem;
    font-size: 0.9em;
    color: var(--c-text-2);

    .iconify {
        margin-right: 0.3em;
    }

    &:hover {
        color: inherit;
    }
}
</style>
