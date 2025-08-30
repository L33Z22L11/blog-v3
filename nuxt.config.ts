import process from 'node:process'
import { readFileSync, writeFileSync } from 'node:fs'
import ci from 'ci-info'
import blogConfig, { routeRules } from './blog.config'
import packageJson from './package.json'

// CRC16算法实现
function calculateCRC16(data: string): number {
	const bytes = Buffer.from(data, 'utf8')
	let crc = 0xFFFF

	for (let i = 0; i < bytes.length; i++) {
		crc ^= bytes[i]
		for (let j = 0; j < 8; j++) {
			if (crc & 1) {
				crc = (crc >> 1) ^ 0xA001
			} else {
				crc = crc >> 1
			}
		}
	}

	return crc & 0xFFFF
}

// 根据日期生成6位CRC16哈希值短链
function generateHashFromDate(dateStr: string): string {
	if (!dateStr) {
		dateStr = new Date().toISOString()
	}
	const normalizedDate = new Date(dateStr).toISOString()
	const crc16 = calculateCRC16(normalizedDate)
	const hexHash = crc16.toString(16).padStart(4, '0')
	return hexHash
}

// 解析YAML front matter
function parseFrontMatter(content: string) {
	const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
	const match = content.match(frontMatterRegex)

	if (!match) {
		return { data: {}, content, hasFrontMatter: false }
	}

	const yamlContent = match[1]
	const markdownContent = match[2]
	const data: Record<string, any> = {}
	const lines = yamlContent.split('\n')

	for (const line of lines) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith('#')) continue

		const colonIndex = trimmed.indexOf(':')
		if (colonIndex === -1) continue

		const key = trimmed.substring(0, colonIndex).trim()
		let value = trimmed.substring(colonIndex + 1).trim()

		if (value.startsWith('[') && value.endsWith(']')) {
			value = value.slice(1, -1).split(',').map((item: string) => item.trim())
		} else if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1)
		} else if (value.startsWith("'") && value.endsWith("'")) {
			value = value.slice(1, -1)
		} else if (value === 'true' || value === 'false') {
			value = value === 'true'
		} else if (!isNaN(Number(value)) && value !== '') {
			value = Number(value)
		}

		data[key] = value
	}

	return { data, content: markdownContent, hasFrontMatter: true }
}

// 序列化YAML front matter
function stringifyFrontMatter(data: Record<string, any>, content: string): string {
	let yamlContent = ''

	for (const [key, value] of Object.entries(data)) {
		if (Array.isArray(value)) {
			yamlContent += `${key}: [${value.join(', ')}]\n`
		} else if (typeof value === 'string') {
			yamlContent += `${key}: ${value}\n`
		} else {
			yamlContent += `${key}: ${value}\n`
		}
	}

	return `---\n${yamlContent}---\n\n${content}`
}

// 写入URL到文件
function writeUrlToFile(filePath: string, url: string, shouldUpdate: boolean = false): void {
	try {
		const content = readFileSync(filePath, 'utf8')
		const parsed = parseFrontMatter(content)

		// 如果已经有URL字段且不需要更新，不覆盖
		if (parsed.data.url && !shouldUpdate) {
			return
		}

		// 添加或更新URL字段
		parsed.data.url = url

		// 重新组装文件内容
		const newContent = parsed.hasFrontMatter
			? stringifyFrontMatter(parsed.data, parsed.content)
			: stringifyFrontMatter({ url }, content)

		// 写回文件
		writeFileSync(filePath, newContent, 'utf8')
		console.log(`[Auto Hash URL] 已写入文件: ${filePath} -> ${url}`)
	} catch (error) {
		console.error(`[Auto Hash URL] 写入文件失败 ${filePath}:`, error)
	}
}

// 此处配置无需修改
export default defineNuxtConfig({
	app: {
		head: {
			meta: [
				{ name: 'author', content: [blogConfig.author.name, blogConfig.author.email].filter(Boolean).join(', ') },
				// 此处为元数据的生成器标识，不建议修改
				{ 'name': 'generator', 'content': packageJson.name, 'data-github-repo': packageJson.homepage, 'data-version': packageJson.version },
				{ name: 'mobile-web-app-capable', content: 'yes' },
			],
			link: [
				{ rel: 'icon', href: blogConfig.favicon },
				{ rel: 'alternate', type: 'application/atom+xml', href: '/atom.xml' },
				{ rel: 'preconnect', href: blogConfig.twikoo.preload },
				{ rel: 'stylesheet', href: 'https://lib.baomitu.com/KaTeX/0.16.9/katex.min.css' },
				// 思源黑体 "Noto Sans SC", 思源宋体 "Noto Serif SC", "JetBrains Mono"
				{ rel: 'preconnect', href: 'https://fonts.gstatic.cn', crossorigin: '' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Noto+Sans+SC:wght@100..900&family=Noto+Serif+SC:wght@200..900&display=swap' },
				// 小米字体 "MiSans"
				{ rel: 'stylesheet', href: 'https://cdn-font.hyperos.mi.com/font/css?family=MiSans:100,200,300,400,450,500,600,650,700,900:Chinese_Simplify,Latin&display=swap' },
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
			nodeVersion: process.version,
			platform: process.platform,
			arch: process.arch,
			ci: process.env.TENCENTCLOUD_RUNENV === 'SCF' ? 'EdgeOne' : ci.name || '',
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
				// @keep-sorted
				remarkPlugins: {
					'remark-math': {},
					'remark-reading-time': {},
				},
				rehypePlugins: {
					'rehype-katex': {},
				},
				toc: { depth: 4, searchDepth: 4 },
			},
		},
	},

	hooks: {
		'ready': () => {
			console.info(`
================================
${packageJson.name} ${packageJson.version}
${packageJson.homepage}
================================
`)
		},
		'content:file:afterParse': (ctx) => {
			// 如果有date字段，生成哈希短链
			if (ctx.content.date) {
				// 根据文件路径确定是 posts 还是 previews
				const isPreview = ctx.file.path.includes('/previews/') || ctx.file.path.includes('\\previews\\')
				const pathPrefix = isPreview ? '/previews' : '/posts'

				// 如果已有URL字段，优先使用用户自定义的URL，不再重新生成
				if (ctx.content.url) {
					ctx.content.path = `${pathPrefix}/${ctx.content.url}`
					return
				}

				// 没有URL字段，生成新的哈希短链
				const hashUrl = generateHashFromDate(ctx.content.date)
				ctx.content.url = hashUrl
				ctx.content.path = `${pathPrefix}/${hashUrl}`
				console.log(`[Auto Hash URL] Generated: ${ctx.file.path} -> ${hashUrl} (${isPreview ? 'preview' : 'post'})`)

				// 将URL写入文件
				setTimeout(() => {
					writeUrlToFile(ctx.file.path, hashUrl)
				}, 100)
				return
			}

			// 如果有URL字段但没有date字段，使用现有URL
			if (ctx.content.url) {
				// 根据文件路径确定是 posts 还是 previews
				const isPreview = ctx.file.path.includes('/previews/') || ctx.file.path.includes('\\previews\\')
				const pathPrefix = isPreview ? '/previews' : '/posts'
				ctx.content.path = `${pathPrefix}/${ctx.content.url}`
				return
			}

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
		defaultLocale: blogConfig.language,
	},
})
