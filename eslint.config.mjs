import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    rules: {
        // 'json/indent': ['error', 2],
        'jsonc/indent': ['error', 2],
        'vue/enforce-style-attribute': ['error', { allow: ['scoped'] }],
        'yaml/indent': ['error', 2],
    },
})
