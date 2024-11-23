<script setup lang="ts">
const props = withDefaults(defineProps<{
    code?: string
    language?: string
    filename?: string
    highlights?: number[]
    meta?: string
    class?: string
}>(), {
    code: '',
    highlights: () => [],
})

interface CodeblockMeta {
    icon?: string
    wrap?: boolean
    [meta: string]: string | boolean | undefined
}

const meta = computed(() => {
    if (!props.meta)
        return {}

    return props.meta.split(' ').reduce((acc: CodeblockMeta, item) => {
        const [key, value] = item.split('=')
        acc[key!] = value ?? true
        return acc
    }, {})
})

const icon = computed(() => meta.value.icon || getFileIcon(props.filename) || getLangIcon(props.language))
const isWrap = ref(meta.value.wrap)

const codeblock = useTemplateRef('codeblock')
const copyBtn = useTemplateRef('copy-btn')

useCopy(copyBtn, codeblock)
</script>

<template>
    <figure class="z-codeblock">
        <figcaption>
            <span v-if="filename" class="filename">
                <ClientOnly>
                    <!-- 颜色偏好存储于客户端，可能水合不匹配 -->
                    <Icon :class="{ 'icon-revert': !meta.icon && $colorMode.value === 'light' }" :name="icon" />
                </ClientOnly>
                {{ filename }}
            </span>
            <span v-else />
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
    overflow: clip;
    margin-block: 1em;
    border-radius: 0.5em;
    background-color: var(--c-bg-2);
    font-size: 0.8125rem;
    line-height: 1.4;

    &:hover .operations {
        opacity: 1;
    }
}

figcaption {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    position: sticky;
    top: 0;
    padding: 0 1em;
    z-index: 1;

    .filename {
        padding: 0.2em 0.8em;
        border-radius: 0 0 0.5em 0.5em;
        background-color: var(--c-border);
        word-break: break-all;
    }

    .language {
        opacity: 0.4;
        height: 0;
        line-height: 1.8em;
    }

    .operations {
        position: absolute;
        opacity: 0;
        top: 0;
        right: 0;
        padding: 0 1em;
        border-radius: 0 0.5em 0.5em;
        background-color: var(--c-bg-2);
        line-height: 1.8em;
        transition: opacity 0.2s;

        > button {
            opacity: 0.4;
            transition: opacity 0.2s;

            &:hover {
                opacity: 1;
            }

            & + button {
                margin-left: 0.8em;
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

.icon-revert {
    filter: invert(0.7) hue-rotate(180deg) saturate(4);
}
</style>
