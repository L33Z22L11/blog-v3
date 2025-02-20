<script setup lang="ts">
const props = defineProps<{
    excerpt: string
}>()

const appConfig = useAppConfig()

const excerpt = ref(props.excerpt)
const caret = ref('')

if (appConfig.content.excerpt?.animation !== false) {
    // onBeforeMount(() => {
    excerpt.value = ''
    // })
    onMounted(async () => {
        caret.value = appConfig.content.excerpt?.caret ?? '_'
        for (const char of props.excerpt) {
            excerpt.value += char
            await delay(50)
        }
        caret.value = ''
    })
}

if (import.meta.dev) {
    watch(() => props.excerpt, (newExcerpt) => {
        excerpt.value = newExcerpt
    })
}
</script>

<template>
    <div class="md-excerpt gradient-card">
        <Icon name="ph:highlighter-bold" />{{ excerpt }}{{ caret }}
    </div>
</template>

<style lang="scss" scoped>
@keyframes fadein {
    from { opacity: 0; }
    to { opacity: 1; }
}

.md-excerpt {
    margin: 1rem;
    padding: 0.5rem;
    font-size: 0.9em;
    color: var(--c-text-2);

    // animation: fadein 3s;

    .iconify {
        margin-right: 0.3em;
    }

    &:hover {
        color: currentcolor;
    }
}
</style>
