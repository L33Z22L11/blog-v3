---
title: 博客进化：从 Hexo 到 Nuxt Content
description: 抬笔一挥，便洒出占半的前端样式代码。开发功能并不慢，样式优化与问题修复却很耗时间。博客前端的现代化转型，且听我话其分晓。
date: 2024-08-27 18:30:55
updated: 2024-09-02 02:06:17
categories: [经验分享]
tags: [网站, 博客]
type: story
---

## 升级动力

### Hexo 主题

2023年5月24日，我使用 Heo 风格的 Acrylic 主题，将个人网站升级为 Hexo 博客。但不久之后，Acrylic 主题停止维护，同时 Heo 风格的博客主题大行其道，令我感到「泯然于众Blog」。

于是在2024年1月9日，我选择了偶然之间瞥见的「千雪的咖啡厅」的上游主题 Stellar。并且惊喜地发现，Stellar 的作者 xaoxuu 也是知名主题 Volantis 的主要贡献者。朋友 Colsrch 负责管理 Volantis 主题交流群，我也曾于2020年加入了交流群。

### 「站」际关系

在更换 Stellar 主题之后，我于2024年1月29日开始积极更新博客，并添加了一些友链，藉以丰富自己的「站」际关系。由于几天后友链「微光档案」无法访问，我通过 Internet Archive 找到并加入了网站交流群，了解到正在备案。自此，命运的齿轮开始转动，我与「微光档案」的站长 KazariEX 在后来结下了更深的联系。

### 博客美化

Stellar 主题的更新迭代速度很快，就如同我博客文章的更新速度一样。在这期间，我通过插入自定义 CSS 来更改样式。随着修改幅度越来越大，我编写了一系列 CSS 文件、Hexo 脚本，甚至还使用 JS 修改 DOM，为博客 Logo 注入动画元素。我的底线是「不修改主题源代码」，就算修改也是向主题提交 Bug 修复 PR。

KazariEX 见此情况，几次建议我使用 Nuxt.js 重构博客并手写主题，但我当时认为博客重心在于文章，因此并未考虑。

### 重构思考

我的想法是，当 Hexo 无法满足我对博客的要求时，可能是几年后，我会考虑用 Astro 重构博客。但目前一切尚好。

2024年6月1日， KazariEX 带领我 10 小时极速上手 Nuxt 重构个人主页。从某种意义上讲，此刻我由原生前端开发转变为一名现代前端开发者。我通过实战了解了 Nuxt 和 Vue 的基础知识，并体验到了现代前端开发的便捷。

8月3日，在 KazariEX 不知第几次建议下，我开始尝试使用 Nuxt Content 构建博客。8月11日，新博客上线。

## 功能开发

### 样式

在开发过程中，我选择基于自己修改的 Stellar 主题编写样式。通过 `tokei ./app` 统计，博客前端排除空行后大约有4000行代码，其中大约一半是样式代码。

有群友提出使用原子化 CSS，有助于减少样式代码量。我认为原子化 CSS 能处理简易样式，但不适合设计导向或复杂样式，「风记星辰」的站长「宇」也支持我的观点。

::chat

{()}

删一行样式都会出问题的哪种😵\
当我能给样式代码写注释的时候，它已经不是普通的易于改动的代码了

{Restent Ou}

所以我用 UnoCSS

{()}

UnoCSS 能帮助处理这种近乎玄学的问题吗\
我昨晚睡前还认真思考了一下要不要上 UnoCSS\
最后觉得我的新博客既然注重样式，还是专门使用 `<style>` 好

{Restent Ou}

我提到原子化 CSS 是因为相比手写 CSS，其复杂度会相对降低

{()}

毕竟我现在遇到的问题是 CSS 本身特性带来的问题，而不是原不原子化影响对样式的约束/控制能力

{宇}

是的，其实现在专门设计的网站，几乎都不使用 CSS 框架了，自己写不仅节省代码，而且 HTML 也干净

::

因此，博客未来只可能会有限地引入原子化 CSS，例如仅对需要设置透明度、字体大小和颜色的元素应用原子化 CSS。

### 海量组件

先前我选择 Stellar 主题的原因之一，便是它「支持丰富的标签和动态数据组件」。没想到八个月前的回旋镖飞回到了自己头上，我望着博客 Markdown 文件里大量通过 Nunjucks 标签调用的标签和组件，思考如何将这些标签移植到 Nuxt Content 中。

Nuxt Content 使用 MDC 语法，可以通过许多方便的语法引用 Vue 组件。我便开始了漫长的组件编写之旅。受限于一些组件（如聊天记录、时间线）的渲染方式，我甚至使用非标准方式获取 VNode 子节点中的默认插槽内容的文本值，写出了 `as any` 类型断言。不过总之，它能以一种比较优雅的方式调用了。

:::tab{:tabs='["使用Chat组件", "使用Tab组件", "Timeline组件简化源码"]' center}

#tab1
```mdc [blog-using-nuxt.md]
::chat

{()}

这是我说的内容，显示在右侧

{用户1}

这是用户1的回复\
可以这样换行

::
```

#tab2

```mdc [blog-using-nuxt.md]
::tab
---
tabs: ["使用Chat组件", "使用Tab组件", "Timeline组件简化源码"]
center: true
active: 2 # 默认显示第二个选项卡，可选
---
#tab1
内容：使用Chat组件
#tab2
内容：聊天组件源代码
#tab3
内容：使用Tab组件
::
```

#tab3
```tsx [Timeline.vue > script setup]
function render() {
    return defineSlots().default?.().map((node: VNode) => {
        const textContent = (node.children as any)?.default?.()[0].children || ''
        const match = textContent?.match?.(/^\{(.*?)\}$/)
        return match
            ? <div class="timeline-caption">{match[1]}</div>
            : <div class="timeline-body card">{node}</div>
    })
}
```
:::

### 评论接入

2024年6月28日，我为上一版博客接入了 Twikoo 评论系统；在8月11日新博客上线当天，我通过简易代码重新接入了 Twikoo。

后来，KazariEX 提出使用 `useScriptTag()` 引入 Twikoo，我觉得这就是一种抽象。从积极的插入脚本变为懒加载之后，无论是在外部使用动态 key 调用组件，抑或是在组件内监听 `path`，都会在 SSG 环境下异常，只得如此在 `onMounted()` 中手动重新调用，倒是显得不太优雅了。

::tab{:tabs='["旧代码", "新代码"]' center :active="2"}

#tab1
```ts [Comment.vue > script setup]
onMounted(() => {
    const script = document.createElement('script')
    script.src = appConfig.twikoo.js
    script.defer = true
    script.onload = () => {
        window.twikoo.init({
            envId: appConfig.twikoo.envId,
            el: '#tk-comment',
        })
    }
    document.head.appendChild(script)
})
```

#tab2
```ts [Comment.vue > script setup]
function initTwikoo() {
    window.twikoo?.init?.({
        envId: appConfig.twikoo.envId,
        el: '#twikoo',
    })
}
// 从其他页面路由至文章页面时，通过 onLoaded 事件初始化，onMounted 不起作用
useScriptTag(appConfig.twikoo.js, () => initTwikoo(), { defer: true })
// 在文章页面之间路由时不会触发 onLoaded 事件，需要手动初始化
onMounted(() => initTwikoo())
```
::

### 页面布局

我参考了 Stellar 主题的左中右三栏布局。其中，右侧栏可以通过元数据或 Front Matter 中的 `aside` 数组来自定义组件。

Stellar 主题使用 Grid 布局，而我选择借鉴 Vitepress 默认主题的 Flex 布局实现方式，这样不仅兼容性更好，还能在隐藏右侧栏时让正文占据此空间。

## 带动效应

### 汲取灵感

我使用 Nuxt 和 Nuxt Content 开发博客时遇到了不少问题，但好在发现了不少使用 Nuxt Content 的小伙伴，他们的文章提供了不少灵感。

- [从Hexo到Nuxt，正式升级为动态博客！- Z次元](https://blog.ahzoo.cn/p/511b3f9/)：这篇文章来自我的友链，他的博客间接鼓励了我使用 Nuxt Content。
- [博客从 Ghost 迁移至 Nuxt Content - HADB.ME](https://hadb.me/posts/switch-blog-from-ghost-to-nuxt-content)：我开发博客时，他在 Wakatime 排行榜上每日代码时长、语言排名与我极其相似，再访问他的个人主页，原来他也在使用 Nuxt Content 构建博客，非常巧合。我参考了他的 `atom.xml` 生成逻辑。
- [使用 Nuxt 重构我的博客 - Restent's Notebook](https://blog.gxres.net/posts/rebuild-my-blog-with-nuxt)：刚开始参考了他的目录逻辑，但后来通过递归使用复用组件完成了逻辑，并做出了伴随滚动切换高亮项的目录。

### 开源反哺

我在使用 Nuxt Content 开发博客时，为其他人提供了一些样式思路。博客交流群里也有不少小伙伴受到鼓舞，使用现代的前端框架重构博客。

## 兼容优化

### 样式

当然，也少不了我们的老伙计——安卓上的夸克浏览器。

::quote
如果一个现代的前端网站能在夸克APP上正常运行，那么它的兼容性**十分**良好；如果它将兼容夸克APP，那么我认为这实在**万分**厉害。
::

它除了不支持五年前的 `prefers-color-scheme` 特性外，我还在测试环节留意诸如 `dvh` 的动态视口单位、`:has()` 函数式伪类等新特性也不受支持。对于动态视口单位，我通过多个声明语句渐进覆盖，「风记星辰」的站长「宇」推荐我阅读 [2023年应该重新定义的CSS习惯(一)](https://www.thyuu.com/72670#%E5%85%BC%E5%AE%B9%E6%80%A7%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88)，使用更优雅的媒体查询 `@supports` 写法。对于 `:has()` 函数式伪类，我通过 Vue 的动态 class 绑定解决。

::quote
代码越少，越使用新特性。越使用新特性，兼容性越差。兼容性越差，越需要更多的兼容性代码。所以代码越少，代码就越多。
::

### SSG != SSR

Nuxt 之 SSR 开发体验，善也。然限于 Vercel 之速，以 SSR 部署尔。

上文样式之扰仅为滥觞，代码之兼容性亦困我于囹圄。

其一为 `Object.groupBy()`——本地体验大善，上云部署错误，观之为 Node.js 20 环境，果断升至 22。此后正常部署，本地体验正常。**喜笑颜开之时，掏出夸克APP。不喜。**`import { group } from 'radash'` 解决之。

其二为 `Array.prototype.sort()`。此为修改方法而非复制方法，会破坏响应性。经 KazariEX 推荐 `Array.prototype.toSorted()`，大喜，如获至宝，遂部署。**复掏出夸克APP。不喜。**`import { alphabetical } from 'radash'` 解决之。

其三为 `Array.prototype.at()`。开启 Chrome 88，发觉友链页面先正常加载后报错。此为 SSG 与 CSR **水合不匹配**，经查，友链页面提取域名之函数使用 `Array.prototype.at()`，而 Chrome 92 之下无此方法。遂改之。

其四为 SSG 下 HTML 属性 (attrs) 响应性之缺失。初，使用 URL 之查询参数 `?page=` 以定页面，点击翻页功能如常，然刷新时渲染不符预期。测试 attrs 时，发现其难以具备响应性，遂弃查询参数，以 Vue Router 之动态路由匹配 `/page/:page` 替之。

其五为 SSG 下侧栏组件篡位。侧栏目录 (TOC) 组件在换文之时，会悄然以新文数据覆于旧文缓存中，偶以极其复杂之触发条件令其原形毕现，遂通过侧栏动态组件之 key 断其生命周期，乃造新 TOC 于新文而非旧 TOC 监听 URL 路径以篡其数据也。

SSG 之 Bug 种种，实扰人耳。

### Bug 排查

发现了 Bug，当然要快速定位问题。还好我使用的是 Vercel，它提供了历史部署版本的快照，通过访问旧部署，即可快速定位到 Commit 和出现问题的代码。

然后修复，就好了。至少听起来十分轻松。

嗯，我还会留下注释，防止自己后续优化代码时又改成可能导致 Bug 的写法。

::quote
在这个项目里，没有一行注释是无辜的。
::

### 列表负载

我善于观察异常的苗头，因此发现了许多容易被忽视的问题。例如，我的博客上线第一天，相比于旧博客的带宽消耗翻了番。经过排查，首页、归档页面加载时，会附带一个约 2MB 的 `payload.json`，细看发现竟含有我全站的文章元数据和正文内容。

KazariEX 猜我没学过数据库，因为我犯了类似 `select *` 的错误。而我也确实没学过，毕竟这学期开学后才开课。

不过凭我的直觉，我应该在查询结果中排除 `body` 字段，后来改成只选择指定字段，需要什么就加什么。虽然 Nuxt 相比于 Vue 不用手动书写 Vue 内置函数、组件、工具函数、组合式函数的导入语句，但在 Nuxt Content 的编程模式下，我仍需审慎组合、使用它提供的 API。

### SEO

2024年8月24日是我博客历史上灰暗的一天，因为我的必应和谷歌搜索流量几乎置零。

我的所有页面被错误的打上了 `noindex` 标记，这将阻止搜索引擎索引我的博客；我的 `sitemap.xml` 为空，这相当于博客告诉搜索引擎自己没有内容。

在我起初引入 `@nuxtjs/seo@2.0.0-rc.16` 时一切检查正常，但在一次依赖更新后，改变在悄然发生。有用户在 `@nuxtjs/seo@2.0.0-rc.18` [报告了空 sitemap 问题](https://github.com/harlan-zw/nuxt-seo/issues/296)，开发者讲虽然有一个“轻微的 (slightly) 破坏性 (breaking) 更改”，但造成空 sitemap 另有其因，应当升级依赖。

### 来自未来的文章

YAML 会以 UTC 时区解析 Front Matter 中的时间，刚更新的文章常常显示为“未来8小时后”，但我希望以本地时区解析。刚开始修改了 `getPostDate()` 函数，但语义化的 `<time datetime="...">` 标签依旧不符合规范，因此编写了这个 Nitro 插件用于修正时区。

```ts [server/plugins/fixPostTimezone.ts]
import { getTimezoneOffset } from 'date-fns-tz'
import blogConfig from '~~/blog.config'

const timezoneOffset = getTimezoneOffset(blogConfig.timezone)

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('content:file:afterParse', (file) => {
        if (file.date) {
            file.date = new Date(new Date(file.date).getTime() - timezoneOffset)
        }
        if (file.updated) {
            file.updated = new Date(new Date(file.updated).getTime() - timezoneOffset)
        }
    })
})
```

Nuxt 虽然是热更新，但我甚至重启开发环境都不能确保其生效，必须手动清除缓存。

## 阶段总结

经过约一个月/200小时的开发，我的博客由 Hexo 转为基于 Nuxt Content 开发的项目。项目选型、主要功能完成后，我选择不断优化已有代码，修复 Bug、优化性能、语义化和兼容性。我认为，开发就是不断的做加法和减法，在项目起步阶段，减法比加法更重要，这样才有利于后续功能的扩展，而不是面对「独木桥上架起的二层小洋房」发呆。

仍有一些期待的功能尚未完成。
