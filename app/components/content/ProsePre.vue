<script setup lang="ts">
withDefaults(defineProps<{
    code?: string
    language?: string
    filename?: string
    highlights?: () => number[]
    meta?: string
}>(), {
    code: '',
    highlights: () => [],
})

const isWrap = ref(false)
const elCodeblock = ref<HTMLElement>()
const elCopyBtn = ref<HTMLElement>()

onMounted(() => {
    copy(elCopyBtn.value!, elCodeblock.value!)
})
</script>

<template>
    <figure class="z-codeblock">
        <figcaption v-if="filename">
            {{ filename }}
        </figcaption>

        <span v-if="language" class="language">{{ language }}</span>

        <div class="operations">
            <button @click="isWrap = !isWrap">
                {{ isWrap ? '横向滚动' : '自动换行' }}
            </button>
            <button ref="elCopyBtn">
                复制
            </button>
        </div>

        <!-- 嘿嘿，不要换行 -->
        <pre ref="elCodeblock" class="scrollcheck-x" :class="{ wrap: isWrap }"><slot /></pre>
    </figure>
</template>

<style lang="scss" scoped>
.z-codeblock {
    position: relative;
    margin-block: 1em;
    border-radius: 8px;
    background-color: var(--c-bg-2);
    font-size: 0.8125rem;
    line-height: 1.4;

    figcaption {
        display: inline-block;
        margin-inline-start: 1em;
        padding: 0.2em 0.8em;
        border-radius: 0 0 8px 8px;
        background-color: var(--c-border);
    }

    .language {
        position: absolute;
        top: 0.2em;
        right: 0.8em;
        color: var(--c-text-3);
        transition: opacity 0.2s;
    }

    .operations {
        position: absolute;
        opacity: 0;
        top: 0;
        right: 0;
        transition: opacity 0.2s;
        z-index: 1;

        > button {
            padding: 0.2em 0.8em;
            color: var(--c-text-3);
            transition: color 0.2s;
            cursor: pointer;

            &:hover {
                color: var(--c-text);
            }
        }
    }

    &:hover {
        .language {
            opacity: 0;
        }

        .operations {
            opacity: 1;
        }
    }
}

pre {
    --line-number-width: 4em;

    overflow: auto;
    padding: 1rem 0;

    &.wrap {
        margin-left: 4ch;
        white-space: pre-wrap;
        text-indent: -4ch;

        :deep(.line) {
            display: block;
        }
    }
}

:deep(.line) {
    padding: 0 1em 0 var(--line-number-width);

    &::before {
        content: attr(line);
        position: absolute;
        left: 0;
        width: var(--line-number-width);
        padding: 0 1em 0 0.5em;
        background-color: var(--c-bg-2);
        text-align: right;
        color: var(--c-text-3);
    }
}

.scrollcheck-x {
    --left-offset: var(--line-number-width);
}
</style>
