---
title: VitePress 不完全优化指南
description: VitePress 的基本使用与定制技巧，涵盖项目初始化、汉化配置、图标引入、自定义主题等内容，旨在利用 VitePress 构建美观、高效的静态站点。
date: 2024-11-03 17:54:50
updated: 2025-09-15 23:19:18
image: https://assets.zhilu.cyou/cover4/vitepress-enhancement.jpg
categories: [开发]
tags: [VitePress, 前端优化, 博客]
---

VitePress 是一个非常优秀的静态站点生成器，它使用 Vite 作为构建工具，并内置了 Vue 的支持。它上手简单，页面美观，许多开源项目的文档都使用 VitePress 生成。官方文档非常详细，这里补充一些周边和扩充用法。

## 不负责任地初始化

### 来用 pnpm 吧

使用 pnpm 可以提高安装速度并减少磁盘占用。按照终端提示操作即可。

- 通过 npm 安装 pnpm
  :copy{code="npm i -g pnpm"}
- 更改 PowerShell 脚本 [执行策略](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies)
  :copy{code="Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"}
  - 也可通过管理员权限更改系统策略
	:copy{code="sudo Set-ExecutionPolicy RemoteSigned"}
- 初始化 pnpm
  :copy{code="pnpm setup"}
  - 初始化后，由于环境变量变化，需要启动一个新的 PowerShell 会话

### 会的话看看文档，不会了就多看文档

::link-card
---
icon: https://vitepress.dev/vitepress-logo-large.webp
title: VitePress | 由 Vite 和 Vue 驱动的静态站点生成器
link: https://vitepress.dev/zh/
---
::

个人认为官方文档写得是自己读过的最好一梯队的，除了基本的项目的初始化和配置，还包含大量细节技巧、示例参考和主题功能扩展方法。

### ~~简单项目，无需包锁~~

:blur[在简单项目中，无需生成 `package-lock.json` 或 `pnpm-lock.json` 文件。如果遇到问题，莫说是我教的。] pnpm 会将依赖包按嵌套结构组织，使用 `shamefully-hoist` 可以使其恢复为 npm 的扁平结构，提高兼容性。

```ini [.npmrc]
# package-lock=false
shamefully-hoist=true
```

### 也许需要汉化

在使用 VitePress 的时候，你也许会发现一些内容是英文，这时可以通过添加如下配置项来汉化（不要删除原有配置），在使用此配置时应对照文档弄清每一项作用。

```ts [docs/.vitepress/config.mts]
import type { DefaultTheme } from 'vitepress';
import { defineConfig } from 'vitepress'

// https://vitepress.dev/zh/reference/site-config
export default defineConfig({
	lang: 'zh-Hans',
	themeConfig: {
		// https://vitepress.dev/zh/reference/default-theme-config
		nav: nav(),
		sidebar: sidebar(),
		externalLinkIcon: true,
		langMenuLabel: '切换语言',
		darkModeSwitchLabel: '主题',
		lightModeSwitchTitle: '切换到浅色模式',
		darkModeSwitchTitle: '切换到深色模式',
		sidebarMenuLabel: '菜单',
		outline: { level: [2, 3], label: '目录' },
		returnToTopLabel: '返回顶部',
		// 请将此链接修改为正确的URL，或根据需求删除该配置
		// editLink: { pattern: 'https://github.com/username/repository-name/blame/main/docs/:path', text: '源代码', },
		lastUpdated: { text: '更新于' },
		docFooter: { prev: '上一篇', next: '下一篇' },
	},
	vite: { server: { allowedHosts: true } },
})

// 将导航和侧边栏逻辑提取到外部，便于根据文档结构进行维护
function nav(): DefaultTheme.NavItem[] {
	return []
}

function sidebar(): DefaultTheme.Sidebar {
	return { '/': [] }
}
```

特别地，404 页面也需要汉化，在主题入口处向 `not-found` 插槽中 [注入组件](https://vitepress.dev/zh/guide/extending-default-theme#layout-slots) 即可，成品入口文件在 [扩展主题](#扩展主题) 一节。

## Git 统计的修正

如果你的项目是使用 VitePress 构建的网站（文档即项目），GitHub 的语言统计可能不够准确。GitHub 使用 Linguist 库来统计仓库语言（[详情](https://docs.github.com/zh/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-repository-languages)），默认情况下会忽略 Markdown 文件和常见的文档文件夹（如 `/docs`）。为了获得更准确的统计结果，可以通过覆盖 GitHub Linguist 配置（[英文文档](https://github.com/github-linguist/linguist/blob/main/docs/overrides.md)）来调整统计策略。

```ini [.gitattributes]
*.md linguist-detectable=true
docs/** linguist-documentation=false
```

这样，`/docs` 文件夹里的 Markdown 文件和其他文件也会被统计到。

## 图标的千种引入

在直接调用图片或插入 SVG 代码作为图标之后，也许可以尝试多种办法为你的网站增加图标。

### 使用 Emoji

:icon{name="twemoji:grinning-face-with-big-eyes" title="骗你的，其实我不是 Emoji 字符，我是 Iconify"} 谁说 Emoji 不是图标呢？🚀巧妙运用 Emoji 可以让网页增色不少。📓在社交平台和注重情绪表达的纯文本编辑场景（如微信朋友圈、小红书）中，我们经常会看到大量 Emoji 字符，用于排版和情绪表达。📖在人们获取文本信息之前，这些 Emoji 往往作为视觉的“预读取”元素，帮助传递情绪氛围或提示内容主题。🌨️例如在博客 [風雪城](https://blog.chyk.ink/) 中，每篇文章标题使用了一个前置 Emoji，不仅让排版更整齐，还生动概括了文章的主题。

### 通过 CDN 引入图标 CSS

通过 CDN 引入图标 CSS 是一种利用 Unicode 私有区域和自定义字体来高效管理和优化图标加载的方式。图标实际上是使用特定字体的 Unicode 私有区域字符，通过 CSS 伪类选择器替换，实现图标显示，并避免被文本选中。

::alert{type="warning" title="公共 CDN 服务的安全风险"}
Staticfile CDN、BootCDN（bootcss）、51LA 统计等公共服务已被发现存在安全问题，使用这些服务可能会导致网站加载恶意内容或被用户的安全策略阻止访问，从而影响网站的正常功能。建议在引入外部脚本时启用子资源完整性（Subresource Integrity，SRI）功能，以提高安全性。
::

- ![](https://fontawesome.com/images/favicon/icon.svg){.icon title="其实我不是 CDN 引入的，我也不是 Iconify，我是图片"} Font Awesome [图标搜索](https://fontawesome.com/search?ic=free)
  - :copy{prompt="75CDN" code="https://lib.baomitu.com/font-awesome/7.0.0/css/all.min.css"}
  - :copy{prompt="未闻花名" code="https://cdnjs.snrat.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"}
  - :copy{prompt="7ED" code="https://use.sevencdn.com/ajax/libs/font-awesome/7.0.0/css/all.min.css"}
  - :copy{prompt="WebMirror" code="https://cdnjs.webstatic.cn/ajax/libs/font-awesome/7.0.0/css/all.min.css"}
- ![](https://api.iconify.design/devicon:bootstrap.svg){.icon title="我是通过 Iconify API 引入的，但我是图片"} Bootstrap Icons [图标搜索](https://icons.getbootstrap.com/)
  - :copy{prompt="南科大" code="https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/bootstrap-icons/1.13.1/font/bootstrap-icons.min.css"}
  - :copy{prompt="loli.net" code="https://cdnjs.loli.net/ajax/libs/bootstrap-icons/1.13.1/font/bootstrap-icons.min.css"}
  - :copy{prompt="ZStatic" code="https://s4.zstatic.net/ajax/libs/bootstrap-icons/1.13.1/font/bootstrap-icons.min.css"}
  - :copy{prompt="ZStatic-unpkg" code="https://s4.zstatic.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"}

至于在 VitePress 站点的 `<head>`{lang="html"} 标签中引入 CSS？[看文档](https://vitepress.dev/zh/reference/site-config#head) 吧。当然，引入后不要忘了设置“固定宽度”和“垂直居中”样式。

### Google Fonts

谷歌字体除了字体外还有图标，使用文档参见 [Material 符号指南](https://developers.google.cn/fonts/docs/material_symbols)。

- 为增强可访问性，可以将谷歌字体 CSS 资源替换为以 `.cn` 结尾的域名。
  :copy{prompt="CSS" code="https://fonts.googleapis.cn/css2?family=Material+Symbols+Outlined"}

### 其实我在用 Iconify

:icon{name="line-md:iconify1" title="这下终于是 Iconify 了"} Iconify 是一个支持 20 多万个开源矢量图标的框架，提供跨平台的统一图标组件，兼容多种 UI 框架和图标集，让你轻松使用高质量、无供应商锁定的图标。

- [官网（英文文档）](https://iconify.design)
- [图标库（官方搜索）](https://icon-sets.iconify.design/)
- [Yesicon（第三方搜索）](https://yesicon.app/)

它收录了 :icon{name="ic:baseline-android"} :icon{name="ic:baseline-signal-wifi-bad"} :icon{name="ic:baseline-battery-charging-60"} Material Design 的符号图标、 :icon{name="simple-icons:3m"} :icon{name="simple-icons:xiaohongshu"} :icon{name="simple-icons:xiaomi"} Simple Icons 的品牌图标、 :icon{name="vscode-icons:file-type-photoshop2"} :icon{name="catppuccin:kotlin"} 各种文件图标、 :icon{name="ph:chats-circle-duotone"} :icon{name="noto:crystal-ball"} 双色/彩色图标和 :icon{name="line-md:uploading-loop"} :icon{name="svg-spinners:bars-rotate-fade"} 动画图标等。相比 Iconfont，这些图标的风格更容易统一，并且引入前端项目更加方便，支持 Tailwind CSS、UnoCSS、React、Vue、Svelte 等多种框架。我偶尔也会下载这些图标用于 PPT 演示。

- VitePress 适合安装 `@iconify/vue`
  :copy{code="pnpm i @iconify/vue"}
- 在主题入口文件导入并注册 `Icon` 组件，成品入口文件在下一节
- 在 Markdown 中通过 `<Icon icon="ph:hand-heart-duotone" />`{lang="html"} 使用图标
- 配置项里的字符串不会经过 Vue 渲染，需要将对应位置换用 Vue 组件或是回退至 CDN 引入的图标字体

## 自定义主题

### 扩展主题

这是经过修改的 VitePress 主题入口文件，它~~保留了一部分原本的味道~~基于默认主题做了一点优化：

- 将原文件注释中的链接换成了对应的中文链接
- 引入了 `@iconify/vue` 并注册为 `Icon` 组件
- 移除了 Inter 字体打包，加载速度更快
- 注册了文章版式的页脚（需自行编写 `Footer` 组件）
- 注册了自定义 404 页面（需自行编写 `NotFound` 组件）
- 引入了 `./theme-enhanced.css`（在下方提供）

```ts [docs/.vitepress/theme/index.ts]
// https://vitepress.dev/zh/guide/custom-theme
import type { Theme } from 'vitepress'
import { Icon } from '@iconify/vue'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue'

import Footer from '../components/Footer.vue'
import NotFound from '../components/NotFound.vue'

import './theme-enhanced.css'
import './style.css'

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
			'doc-bottom': () => h(Footer),
			'not-found': () => h(NotFound),
		})
	},
	enhanceApp({ app }) {
		app.component('Icon', Icon)
	},
} satisfies Theme
```

### 安置图标

对于 Font Awesome 和 Iconify 的图标，这是我常用的安置方式，在行文中的排版更自然。

```css [docs/.vitepress/theme/style.css]
/* Font Awesome 7 无需此声明 */
.fa-solid, .fa-regular, .fa-brands {
	width: 1.2em;
	vertical-align: middle;
	text-align: center;
}

svg:where(.iconify) {
	display: inline-block;
	flex-shrink: 0;
	font-size: 1.2em;
	vertical-align: sub;
}
```

### 优化样式

官方文档中有许多关于主题自定义的内容，如 [更改主页大标题的颜色](https://vitepress.dev/zh/reference/default-theme-home-page#customizing-the-name-color)。

“GitHub 风格的警报”或“自定义容器”是文章中用于展示技巧或警告的组件，但若仅包含标题，则会导致上下边距不对称，可以在自定义 CSS 中添加如下样式以修正。

```css [docs/.vitepress/theme/theme-enhanced.css]
.vp-doc .custom-block {
	padding: 8px 16px;
}

.vp-doc .custom-block :first-child:first-child {
	margin: 8px 0;
}
```

其他常用样式也一并列出，当然，在使用前最好知道这些代码意味着什么：

```css [theme-enhanced.css]
/* stylelint-disable selector-class-pattern */
:root {
	--font-monospace: "JetBrains Mono", "Cascadia Code", "Fira Code", "Monaco", "Consolas", "monospace", "Noto Sans SC", system-ui, monospace;
}

.VPMenuGroup > .title {
	font-size: 0.7em;
}

.VPSwitch > .check {
	bottom: 1px;
	width: auto;
	height: auto;
	aspect-ratio: 1;
}

.vp-doc > div > :where(h4, h5, h6) {
	margin: 1.4em 0 0.5em;
}

.vp-doc blockquote > p {
	margin: 1em 0;
}

.vp-doc table {
	font-variant-numeric: tabular-nums;
}

.vp-doc a {
	background: linear-gradient(var(--vp-c-brand-soft), var(--vp-c-brand-soft)) no-repeat center bottom / 100% 2px;
	text-decoration: none;
	transition: 0.2s;
}

.vp-doc a:hover {
	border-radius: 0.2em;
	background: linear-gradient(var(--vp-c-brand-soft), var(--vp-c-brand-soft)) no-repeat center bottom / 100% 100%;
}

.vp-doc strong {
	background: linear-gradient(var(--vp-c-brand-soft), var(--vp-c-brand-soft)) no-repeat center bottom / 100% 40%;
}

.vp-doc s {
	opacity: 0.6;
}

.vp-doc ::marker {
	color: var(--vp-c-brand-1);
}

.vp-doc ol:not([class]), .vp-doc ol:not([class]) ol ol ol {
	list-style-type: revert;
}

.vp-doc ol:not([class]) ol, .vp-doc ol:not([class]) ol ol ol ol {
	list-style-type: lower-alpha;
}

.vp-doc ol:not([class]) ol ol, .vp-doc ol:not([class]) ol ol ol ol ol {
	list-style-type: lower-roman;
}

.VPBadge {
	margin: 0 0.1em;
	padding: 0.2em 0.5em;
	font-size: 0.8em;
	line-height: 1.2;
	transform: translateY(-0.1em);
}
```

如果需要在某些选择器中重置上述 `a` 样式，即使在开发环境中看起来已成功重置，但由于构建产物中 CSS 出现顺序的变化，实际样式可能并未生效。在不使用 `!important` 的情况下，可以通过重复父级类名来提升样式的优先级。

```css [some-component.vue]
.some-comp.some-comp a {
	background: unset;
}

.some-comp.some-comp a[target]::after {
	content: unset;
}
```

还有一些有趣的样式，试一试就知道是什么了：

```css [docs/.vitepress/theme/style.css]
/* 首页 Feature 图标样式 */
.VPFeature {
	position: relative;
	overflow: hidden;
	z-index: 0;
}

.VPFeature .icon {
	position: absolute;
	opacity: 0.15;
	inset-inline-end: 10%;
	background-color: transparent;
	font-size: 8em;
	z-index: -1;
}

/* 文档二级标题编号 */
.vp-doc {
	counter-reset: section-counter;
}

.vp-doc h2 {
	counter-increment: section-counter;
}

.vp-doc h2::before {
	content: counter(section-counter);
	position: absolute;
	inset-inline-start: -2rem;
	font-size: 3rem;
	font-weight: bold;
	color: var(--vp-c-divider);
	z-index: -1;
}
```

### 编写自定义组件

对于具备 Vue 基础的同学，可以很轻易的编写自定义组件。你可以参考 [团队页](https://vitepress.dev/zh/reference/default-theme-team-page) 和它的源码来编写自己的组件。

## 不止于默认主题

VitePress 的默认主题适合文档，而对于博客，已经出现 [Curve](https://github.com/imsyy/vitepress-theme-curve)、[BlueArchive](https://github.com/Alittfre/vitepress-theme-bluearchive) 等美观且趣味的主题，你也可以 [搜索对应话题](https://github.com/topics/vitepress-theme) 找到更多。

啊？你说部署？[看! 文! 档！](https://vitepress.dev/zh/guide/deploy){.text-zoom}
