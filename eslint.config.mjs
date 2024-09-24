import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    rules: {
        // 'json/indent': ['error', 2],
        'jsonc/indent': ['error', 2],
        'vue/enforce-style-attribute': ['error', { allow: ['scoped'] }],
        'vue/block-lang': ['error', {
            script: {
                lang: ['ts'],
            },
            style: {
                lang: ['scss'],
            },
        }],
        'yaml/indent': ['error', 2],
    },
})
