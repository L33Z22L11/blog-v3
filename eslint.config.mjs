import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    rules: {
        'jsonc/indent': ['error', 2],
        'vue/block-lang': ['warn', {
            script: { lang: ['ts', 'tsx'] },
            style: { lang: ['scss'] },
        }],
        'vue/enforce-style-attribute': ['warn', {
            allow: ['scoped'],
        }],
        'yaml/indent': ['error', 2],
    },
}, {
    files: ['**/*.json'],
    ignores: ['content/**'],
    rules: {
        'style/eol-last': ['warn', 'never'],
    },
}, {
    files: ['content/**'],
    rules: {
        'antfu/consistent-list-newline': 'off',
        'eqeqeq': 'off',
        'jsonc/comma-dangle': ['warn', 'always'],
        'no-irregular-whitespace': 'off',
        'no-sequences': 'off',
        'prefer-arrow-callback': 'off',
        'prefer-template': 'off',
        'style/no-seqences': 'off',
        'style/quotes': 'off',
        'style/semi': 'off',
        'unicorn/prefer-includes': 'off',
    },
})
