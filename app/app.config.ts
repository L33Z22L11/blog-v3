import type { Nav, NavItem } from '~/types/nav'
import blogConfig from '~~/blog.config'

// 图标查询：https://yesicon.app/ph
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

// @keep-sorted
export default defineAppConfig({
	// 将 blog.config 中的配置项复制到 appConfig，方便调用
	...blogConfig,

	article: {
		categories: <{ [category: string]: { icon: string, color?: string } }>{
			分享: { icon: 'ph:mouse-bold', color: '#33aaff' },
			随笔: { icon: 'ph:shooting-star-bold', color: '#6969ff' },
			编程: { icon: 'ph:code-bold', color: '#3366ff' },
			未分类: { icon: 'ph:folder-dotted-bold' },
		},
		defaultCategoryIcon: 'ph:folder-bold',
		/** 分类排序方式，键为排序字段，值为显示名称 */
		order: {
			date: '创建日期',
			updated: '更新日期',
			// title: '标题',
		},
	},

	content: {
		/** 代码块自动折叠触发行数 */
		codeblockCollapsibleRows: 16,
		/** 文章开头摘要 */
		excerpt: {
			animation: true,
			caret: '_',
		},
	},

	// @keep-sorted
	footer: {
		/** 页脚版权信息，支持 <br> 换行等 HTML 标签 */
		copyright: `© ${new Date().getFullYear()} ${blogConfig.author.name}`,
		/** 侧边栏底部图标导航 */
		iconNav: [
			{ icon: 'ph:house-bold', text: '个人主页', url: blogConfig.author.homepage },
			{ icon: 'ri:qq-line', text: '交流电台', url: 'https://qm.qq.com/q/lZxfLjrbxu' },
			{ icon: 'ph:github-logo-bold', text: 'GitHub: Mugzx', url: 'https://github.com/mugzx' },
			{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
			{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/go.html' },
		] satisfies NavItem[],
		/** 页脚站点地图 */
		nav: [
			{
				title: '探索',
				items: [
					{ icon: 'ph:rss-simple-bold', text: 'Atom订阅', url: '/atom.xml' },
					{ icon: 'ph:subway-bold', text: '开往', url: 'https://www.travellings.cn/go.html' },
					{ icon: 'ph:flying-saucer-bold', text: '异次元旅行', url: 'https://travel.moe/go.html?travel=on' },
				],
			},
			{
				title: '社交',
				items: [
					{ icon: 'ri:bilibili-fill', text: 'Mugzx', url: 'https://space.bilibili.com/487110375' },
					{ icon: 'ri:qq-line', text: '交流电台', url: 'https://qm.qq.com/q/lZxfLjrbxu' },
					{ icon: 'ph:envelope-simple-bold', text: blogConfig.author.email, url: `mailto:${blogConfig.author.email}` },
				],
			},
			{
				title: '信息',
				items: [
					{ icon: 'simple-icons:nuxtdotjs', text: 'L33Z22L11/blog-v3', url: 'https://github.com/L33Z22L11/blog-v3' },
					{ icon: 'heroicons-outline:status-online', text: 'Mugzx-站点监测', url: 'https://s.mugzx.top' },
					{ icon: 'ph:certificate-bold', text: '萌备20259900号', url: 'https://icp.gov.moe/?keyword=20259900' },
				],
			},
		] satisfies Nav,
	},

	/** 左侧栏顶部 Logo */
	header: {
		logo: 'https://weavatar.com/avatar/7e3dc62d2db6965f993ee5e0bc6dea56a8d401fcf5271b3029582ed25232ad0d?d=blank&s=160',
		/** 展示标题文本，否则展示纯 Logo */
		showTitle: true,
		subtitle: blogConfig.subtitle,
		emojiTail: ['🌙', '💡', '📝', '👇', '🌏'],
	},

	/** 左侧栏导航 */
	nav: [
		{
			title: '',
			items: [
				{ icon: 'ph:files-bold', text: '驻站笔记', url: '/' },
				{ icon: 'ph:link-bold', text: '站友电台', url: '/link' },
				{ icon: 'ph:archive-bold', text: '驿站仓库', url: '/archive' },
				{ icon: 'ph:info-bold', text: '我与驿站', url: '/about' },
			],
		},
	] satisfies Nav,

	pagination: {
		perPage: 10,
		/** 默认排序方式，需要是 this.article.order 中的键名 */
		sortOrder: 'date' as const,
		/** 允许（普通/预览/归档）文章列表正序，开启后排序方式左侧图标可切换顺序 */
		allowAscending: false,
	},

	stats: {
		/** 归档页面每年标题对应的年龄 */
		birthYear: 2009,
		/** blog-stats widget 的预置文本 */
		wordCount: '约10万',
	},

	themes: {
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
})
