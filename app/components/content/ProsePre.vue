<script setup lang="ts">
// FIXME: [Vue warn]: Invalid prop: type check failed for prop "highlights". Expected Function, got Array
// FIXME: [nuxt] Failed to stringify dev server logs. Received DevalueError: Cannot stringify a function.
const props = withDefaults(defineProps<{
    code?: string
    language?: string
    filename?: string
    highlights?: () => number[]
    meta?: string
    class?: string
}>(), {
    code: '',
    highlights: () => [],
})

const meta = computed(() => {
    if (!props.meta)
        return {}

    return props.meta.split(' ').reduce((acc, item) => {
        const [key, value] = item.split('=')
        acc[key!] = value ?? true
        return acc
    }, {} as { [meta: string]: string | boolean })
})

const isWrap = ref<boolean>(Boolean(meta.value.wrap))

const elCodeblock = ref<HTMLElement>()
const elCopyBtn = ref<HTMLElement>()

useCopy(elCopyBtn, elCodeblock)
</script>

<template>
    <figure class="z-codeblock">
        <!-- 改变 DOM 顺序会改变 z-index -->
        <div class="codeblock-header">
            <div class="operations">
                <button @click="isWrap = !isWrap">
                    {{ isWrap ? '横向滚动' : '自动换行' }}
                </button>
                <button ref="elCopyBtn">
                    复制
                </button>
            </div>
        </div>

        <!-- TODO: 显示文件类型图标 -->
        <figcaption v-if="filename">
            {{ filename }}
        </figcaption>

        <span v-if="language" class="language">{{ language }}</span>
        <!-- 嘿嘿，不要换行 -->
        <pre
            ref="elCodeblock"
            class="scrollcheck-x"
            :class="[props.class, { wrap: isWrap }]"
        ><slot /></pre>
    </figure>
</template>

<style scoped lang="scss">
.z-codeblock {
    position: relative;
    margin-block: 1em;
    border-radius: 8px;
    background-color: var(--c-bg-2);
    font-size: 0.8125rem;
    line-height: 1.4;

    .codeblock-header {
        gap: 0.5em;
        position: sticky;
        top: 0;
        height: 0;
        background: linear-gradient(var(--c-bg-2), transparent);
        z-index: 2;
    }

    figcaption {
        display: inline-block;
        flex-shrink: 0;
        position: sticky;
        top: 0;
        margin: 0 1em;
        padding: 0.2em 0.8em;
        border-radius: 0 0 8px 8px;
        background-color: var(--c-border);
        z-index: 1;
    }

    .language, .operations {
        position: absolute;
        opacity: 0.4;
        right: 0;
        padding: 0.2em 0.8em;
        transition: opacity 0.2s;
    }

    .operations {
        gap: 0.5em 1em;
        opacity: 0;
        border-radius: 0 8px 8px;
        background-color: var(--c-bg-2);

        > button {
            opacity: 0.4;
            transition: opacity 0.2s;

            &:hover {
                opacity: 1;
            }

            & + button {
                margin-left: 1em;
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
    // 未指定语言
    // 如果填写 0 会在 calc() 时出错
    --left-offset: 0px;

    overflow: auto;
    padding: 1rem;
    background-color: transparent;

    &.wrap {
        white-space: pre-wrap;

        :deep(.line) {
            display: block;
        }
    }

    // 指定语言
    &.shiki {
        --left-offset: 4em;

        padding-left: var(--left-offset);
    }
}

:deep(.line) {
    &::before {
        content: attr(line);
        position: absolute;
        left: 0;
        width: var(--left-offset);
        padding: 0 1em 0 0.5em;
        background-color: var(--c-bg-2);
        text-align: right;
        color: var(--c-text-3);
    }

    &.highlight {
        &::before {
            color: inherit;
        }

        outline: 0.2em solid var(--ld-bg-active);
        background-color: var(--ld-bg-active);
    }
}
</style>
