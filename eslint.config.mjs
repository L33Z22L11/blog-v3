import antfu from '@antfu/eslint-config'
import css from '@zinkawaii/eslint-config-css'
import { defineConfig } from 'eslint/config'

const codeConfig = await antfu({
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
			style: { lang: ['css'], allowNoLang: true },
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
		'e18e/prefer-includes': 'off',
		'eqeqeq': 'off',
		// MDC 的 YAML 参数和注释会被当成标题，文章也允许多个一级标题
		'markdown/heading-increment': 'off',
		// 保留文章中的占位链接、页内跳转和装饰性图标
		'markdown/no-empty-links': 'off',
		// MDC 的具名插槽（如 #tab1）会被误判为缺空格的 ATX 标题
		'markdown/no-missing-atx-heading-space': 'off',
		'markdown/no-missing-link-fragments': 'off',
		'markdown/no-multiple-h1': 'off',
		'markdown/require-alt-text': 'off',
		'no-irregular-whitespace': 'off',
		'no-sequences': 'off',
		'prefer-arrow-callback': 'off',
		'prefer-template': 'off',
		'style/indent': 'off',
		'style/no-mixed-spaces-and-tabs': 'off',
		'style/quotes': 'off',
		'style/semi': 'off',
		'unicorn/prefer-includes': 'off',
		'vue/block-lang': 'off',
	},
}, {
	// 文章中的 JSON 示例允许尾随逗号
	files: ['content/**/*.json'],
	rules: {
		'jsonc/comma-dangle': ['warn', 'always'],
	},
})

export default defineConfig([
	// CSS 使用独立语言规则，避免继承只适用于 JavaScript AST 的规则
	...codeConfig.map(config => config.rules ? { ...config, ignores: [...config.ignores || [], '**/*.css'] } : config),
	...css.map(config => ({ ...config, files: ['app/**/*.css'] })),
	{
		files: ['app/**/*.css'],
		rules: {
			'css/no-important': 'off',
			'css-stylistic/indentation': ['warn', 'tab', { baseIndentLevel: 0 }],
		},
	},
])
