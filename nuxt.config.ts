import process from 'node:process'
import blogConfig, { routeRules } from './blog.config'
import packageJson from './package.json'

// 此处配置无需修改
export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				'lang': blogConfig.language,
				'data-lang': blogConfig.language,
			},
			meta: [
				{ name: 'author', content: [blogConfig.author.name, blogConfig.author.email].filter(Boolean).join(', ') },
				// 此处为元数据的生成器标识，不建议修改
				{ 'name': 'generator', 'content': packageJson.name, 'data-github-repo': packageJson.homepage, 'data-version': packageJson.version },
				{ name: 'mobile-web-app-capable', content: 'yes' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
			],
			link: [
				{ rel: 'icon', href: blogConfig.favicon },
				{ rel: 'alternate', type: 'application/atom+xml', href: '/atom.xml' },
				{ rel: 'preconnect', href: blogConfig.twikoo.preload },
				// 思源黑体 "Noto Sans SC", 思源宋体 "Noto Serif SC", "JetBrains Mono"
				{ rel: 'preconnect', href: 'https://fonts.gstatic.cn', crossorigin: '' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap' },
			],
			templateParams: {
				separator: '|',
			},
			titleTemplate: `%s %separator ${blogConfig.title}`,
			script: blogConfig.scripts,
		},
		rootAttrs: {
			id: 'z-root',
		},
	},

	compatibilityDate: '2024-08-03',

	components: [
		{ path: '~/components/partial', prefix: 'Z' },
		{ path: '~/components/zhilu', prefix: 'Zhilu', global: true },
		'~/components',
	],

	css: [
		'@/assets/css/animation.scss',
		'@/assets/css/article.scss',
		'@/assets/css/color.scss',
		'@/assets/css/main.scss',
		'@/assets/css/reusable.scss',
	],

	features: {
		inlineStyles: false,
	},

	routeRules,

	runtimeConfig: {
		public: {
			buildTime: new Date().toISOString(),
		},
	},

	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/assets/css/_variable.scss" as *;',
				},
			},
		},
		server: {
			allowedHosts: true,
		},
	},

	// @keep-sorted
	modules: [
		'@nuxt/content',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxtjs/color-mode',
		'@nuxtjs/seo',
		'@pinia/nuxt',
		'@vueuse/nuxt',
	],

	colorMode: {
		preference: 'system',
		fallback: 'light',
		classSuffix: '',
	},

	content: {
		build: {
			markdown: {
				highlight: false,
				remarkPlugins: { 'remark-reading-time': {} },
				toc: { depth: 4, searchDepth: 4 },
			},
		},
	},

	hooks: {
		'content:file:afterParse': (ctx) => {
			// 在 URL 中隐藏指定目录前缀的路径
			for (const prefix of blogConfig.hideContentPrefixes) {
				const realPath = ctx.content.path as string
				if (realPath.startsWith(prefix)) {
					ctx.content.original_dir = prefix
					ctx.content.path = realPath.replace(prefix, '')
				}
			}
		},
	},

	icon: {
		customCollections: [
			{ prefix: 'zi', dir: './app/assets/icons' },
		],
	},

	image: {
		// Netlify 需要特殊处理
		provider: process.env.NUXT_IMAGE_PROVIDER,
		domains: blogConfig.imageDomains,
		format: ['avif', 'webp'],
	},

	robots: {
		disableNuxtContentIntegration: true,
		disallow: blogConfig.robotsNotIndex,
	},

	site: {
		name: blogConfig.title,
		url: blogConfig.url,
	},
})
