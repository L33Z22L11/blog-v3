import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    rules: {
        // 'json/indent': ['error', 2],
        'jsonc/indent': ['error', 2],
        'vue/block-lang': ['error', {
            script: {
                lang: ['ts', 'tsx'],
            },
            style: {
                lang: ['scss'],
            },
        }],
        'vue/enforce-style-attribute': ['warn', { allow: ['scoped'] }],
        'vue/no-unused-refs': 'off',
        'yaml/indent': ['error', 2],
    },
})
