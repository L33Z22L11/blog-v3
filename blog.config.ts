import type { FileAfterParseHook } from '@nuxt/content'
import type { NitroConfig } from 'nitropack'
import type { BundledLanguage, BundledTheme } from 'shiki'
import type { FeedEntry } from '~/types/feed'
import { getTimezoneOffset } from 'date-fns-tz'
import redirectList from './redirects.json'

export { zhCN as dateLocale } from 'date-fns/locale/zh-CN'

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
const blogConfig = {
    title: '纸鹿摸鱼处',
    subtitle: '纸鹿至麓不知路，支炉制露不止漉',
    // 长 description 利好于 SEO
    description: '纸鹿本鹿的个人博客，分享技术与生活。“折腾不止，摸鱼生活——摸门🙏🏻”。纸鹿是一名开源爱好者，结识了许多志同道合的朋友。这个博客记录了他在生活和技术学习中的点滴经历，充满启发与思考。网站界面简洁美观，内容丰富实用，人气互动活跃，涵盖了编程、生活、学习等多个领域，为读者提供了卓越的阅读体验。',
    author: {
        name: '纸鹿本鹿',
        avatar: 'https://www.zhilu.cyou/api/avatar.png',
        email: 'hi@zhilu.cyou',
        homepage: 'https://www.zhilu.cyou/',
    },
    copyright: {
        abbr: 'CC BY-NC-SA 4.0',
        name: '署名-非商业性使用-相同方式共享 4.0 国际',
        url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
    },
    favicon: 'https://www.zhilu.cyou/api/icon.png',
    language: 'zh-Hans',
    qqGroup: '169994096',
    timeEstablished: '2019-07-19',
    timezone: 'Asia/Shanghai',
    url: 'https://blog.zhilu.cyou/',

    defaultCategory: ['未分类'],

    feed: {
        limit: 50,
    },

    // 在 URL 中隐藏的路径前缀
    hideContentPrefixes: ['/posts'],

    imageDomains: [
        // 自动启用本域名的 Nuxt Image
        // 'www.zhilu.cyou',
        // '7.isyangs.cn',
    ],

    // 禁止搜索引擎收录的路径
    robotsNotIndex: ['/preview', '/previews/*'],

    scripts: [
        // 自己部署的 Umami 统计服务
        { 'src': 'https://zhi.zhilu.cyou/zhi.js', 'data-website-id': 'a1997c81-a42b-46f6-8d1d-8fbd67a8ef41', 'defer': true },
        // Cloudflare Insights 统计服务
        { 'src': 'https://static.cloudflareinsights.com/beacon.min.js', 'data-cf-beacon': '{"token": "97a4fe32ed8240ac8284e9bffaf03962"}', 'defer': true },
    ],

    // 用于 Shiki、Plain Shiki 引入代码高亮
    // 同时用于显示代码块语言对应的 Iconify Catppuccin 图标
    shiki: {
        bundledLangs: <BundledLanguage[]>['bat', 'log', 'sh', 'powershell'],
        langs: <BundledLanguage[]>['bat', 'c', 'cpp', 'css', 'diff', 'html', 'ini', 'java', 'js', 'json', 'log', 'makefile', 'matlab', 'md', 'mdc', 'powershell', 'python', 'sh', 'sql', 'ssh-config', 'toml', 'ts', 'tsx', 'vb', 'vue', 'xml', 'yaml'],
        themes: <BundledTheme[]>['catppuccin-latte', 'one-dark-pro'],
        defaultTheme: <BundledTheme>'catppuccin-latte',
        darkTheme: <BundledTheme>'one-dark-pro',
    },

    // 用于 Twikoo 评论系统
    twikoo: {
        js: 'https://gcore.jsdelivr.net/npm/twikoo@1.6.40/dist/twikoo.all.min.js',
        // 自己部署的 Twikoo 服务
        envId: 'https://twikoo.zhilu.cyou/',
        preload: 'https://twikoo.zhilu.cyou/',
    },
}

// 用于生成 OPML 和友链页面配置
export const myFeed = <FeedEntry>{
    author: blogConfig.author.name,
    sitenick: '摸鱼处',
    title: blogConfig.title,
    desc: blogConfig.subtitle || blogConfig.description,
    link: blogConfig.url,
    feed: new URL('/atom.xml', blogConfig.url).toString(),
    icon: blogConfig.favicon,
    avatar: blogConfig.author.avatar,
    archs: ['Nuxt', 'Vercel'],
    date: blogConfig.timeEstablished,
    comment: '这是我自己',
}

// 将旧页面永久重定向到新页面
const redirectRouteRules = Object.entries(redirectList)
    .reduce<NitroConfig['routeRules']>((acc, [from, to]) => {
        acc![from] = { redirect: { to, statusCode: 301 } }
        return acc
    }, {})

// https://nitro.build/config#routerules
// @keep-sorted
export const routeRules = <NitroConfig['routeRules']>{
    ...redirectRouteRules,
    '/api/stats': { prerender: true, headers: { 'Content-Type': 'application/json' } },
    '/atom.xml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
    '/favicon.ico': { redirect: { to: blogConfig.favicon } },
    '/zhilu.opml': { prerender: true, headers: { 'Content-Type': 'application/xml' } },
}

const timezoneOffset = getTimezoneOffset(blogConfig.timezone) + new Date().getTimezoneOffset() * 60 * 1000

function fixDate(date?: string | Date) {
    if (!date)
        return date

    if (typeof date === 'string')
        date = new Date(date)

    return new Date(date.getTime() - timezoneOffset)
}

export function postprecessContent(ctx: FileAfterParseHook) {
    console.log(ctx.content)

    // 修复时区偏移
    ctx.content.date = fixDate(ctx.content.date)
    ctx.content.updated = fixDate(ctx.content.updated)
    ctx.content.published = fixDate(ctx.content.published)

    // 在 URL 中隐藏指定目录的路径
    for (const prefix of blogConfig.hideContentPrefixes) {
        if (ctx.content.path?.startsWith(prefix)) {
            ctx.content.original_dir = prefix
            ctx.content.path = ctx.content.path.replace(prefix, '')
        }
    }

    // 修复文章分类
    if (!ctx.content.categories) {
        ctx.content.categories = blogConfig.defaultCategory
    }
    console.log(ctx.content)
}

export default blogConfig
