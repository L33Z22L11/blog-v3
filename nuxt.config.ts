export default defineNuxtConfig({
    app: {
        rootId: 'z-root',
        head: {
            htmlAttrs: {
                lang: 'zh',
            },
            link: [
                {
                    rel: 'icon',
                    href: 'https://blog.zhilu.cyou/static/icon.png',
                },
            ],
            templateParams: {
                separator: '|',
            },
            titleTemplate: '%s %separator 纸鹿 (@L33Z22L11)',
        },
    },

    components: [
        { path: '~/components/particle', prefix: 'Z' },
        { path: '~/components/zhilu', prefix: 'ZL' },
        '~/components',
    ],

    css: [
        '@/assets/main.scss',
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
        domains: [
            'blog.zhilu.cyou',
        ],
        format: ['avif', 'webp'],
    },

    site: {
        url: 'https://zhilu.cyou',
    },

    compatibilityDate: '2024-07-23',
})
