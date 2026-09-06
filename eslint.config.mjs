import antfu from '@antfu/eslint-config'

export default antfu({
	ignores: ['*.yaml'],
	stylistic: {
		indent: 'tab',
	},
	pnpm: true,
	jsonc: {
		overrides: {
			'jsonc/indent': ['error', 2],
		},
	},
	// @keep-sorted
	rules: {
		'vue/block-lang': ['warn', {
			script: { lang: ['ts', 'tsx'] },
			style: { lang: ['scss'] },
		}],
		'vue/enforce-style-attribute': ['warn', {
			allow: ['scoped'],
		}],
		'vue/html-indent': ['error', 'tab', { baseIndent: 0 }],
		'yaml/indent': ['error', 2],
	},
}, {
	files: ['app/pages/**/*.vue'],
	rules: {
		'vue/valid-v-slot': 'off',
	},
}, {
	files: ['**/*.json'],
	ignores: ['content/**'],
	rules: {
		'style/eol-last': ['warn', 'never'],
	},
}, {
	files: ['content/**'],
	// @keep-sorted
	rules: {
		'antfu/consistent-list-newline': 'off',
		'eqeqeq': 'off',
		// MDC 的具名插槽（如 #tab1）会被误判为缺空格的 ATX 标题
		'markdown/no-missing-atx-heading-space': 'off',
		'no-irregular-whitespace': 'off',
		'no-sequences': 'off',
		'prefer-arrow-callback': 'off',
		'prefer-template': 'off',
		'style/indent': 'off',
		'style/no-mixed-spaces-and-tabs': 'off',
		'style/quotes': 'off',
		'style/semi': 'off',
		'unicorn/prefer-includes': 'off',
	},
}, {
	// 文章中的 JSON 示例允许尾随逗号
	files: ['content/**/*.json'],
	rules: {
		'jsonc/comma-dangle': ['warn', 'always'],
	},
})
