import blogConfig from './blog.config'

export default defineNuxtConfig({
    app: {
        rootId: 'z-root',
        head: {
            htmlAttrs: {
                lang: blogConfig.language,
            },
            link: [
                ...blogConfig.injectHeadLinks,
                {
                    rel: 'icon',
                    href: blogConfig.favicon,
                },
            ],
            templateParams: {
                separator: '|',
            },
            titleTemplate: `%s %separator ${blogConfig.title}`,
            script: [
                ...blogConfig.injectHeadScripts,
            ],
        },
    },

    appConfig: blogConfig,

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
        '/': { prerender: true },
        '/atom.xml': { prerender: true },
        '/sitemap.xml': { prerender: true },
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
            langs: [
                'bat',
                'c',
                'cpp',
                'css',
                'html',
                'ini',
                'js',
                'json',
                'log',
                'makefile',
                'matlab',
                'md',
                'mdc',
                'powershell',
                'python',
                'shell',
                'ssh-config',
                'toml',
                'ts',
                'vue',
                'xml',
                'yaml',
            ],
            theme: {
                default: 'catppuccin-latte',
                dark: 'one-dark-pro',
            },
        },
    },

    image: {
        domains: blogConfig.imageDomains,
        format: ['avif', 'webp'],
    },

    ogImage: { enabled: false },

    site: {
        name: blogConfig.title,
        url: blogConfig.url,
    },
})
