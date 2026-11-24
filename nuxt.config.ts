import { resolve } from 'node:path'
import { arch, env, version as nodeVersion, platform } from 'node:process'
import { pathToFileURL } from 'node:url'
import { name as ciName, CLOUDFLARE_PAGES, GITHUB_ACTIONS, NETLIFY } from 'ci-info'
import { mapValues } from 'es-toolkit/object'
import { pascalCase } from 'es-toolkit/string'
import { Features } from 'lightningcss'
import { Temporal } from 'temporal-polyfill'
import blogConfig from './blog.config'
import packageJson from './package.json'
import redirectList from './redirects.json'

function pluginPath(path: string) {
	return pathToFileURL(resolve(`./remark-plugins/${path}.ts`)).href
}

// 此处配置无需修改
export default defineNuxtConfig({
	app: {
		head: {
			meta: [
				{ name: 'author', content: [blogConfig.author.name, blogConfig.author.email].filter(Boolean).join(', ') },
				{ name: 'color-scheme', content: 'light dark' },
				// 此处为元数据的生成器标识，不建议修改
				{ 'name': 'generator', 'content': `${pascalCase(packageJson.name)} ${packageJson.version}`, 'data-github-repo': packageJson.homepage },
				{ name: 'mobile-web-app-capable', content: 'yes' },
			],
			link: [
				{ rel: 'icon', href: blogConfig.favicon },
				{ rel: 'alternate', type: 'application/atom+xml', href: '/atom.xml' },
				{ rel: 'preconnect', href: blogConfig.twikoo.preload },
				{ rel: 'stylesheet', href: 'https://s4.zstatic.net/npm/katex@0.16.47/dist/katex.min.css' },
				// "InterVariable", "Inter"
				{ rel: 'stylesheet', href: 'https://s4.zstatic.net/npm/inter-ui@4.1.1/inter-variable.css' },
				{ rel: 'stylesheet', href: 'https://s4.zstatic.net/npm/inter-ui@4.1.1/inter.css' },
				// "JetBrains Mono", 思源宋体 "Noto Serif SC"
				{ rel: 'preconnect', href: 'https://fonts.gstatic.cn', crossorigin: '' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Noto+Serif+SC:wght@200..900&display=swap' },
				// 抖音美好体 "DOUYINSANSBOLD-GB"
				{ rel: 'stylesheet', href: 'https://fonts.bytedance.com/dfd/api/v1/css?family=DOUYINSANSBOLD-GB&display=swap' },
			],
			templateParams: {
				separator: '|',
			},
			titleTemplate: `%s %separator ${blogConfig.title}`,
			script: blogConfig.scripts,
		},
		rootAttrs: {
			id: 'blog-root',
		},
	},

	compatibilityDate: '2024-08-03',

	components: [
		{ path: '~/components/partial', prefix: 'Z' },
		'~/components',
	],

	css: [
		'@/assets/css/animation.css',
		'@/assets/css/article.css',
		'@/assets/css/color.css',
		'@/assets/css/font.css',
		'@/assets/css/main.css',
		'@/assets/css/reusable.css',
	],

	// @keep-sorted
	experimental: {
		extractAsyncDataHandlers: true,
		typescriptPlugin: true,
	},

	nitro: {
		prerender: {
			// 修复部分平台会在文章路径后添加 `/`，导致闪现 404 错误
			// https://github.com/nuxt/content/issues/2378
			autoSubfolderIndex: CLOUDFLARE_PAGES || GITHUB_ACTIONS || NETLIFY ? false : undefined,
		},
	},

	// @keep-sorted
	routeRules: {
		...mapValues(redirectList, to => ({ redirect: { to, statusCode: 308 as const } })),
		'/api/stats': { prerender: true, headers: { 'Content-Type': 'application/json' } },
		'/atom.xml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
		'/favicon.ico': { redirect: { to: blogConfig.favicon } },
		'/subscriptions.opml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
	},

	runtimeConfig: {
		// @keep-sorted
		public: {
			arch,
			buildTime: Temporal.Now.zonedDateTimeISO().toString(),
			// EdgeOne 检测暂时不可用
			ci: env.TENCENTCLOUD_RUNENV === 'SCF' ? 'EdgeOne' : ciName || '',
			nodeVersion,
			platform,
		},
	},

	/** 在生产环境启用 sourcemap */
	// sourcemap: true,

	typescript: {
		nodeTsConfig: {
			// @keep-sorted
			include: [
				'../remark-plugins/**/*.ts',
				'../scripts/**/*.ts',
			],
		},
	},

	vite: {
		css: {
			transformer: 'lightningcss',
			lightningcss: {
				include: Features.Nesting,
			},
		},
		define: {
			/** 在生产环境启用 Vue DevTools */
			// __VUE_PROD_DEVTOOLS__: 'true',
			/** 在生产环境启用 Vue 水合不匹配详情 */
			// __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
		},
		optimizeDeps: {
			// @keep-sorted
			include: ['@shikijs/colorized-brackets', '@shikijs/transformers', '@unhead/schema-org/vue', '@vue/devtools-core', '@vue/devtools-kit', 'embla-carousel-autoplay', 'embla-carousel-vue', 'embla-carousel-wheel-gestures', 'es-toolkit/array', 'es-toolkit/function', 'es-toolkit/math', 'es-toolkit/object', 'es-toolkit/promise', 'es-toolkit/string', 'minisearch', 'parse-domain', 'plain-shiki', 'shiki/themes/catppuccin-latte.mjs', 'shiki/themes/one-dark-pro.mjs', 'temporal-polyfill', 'vue-tippy'],
		},
		server: {
			allowedHosts: true,
		},
	},

	// @keep-sorted
	modules: [
		'@bikariya/image-viewer',
		'@bikariya/modals',
		'@bikariya/shiki',
		'@nuxt/content',
		'@nuxt/hints',
		'@nuxt/icon',
		'@nuxt/image',
		'@nuxtjs/color-mode',
		'@nuxtjs/seo',
		'@pinia/nuxt',
		'@vueuse/nuxt',
		'nuxt-llms',
		'unplugin-yaml/nuxt',
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
				remarkPlugins: {
					// demo 在解析阶段展开，预览与正文共用后续转换插件。
					[pluginPath('remark-demo')]: {},
					[pluginPath('remark-code-component')]: {
						options: {
							'mermaid': { component: 'mermaid', prop: 'code' },
							'music-abc': { component: 'music-score', prop: 'abc' },
						},
					},
					'remark-math': {},
					'remark-reading-time': {},
				},
				// @keep-sorted
				rehypePlugins: {
					[pluginPath('rehype-meta-slots')]: {},
					'rehype-katex': {},
				},
				toc: { depth: 4, searchDepth: 4 },
			},
		},
		experimental: {
			sqliteConnector: 'native',
		},
	},

	dxup: {
		features: {
			namedLayoutSlots: true,
		},
	},

	hooks: {
		'ready': () => {
			console.info(`
================================
${pascalCase(packageJson.name)} ${packageJson.version}
${packageJson.homepage}
================================
`)
		},
		'content:file:afterParse': (ctx) => {
			const { permalink, path } = ctx.content as Record<string, string | undefined>
			// 优先使用自定义链接（permalink/abbrlink），其次隐藏基于文件路由的 URL 中的 /posts 前缀
			if (permalink)
				ctx.content.path = permalink
			else if (blogConfig.article.hidePostPrefix && path?.startsWith('/posts/'))
				ctx.content.path = path.slice('/posts'.length)
		},
	},

	icon: {
		customCollections: [
			{ prefix: 'zi', dir: './app/assets/icons' },
			{
				// Solar Icons (CC BY 4.0)
				prefix: 'solar',
				width: 24,
				height: 24,
				icons: {
					'rewind-back-bold-duotone': {
						body: '<path fill="currentColor" fill-rule="evenodd" d="M22 6.426v11.148c0 1.847-1.6 3.015-2.903 2.118L13 15.232V8.768l6.097-4.46C20.399 3.411 22 4.58 22 6.426" clip-rule="evenodd" opacity=".5"/><path fill="currentColor" d="M13 7.123v9.754c0 1.616-1.467 2.638-2.661 1.853L2.92 13.853c-1.228-.807-1.228-2.899 0-3.706l7.42-4.877c1.193-.785 2.66.237 2.66 1.853"/>',
					},
					'rewind-forward-bold-duotone': {
						body: '<path fill="currentColor" fill-rule="evenodd" d="M2 6.426v11.148c0 1.847 1.6 3.015 2.903 2.118L11 15.232V8.768l-6.097-4.46C3.601 3.411 2 4.58 2 6.426" clip-rule="evenodd" opacity=".5"/><path fill="currentColor" d="M11 7.123v9.754c0 1.616 1.467 2.638 2.661 1.853l7.418-4.877c1.228-.807 1.228-2.899 0-3.706L13.66 5.27C12.467 4.485 11 5.507 11 7.123"/>',
					},
				},
			},
		],
		clientBundle: {
			includeCustomCollections: true,
			scan: {
				globInclude: ['app/**/*.{vue,jsx,tsx,ts}', 'shared/**/*.ts', 'content/**/*.{md,mdc,mdx,yml,yaml}', 'blog.config.ts'],
			},
		},
	},

	image: {
		// 尽量以这些密度点对点显示
		densities: [1, 1.5, 2],
		format: ['avif', 'webp'],
		// Neylify 下 netlify 处理器无法显示站外图片，ipx 处理器无法显示站内图片，需彻底禁用
		// https://github.com/nuxt/image/issues/1353
		provider: NETLIFY ? 'none' : undefined,
	},

	linkChecker: {
		// @keep-sorted
		skipInspections: [
			'no-baseless',
			'no-non-ascii-chars',
			'no-uppercase-chars',
		],
	},

	llms: {
		domain: blogConfig.url,
		title: blogConfig.title,
		description: blogConfig.description,
	},

	ogImage: {
		enabled: false,
	},

	robots: {
		disableNuxtContentIntegration: true,
		disallow: blogConfig.article.robotsNotIndex,
	},

	site: {
		name: blogConfig.title,
		url: blogConfig.url,
		defaultLocale: blogConfig.language,
	},
})
