import blogConfig from './blog.config'

export default defineNuxtConfig({
    app: {
        rootId: 'z-root',
        head: {
            htmlAttrs: {
                lang: blogConfig.language,
            },
            link: [
                { rel: 'icon', href: blogConfig.favicon },
                { rel: 'preconnect', href: 'https://cdn-font.hyperos.mi.com' },
                // 浏览器渲染中文 VF 字重有问题
                // https://cdn-font.hyperos.mi.com/font/css?family=MiSans:100,200,300,400,450,500,600,650,700,900:Chinese_Simplify,Latin&display=swap
                { rel: 'stylesheet', href: 'https://cdn-font.hyperos.mi.com/font/css?family=MiSans_VF:VF:Chinese_Simplify,Latin&display=swap', media: 'none', onload: 'this.media="all"' },
                { rel: 'preconnect', href: 'https://fonts.googleapis.cn' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.cn' },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.cn/css2?family=Fira+Code:wght@300..700&family=Noto+Serif+SC:wght@200..900&display=swap', media: 'none', onload: 'this.media="all"' },
                // { rel: 'preconnect', href: 'https://fonts.loli.net' },
                // { rel: 'preconnect', href: 'https://gstatic.loli.net' },
                // { rel: 'stylesheet', href: 'https://fonts.loli.net/css2?family=Fira+Code:wght@300..700&family=Noto+Serif+SC:wght@200..900&display=swap', media: 'none', onload: 'this.media="all"' },
                // { rel: 'stylesheet', href: 'https://gcore.jsdelivr.net/npm/nerdfonts-web/nf.min.css' },
            ],
            templateParams: {
                separator: '|',
            },
            titleTemplate: `%s %separator ${blogConfig.title}`,
            script: [
                { 'src': 'https://zhi.zhilu.cyou/zhi.js', 'data-website-id': 'a1997c81-a42b-46f6-8d1d-8fbd67a8ef41', 'defer': true },
                { 'src': 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "97a4fe32ed8240ac8284e9bffaf03962"}', 'defer': true },
            ],
        },
    },

    compatibilityDate: '2024-08-03',

    components: [
        { path: '~/components/partial', prefix: 'Z' },
        { path: '~/components/zhilu', prefix: 'Zhilu', global: true },
        '~/components',
    ],

    css: [
        '@/assets/main.scss',
        '@/assets/article.scss',
    ],

    experimental: {
        viewTransition: true,
    },

    future: {
        compatibilityVersion: 4,
    },

    routeRules: {
        '/api/stats': { prerender: true },
        '/atom.xml': { prerender: true },
        '/sitemap.xml': { prerender: true },
    },

    runtimeConfig: {
        public: {
            buildTime: new Date().toISOString(),
            // TODO: add stats
            // totalPosts: 0,
            // totalWords: 0,
        },
    },

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/variable.scss";',
                },
            },
        },
    },

    vue: {
        propsDestructure: true,
        runtimeCompiler: true,
    },

    modules: [
        '@nuxt/content',
        '@nuxt/icon',
        '@nuxt/image',
        '@nuxtjs/color-mode',
        '@nuxtjs/seo',
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
        locales: [
            blogConfig.language,
        ],
        highlight: {
            langs: ['bat', 'c', 'cpp', 'css', 'diff', 'html', 'ini', 'js', 'json', 'log', 'makefile', 'matlab', 'md', 'mdc', 'powershell', 'python', 'shell', 'ssh-config', 'toml', 'ts', 'tsx', 'vue', 'xml', 'yaml'],
            theme: {
                default: 'catppuccin-latte',
                dark: 'one-dark-pro',
            },
        },
        markdown: {
            remarkPlugins: ['remark-reading-time'],
        },
    },

    icon: {
        serverBundle: 'auto',
    },

    image: {
        domains: [
            // 'config.zhilu.cyou',
            // '7.isyangs.cn',
        ],
        format: ['avif', 'webp'],
    },

    ogImage: { enabled: false },

    shiki: {
        bundledThemes: ['catppuccin-latte', 'one-dark-pro'],
        bundledLangs: ['log'],
        defaultTheme: 'catppuccin-latte',
        defaultLang: 'log',
    },

    site: {
        name: blogConfig.title,
        url: blogConfig.url,
    },
})
