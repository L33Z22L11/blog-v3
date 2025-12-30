---
title: 主题
hideInfo: true

aside: [toc, meta-aside-github]
---

::meta-aside-github{title="项目仓库"}
:::link-card
---
title: L33Z22L11/blog-v3
description: My blog, powered by Nuxt 4 & Nuxt Content v3. 纸鹿摸鱼处，分享技术与生活。
link: https://github.com/L33Z22L11/blog-v3
---
:::
::

## 主题特性

::card-list
- **响应式设计和夜间模式**：支持移动端和桌面端，同时适配系统颜色偏好，确保在不同设备上都能提供良好的阅读体验。
- **兼容性**：样式在多个浏览器上兼容良好（如安卓夸克 APP），在 Chrome 88（2021年1月）上显示美观，并且有适当的回退策略。
- **订阅源**：支持 Atom 订阅源，能显示文章封面（由于 Nuxt Content 特性，订阅源中只有摘要）。
- **SEO 优化**：使用 Nuxt SEO 插件，优化搜索引擎的收录和排名。
- **评论系统**：集成 Twikoo 评论系统，方便用户留言和互动。
::

### 减少干扰

::card-list
- **清晰易读**：选用容易阅读的字体和合适的字号，采用不刺眼且易于辨识的颜色搭配。
- **减少动画**：不使用“樱花”“雪花”“星辰”等持续变化的动画，确保用户的注意力集中在主要内容上，以提供良好的视觉体验。
- **专注文章**：避免通过动画、声音等方式将注意力引向与「阅读正文」无关的内容，如“Live2D人偶”“博客版本通知”“隐私协议提醒”“热门评论轮播”等。
::

### 提升空间效率

::card-list
- **布局方式**：不使用顶部导航栏或主屏大图（Hero Image）。
- **文章列表**：列表在宽度足够时封面居右，以提升空间利用率。
- **内容宽度**：限制宽屏模式下的内容宽度，减少阅读疲劳。
- **内容排版**：减小表格和代码块的字体大小，以减少横向溢出，改善阅读体验。
- **友链列表**：隐藏右侧栏，在宽度足够时使用横向列表形式，确保单位屏幕内的展示数量。
::

### 分化文章版式

::card-list
- 技术文章标题左对齐，正文无缩进。
- 故事类文章标题居中且使用衬线体，正文有缩进。
::

## 使用

自用项目，目前已经开源。修改需要具备一定的前端开发知识，请阅读 `README`。

::link-card
---
title: 组件样式示例
link: /previews/example
class: gradient-card active
---
#icon
**使用必读**<br>👉👉🎨
::

### 开发过程

::link-banner
---
banner: https://7.isyangs.cn/24/66d4c3ea35003-24.jpg
title: 博客进化：从 Hexo 到 Nuxt Content
link: /2024/blog-using-nuxt
---
::

## 开源与衍生

- 灵感源自 [xaoxuu/hexo-theme-stellar](https://github.com/xaoxuu/hexo-theme-stellar)，这是一个经过精致设计的简洁 Hexo 主题。
- 借鉴了众多优秀设计，自己的一些设计也为 :tip[许多朋友的博客项目]{tip="真的有不少！"} 提供了灵感。
- 项目被多人用作个人博客，详见 [`README.md`](https://github.com/L33Z22L11/blog-v3)。

### 技术架构

::card-list
- 主要框架与语言
  - **前端框架**：Nuxt 4
  - **开发语言**：TypeScript + Vue 3 + Scss
- 内容与服务
  - **内容管理**：Nuxt Content v3
  - **部署平台**：Vercel
  - **评论系统**：Twikoo
  - **评论数据库**：MongoDB
  - **包管理器**：pnpm
- 工具库
  - **日期处理**：date-fns
  - **轮播图**：Embla Carousel
  - **订阅源生成**：Fast XML Parser
  - **域名解析**：parse-domain
  - **代码高亮**：Shiki + Plain Shiki
  - **实用算法片段库**：Radash
  - **悬浮组件库**：Vue Tippy
- 依赖模块
  - **图标管理**：Nuxt Icon（Iconify）
  - **颜色模式**：Nuxt Color Mode
  - **SEO优化**：Nuxt SEO
  - **状态管理**：Pinia
  - **Vue 实用功能库**：VueUse
  - **代码质量**：ESLint + Stylelint
  - **代码压缩**：oxc-minify
::

- 更多技术依赖可参考 [`pnpm-workspace.yaml`](https://github.com/L33Z22L11/blog-v3/blob/main/pnpm-workspace.yaml)。
