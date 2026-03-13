import type { FeedGroup } from '../app/types/feed'
// 友链检测 CLI 需要使用显式导入和相对路径
import { get } from 'radash'
import { myFeed } from '../blog.config'
// eslint-disable-next-line unused-imports/no-unused-imports
import { getFavicon, getGithubAvatar, getGithubIcon, getOciqGroupAvatar, getOicqAvatar, OicqAvatarSize } from './utils/img'

export default [
	// #region Clarity
	{
		name: '清晰体验',
		desc: '使用 Clarity 博客主题构建的网站。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			myFeed,
			// {
			// 	author: 'GuuGuai',
			// 	sitenick: '杂记本',
			// 	title: '古怪杂记本',
			// 	desc: '一个什么都可能会写的博客',
			// 	link: 'https://blog.guuguai.site/',
			// 	feed: 'https://blog.guuguai.site/atom.xml',
			// 	icon: 'https://cravatar.cn/avatar/646331BFF8F19A0E05679C3CC0FC54D6',
			// 	avatar: 'https://cdn.libravatar.org/avatar/646331bff8f19a0e05679c3cc0fc54d6?s=160',
			// 	archs: ['Nuxt', 'Netlify'],
			// 	date: '2023-12-23',
			// 	comment: '高中同学，技术好友，爱好番剧/折腾。',
			// },
			{
				author: '梦爱吃鱼',
				desc: '不负心灵，不负今生。',
				link: 'https://blog.bsgun.cn/',
				feed: 'https://blog.bsgun.cn/atom.xml',
				icon: 'https://bsgun.cn/favicon.ico',
				avatar: 'https://oss-cdn.bsgun.cn/logo/avatar.256.png',
				archs: ['Nuxt', 'EdgeOne'],
				date: '2024-08-20',
				comment: '博客折腾',
			},
		],
	},
	// #endregion
	// #region 网上邻居 since 2024
	{
		name: '网上邻居',
		desc: '哔——啵——电波通讯中，欢迎常来串门。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			// {
			// 	author: '恩泽',
			// 	sitenick: 'Colsrch',
			// 	title: 'Colsrch的小破站',
			// 	desc: '愿多年以后，我可以酌一杯清酒，烂醉如泥，梦中回到我们的曾经。',
			// 	link: 'https://colsrch.cn/',
			// 	feed: 'https://colsrch.cn/atom.xml',
			// 	icon: getFavicon('colsrch.cn'),
			// 	avatar: 'https://bu.dusays.com/2022/02/23/cb173cbdcc7c6.png',
			// 	archs: ['Hexo', '国内 CDN'],
			// 	date: '2024-02-01',
			// 	comment: '鸽王，去哪里发展了？',
			// },
			// {
			// 	author: '小李同学',
			// 	sitenick: 'Coding',
			// 	title: '小李同学 Coding',
			// 	desc: '一支努力变强的小彩笔',
			// 	link: 'https://blog.xxfer.cn/',
			// 	feed: 'https://blog.xxfer.cn/rss.xml',
			// 	icon: getFavicon('blog.xxfer.cn'),
			// 	avatar: getGithubAvatar('JJLibra'),
			// 	archs: ['Hexo', '国内 CDN'],
			// 	date: '2024-02-01',
			// 	comment: '瓜大网安学长。',
			// 	error: '域名2025-10-28过期',
			// },
			{
				author: '张洪Heo',
				desc: '分享设计与科技生活',
				link: 'https://blog.zhheo.com/',
				feed: 'https://blog.zhheo.com/atom.xml',
				icon: 'https://blog.zhheo.com/img/favicon4.0.webp',
				avatar: 'https://bu.dusays.com/2022/12/28/63ac2812183aa.png',
				archs: ['Hexo', '国内 CDN'],
				date: '2024-02-02',
				comment: '知名博主，其博客设计风格被众多人借鉴。',
			},
			// #region 2025
			{
				author: '花生莲子粥',
				desc: '与世无争，不染于泥',
				link: 'https://blog.hslzz.cn/',
				icon: 'https://blog.hslzz.cn/favicon.ico',
				avatar: 'https://blog.hslzz.cn/img/avatar.png',
				archs: ['Hexo', '国内 CDN'],
				date: '2025-01-03',
				comment: 'Linux系统配置、服务部署、Hexo优化等技术教程，',
			},
			// #region 2026
			{
				author: '见崎美咲',
				sitenick: 'Catarium',
				desc: '见崎的猫箱',
				link: 'https://catarium.me/',
				feed: 'https://catarium.me/atom.xml',
				icon: 'https://catarium.me/favicon.ico',
				avatar: getGithubAvatar('Eofs791'),
				archs: ['Valaxy', 'GitHub Pages'],
				date: '2026-01-02',
				comment: '加拿大留子，二次元。',
			},
			/* ========从此处新增友链======== */
		],
	},
	// #endregion
	// #region KEEP
	{
		name: 'KEEP',
		desc: 'KEEP',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: '梦爱吃鱼',
				desc: '不负心灵，不负今生。',
				link: 'https://blog.bsgun.cn/',
				feed: 'https://blog.bsgun.cn/atom.xml',
				icon: 'https://bsgun.cn/favicon.ico',
				avatar: 'https://oss-cdn.bsgun.cn/logo/avatar.256.png',
				archs: ['Nuxt', 'EdgeOne'],
				date: '2024-08-20',
				comment: '博客折腾',
			},
		],
	},
	// #endregion
	// #region 知识分享
	{
		name: '知识分享',
		desc: '“AI时代”创作分享/知识内容收集。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: '茂茂物语',
				desc: '茂茂的成长之路，包含前端常用知识、源码阅读笔记、各种奇淫技巧、日常提效工具等',
				link: 'https://notes.fe-mm.com/',
				icon: getGithubIcon('maomao1996'),
				avatar: getGithubAvatar('maomao1996'),
				archs: ['VitePress', 'Cloudflare'],
				date: '2024-02-17',
				comment: '前端开发笔记。',
			},
		],
	},
	// #endregion
	// #region 漫游
	{
		name: '漫游',
		desc: '网上冲浪时发现的精彩内容与常读订阅，与君共享。',
		// @keep-sorted { "keys": ["date"] }
		entries: [
			{
				author: '风记星辰',
				desc: '热爱你来过的每度温暖',
				feed: 'https://www.thyuu.com/feed',
				link: 'https://thyuu.com/',
				icon: 'https://std.thyuu.com/logo.svg',
				avatar: 'https://std.thyuu.com/logo.svg',
				archs: ['WordPress', '服务器'],
				date: '2024-02-01',
			},
		],
	},
	// #endregion
] satisfies FeedGroup[]
