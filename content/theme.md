---
title: 主题
hideInfo: true

aside: [toc, github_card]
github:
  name: L33Z22L11/blog-v3
  description: 基于 Nuxt Content 的博客主题，使用 Nuxt 3 构建。
  url: https://github.com/L33Z22L11/blog-v3
---

## 设计原则

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
- **内容排版**：减小表格和代码块的字体大小，以减少横向溢出，改善阅读体验。
- **友链列表**：隐藏右侧栏，在宽度足够时使用横向列表形式，确保单位屏幕内的展示数量。
::

### 分化文章版式

::card-list
- 技术文章标题左对齐，正文无缩进。
- 故事类文章标题居中且使用衬线体，正文有缩进。
::

## 开源衍生

- 灵感源自 [xaoxuu/hexo-theme-stellar](https://github.com/xaoxuu/hexo-theme-stellar)，这是一个经过精致设计的简洁 Hexo 主题。
- 为许多项目提供样式灵感。

## 开发过程

::link-banner
---
banner: https://7.isyangs.cn/24/66d4c3ea35003-24.jpg
title: 博客进化：从 Hexo 到 Nuxt Content
link: /2024/blog-using-nuxt
---
::

## 技术架构

::card-list
- 主要框架与语言
  - **前端框架**：Nuxt 3
  - **开发语言**：TypeScript + Vue 3 + Scss
- 内容与服务
  - **内容管理**：Nuxt Content
  - **部署平台**：Vercel
  - **评论系统**：Twikoo
  - **数据库**：MongoDB
  - **包管理器**：pnpm
- 功能模块
  - **状态管理**：Pinia
  - **图标管理**：Nuxt Icon
  - **SEO优化**：Nuxt SEO
  - **颜色模式**：Nuxt Color Mode
- 工具库
  - **日期处理**：Date-fns
  - **工具库**：VueUse
  - **代码质量**：ESLint + Stylelint
::
