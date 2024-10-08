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

const icon = computed(() => getFileIcon(props.language))

interface CodeblockMeta { [meta: string]: string | boolean }

const meta = computed(() => {
    if (!props.meta)
        return {}

    return props.meta.split(' ').reduce((acc: CodeblockMeta, item) => {
        const [key, value] = item.split('=')
        acc[key!] = value ?? true
        return acc
    }, {})
})

const isWrap = ref<boolean>(Boolean(meta.value.wrap))

const codeblock = useTemplateRef('codeblock')
const copyBtn = useTemplateRef('copy-btn')

useCopy(copyBtn, codeblock)
</script>

<template>
    <figure class="z-codeblock">
        <figcaption>
            <span v-if="filename" class="filename">
                <!-- BUG: 初次访问时不添加 class="light" -->
                <Icon :class="{ 'icon-revert': $colorMode.value === 'light' }" :name="icon" />
                {{ filename }}
            </span>
            <span v-if="language" class="language">{{ language }}</span>
            <div class="operations">
                <button @click="isWrap = !isWrap">
                    {{ isWrap ? '横向滚动' : '自动换行' }}
                </button>
                <button ref="copy-btn">
                    复制
                </button>
            </div>
        </figcaption>

        <!-- 嘿嘿，不要换行 -->
        <pre
            ref="codeblock"
            class="scrollcheck-x"
            :class="[props.class, { wrap: isWrap }]"
        ><slot /></pre>
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

    &:hover .operations {
        opacity: 1;
    }
}

figcaption {
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    gap: 1em;
    position: sticky;
    top: 0;
    padding: 0 1em;
    z-index: 1;

    .filename {
        order: 1;
        padding: 0.2em 0.8em;
        border-radius: 0 0 8px 8px;
        background-color: var(--c-border);
    }

    .language {
        opacity: 0.4;
        height: 0;
        padding: 0.2em;
    }

    .operations {
        position: absolute;
        opacity: 0;
        top: 0;
        padding: 0.2em;
        border-radius: 0 8px 8px;
        background-color: var(--c-bg-2);
        transition: opacity 0.2s;

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
        padding-right: 1em;
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
