import type { FileAfterParseHook } from '@nuxt/content'
import process from 'node:process'
import blogConfig, { routeRules } from './blog.config'

export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: {
                lang: blogConfig.language,
            },
            link: [
                { rel: 'icon', href: blogConfig.favicon },
                { rel: 'alternate', type: 'application/atom+xml', href: '/atom.xml' },
                { rel: 'preconnect', href: blogConfig.twikoo.preload },
                { rel: 'preconnect', href: 'https://cdn-font.hyperos.mi.com' },
                // 浏览器渲染中文 VF 字重有问题
                { rel: 'stylesheet', href: 'https://cdn-font.hyperos.mi.com/font/css?family=MiSans_VF:VF:Chinese_Simplify,Latin&display=swap', media: 'none', onload: 'this.media="all"' },
                // https://cdn-font.hyperos.mi.com/font/css?family=MiSans:100,200,300,400,450,500,600,650,700,900:Chinese_Simplify,Latin&display=swap
                { rel: 'preconnect', href: 'https://fonts.googleapis.cn' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.cn' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=Fira+Code:wght@300..700&family=Noto+Serif+SC:wght@200..900&display=swap', media: 'none', onload: 'this.media="all"' },
                // { rel: 'stylesheet', href: 'https://gcore.jsdelivr.net/npm/nerdfonts-web/nf.min.css' },
            ],
            meta: [
                { name: 'author', content: `${blogConfig.author.name} <${blogConfig.author.email}>` },
                { 'name': 'generator', 'data-github-repo': 'https://github.com/L33Z22L11/blog-v3' },
            ],
            templateParams: {
                separator: '|',
            },
            titleTemplate: `%s %separator ${blogConfig.title}`,
            script: blogConfig.scripts,
        },
        rootId: 'z-root',
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

    // BUG: 3.14+ Windows 平台内存泄漏
    devtools: { enabled: false },

    features: {
        inlineStyles: false,
    },

    future: {
        compatibilityVersion: 4,
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
                    api: 'modern-compiler',
                },
            },
        },
        server: {
            allowedHosts: true,
        },
    },

    modules: [
        '@nuxtjs/seo', // before @nuxt/content
        '@nuxt/content',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/color-mode',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@zinkawaii/nuxt-shiki',
    ],

    colorMode: {
        preference: 'system',
        fallback: 'light',
        classSuffix: '',
    },

    content: {
        build: {
            markdown: {
                highlight: {
                    langs: blogConfig.shiki.langs,
                    theme: {
                        default: blogConfig.shiki.defaultTheme,
                        dark: blogConfig.shiki.darkTheme,
                    },
                },
                remarkPlugins: { 'remark-reading-time': {} },
                toc: { depth: 4, searchDepth: 4 },
            },
        },
    },

    hooks: {
        'content:file:afterParse': (ctx) => {
        // 在 URL 中隐藏指定目录的路径
            for (const prefix of blogConfig.hideContentPrefixes) {
                if (ctx.content.path?.startsWith(prefix)) {
                    ctx.content.original_dir = prefix
                    ctx.content.path = ctx.content.path.replace(prefix, '')
                }
            }
        },
    },

    icon: {
        customCollections: [
            { prefix: 'zi', dir: './assets/icons' },
        ],
        // BUG: 首次加载有概率无图标
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

    shiki: {
        bundledLangs: blogConfig.shiki.bundledLangs,
        bundledThemes: blogConfig.shiki.themes,
        defaultLang: 'log',
        defaultTheme: {
            light: blogConfig.shiki.defaultTheme,
            dark: blogConfig.shiki.darkTheme,
        },
    },

    site: {
        name: blogConfig.title,
        url: blogConfig.url,
    },
})
