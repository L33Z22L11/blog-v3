import blogConfig from './blog.config'

export default defineNuxtConfig({
    app: {
        rootId: 'z-root',
        head: {
            htmlAttrs: {
                lang: blogConfig.lang,
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
        },
    },

    appConfig: blogConfig,

    components: [
        { path: '~/components/particle', prefix: 'Z' },
        { path: '~/components/zhilu', prefix: 'ZL' },
        '~/components',
    ],

    css: [
        '@/assets/main.scss',
        '@/assets/article.scss',
    ],

    devtools: { enabled: false },

    experimental: {
        viewTransition: true,
    },

    srcDir: './',

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

    image: {
        domains: blogConfig.imageDomains,
        format: ['avif', 'webp'],
    },

    site: {
        url: blogConfig.url,
    },

    compatibilityDate: '2024-07-23',
})
