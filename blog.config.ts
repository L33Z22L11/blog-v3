import type { Nav } from '~/types/nav'
import type { Themes } from '~/types/theme'

const author = {
    name: '纸鹿本鹿',
    avatar: 'https://www.zhilu.cyou/api/avatar.png',
    email: 'hi@zhilu.cyou',
    homepage: 'https://zhilu.cyou/',
}

export default {

    // basic

    title: '纸鹿摸鱼处',
    description: '纸鹿本鹿的个人博客，分享技术与生活。折腾不止，摸鱼生活——摸门🙏🏻',
    header: {
        logo: 'https://wsrv.nl/?url=github.com/L33Z22L11.png',
        text: true,
        subtitle: '纸鹿至麓不知路，支炉制露不止漉',
        emojiTail: ['📄', '🦌', '🙌', '🐟', '🏖️'],
    },
    author,
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    favicon: 'https://www.zhilu.cyou/api/icon.png',
    url: 'https://blog.zhilu.cyou/',
    copyright: {
        abbr: 'CC BY-NC-SA 4.0',
        name: '署名-非商业性使用-相同方式共享 4.0 国际',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
    },

    // items

    article: {
        categories: {
            经验分享: { icon: 'solar:cursor-bold-duotone', color: '#3af' },
            生活: { icon: 'solar:star-fall-2-bold-duotone', color: '#3ba' },
            代码: { icon: 'solar:code-bold-duotone', color: '#77f' },
        },
    },

    footer: {
        copyright: `© ${new Date().getFullYear()} 纸鹿本鹿`,
        nav: <Nav>[
            { title: '探索', items: [
                // { icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
                { icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/go-by-clouds.html' },
                { icon: 'ph:flying-saucer-bold', text: '异次元旅行', url: 'https://travel.moe/go.html?travel=on' },
            ] },
            { title: '社交', items: [
                { icon: 'ph:github-logo-bold', text: 'L33Z22L11', url: 'https://github.com/L33Z22L11' },
                { icon: 'ri:qq-line', text: '群: 169994096', url: 'https://jq.qq.com/?_wv=1027&k=lQfNSeEd' },
                { icon: 'ph:envelope-simple-bold', text: author.email, url: `mailto:${author.email}` },
            ] },
            { title: '信息', items: [
                { icon: 'ph:swatches-bold', text: '主题灵感源自Stellar', url: '/theme' },
                { icon: 'ph:certificate-bold', text: '萌ICP备20246888号', url: 'https://icp.gov.moe/?keyword=20246888' },
            ] },
        ],
        message: '',
    },

    nav: <Nav>[
        { title: '', items: [
            { icon: 'ph:files-bold', text: '文章', url: '/' },
            { icon: 'ph:link-bold', text: '友链', url: '/link' },
            { icon: 'ph:archive-bold', text: '归档', url: '/archive' },
        ] },
        { title: '周边', items: [
            { icon: 'ph:identification-card-bold', text: '个人主页', url: 'https://zhilu.cyou/', external: true },
            { icon: 'ri:qq-line', text: '群: 169994096', url: 'https://jq.qq.com/?_wv=1027&k=lQfNSeEd', external: true },
            { icon: 'ph:github-logo-bold', text: 'Github', url: 'https://github.com/L33Z22L11', external: true },
        ] },
    ],

    sidebar: {
        footerLink: {
            text: 'L33Z22L11/blog-v3',
            url: 'https://github.com/L33Z22L11/blog-v3',
        },
    },

    themes: <Themes> {
        light: {
            icon: 'ph:sun-bold',
            tip: '浅色模式',
        },
        system: {
            icon: 'ph:monitor-bold',
            tip: '跟随系统',
        },
        dark: {
            icon: 'ph:moon-bold',
            tip: '深色模式',
        },
    },

    // others

    hideContentPrefixes: [
        '/posts',
    ],

    imageDomains: [
        // 'blog.zhilu.cyou',
        // '7.isyangs.cn',
    ],

    indexGenerator: {
        perPage: 10,
        orderBy: 'date',
    },

    injectHeadLinks: [
        {
            rel: 'preconnect',
            href: 'https://s1.hdslb.com',
        },
        {
            rel: 'stylesheet',
            href: 'https://s1.hdslb.com/bfs/static/jinkela/long/font/medium.css',
            media: 'none',
            onload: 'this.media="all"',
        },
        {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com',
        },
        {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
        },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@200..900&display=swap',
        },
    ],

    injectHeadScripts: [
        { 'src': 'https://zhi.zhilu.cyou/zhi.js', 'data-website-id': 'a1997c81-a42b-46f6-8d1d-8fbd67a8ef41', 'defer': true },
        { 'src': 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "97a4fe32ed8240ac8284e9bffaf03962"}', 'defer': true },
    ],

    twikoo: {
        js: 'https://gcore.jsdelivr.net/npm/twikoo@1.6.36/dist/twikoo.all.min.js',
        envId: 'https://t12.zhilu.cyou',
    },
}
