import type { NitroConfig } from 'nitropack'
import type { FeedEntry } from './app/types/feed'
import redirectList from './redirects.json'

export { zhCN as dateLocale } from 'date-fns/locale/zh-CN'

// 存储 nuxt.config 和 app.config 共用的配置
// 此处为启动时需要的配置，启动后可变配置位于 app/app.config.ts
const blogConfig = {
	title: '地球驿站',
	subtitle: '向上革命，向下实践。',
	// 长 description 利好于 SEO
	description: '这里是 Mugzx 的个人博客，名为地球驿站，平时会记录我对日常生活的一些观点看法，偶尔也会回归正业写一点技术型文章，欢迎大家多多前来访问！',
	author: {
		name: 'Mugzx',
		avatar: 'https://www.mugzx.top/api/avatar.png',
		email: 'me@mugzx.top',
		homepage: 'https://www.mugzx.top',
	},
	copyright: {
		abbr: 'CC BY-NC-SA 4.0',
		name: '署名-非商业性使用-相同方式共享 4.0 国际',
		url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans',
	},
	favicon: 'https://www.mugzx.top/icon.png',
	language: 'zh-CN',
	timeEstablished: '2024-03-15', // 域名注册后博客正式上线
	timezone: 'Asia/Shanghai',
	url: 'https://blog.mugzx.top',

	defaultCategory: ['未分类'],

	feed: {
		limit: 50,
	},

	// 在 URL 中隐藏的路径前缀
	hideContentPrefixes: ['/posts'],

	imageDomains: [
		// 自动启用本域名的 Nuxt Image
		// 'www.mugzx.top',
		// 'mu-s4.s3.bitiful.net',
		// 'r2.mugzx.top',
		'wsrv.nl',
	],

	// 禁止搜索引擎收录的路径
	robotsNotIndex: ['/preview', '/previews/*'],

	scripts: [
		// 自己部署的 Umami 统计服务
		{ 'src': 'https://u.mugzx.top/script.js', 'data-website-id': '67b04aa0-edac-456d-bbe1-7ddd2bff9008', 'defer': true },
		// Twikoo 评论系统
		{ src: 'https://s4.zstatic.net/npm/twikoo@1.6.44/dist/twikoo.min.js', integrity: 'sha384-dZ/hSVfTPHuzXyECOYCetAvMd0cgqWxN5Fh+mwo86PV4GdU9xgQ/MNzh/YM/lotR', crossorigin: 'anonymous', defer: true },
	],

	// 自己部署的 Twikoo 服务
	twikoo: {
		envId: 'https://t.mugzx.top',
		preload: 'https://t.mugzx.top',
	},
}

// 用于生成 OPML 和友链页面配置
export const myFeed = <FeedEntry>{
	author: blogConfig.author.name,
	sitenick: '驿站',
	title: blogConfig.title,
	desc: blogConfig.subtitle || blogConfig.description,
	link: blogConfig.url,
	feed: new URL('/atom.xml', blogConfig.url).toString(),
	icon: blogConfig.favicon,
	avatar: blogConfig.author.avatar,
	archs: ['Nuxt', 'Vercel'],
	date: blogConfig.timeEstablished,
	comment: '这是我自己。',
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

export default blogConfig
