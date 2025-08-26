# 地球驿站

[![框架](https://img.shields.io/badge/框架-Nuxt-00DC82?logo=Nuxt.js)](https://nuxt.com/)
[![CMS](https://img.shields.io/badge/CMS-Nuxt%20Content-00DC82?logo=Nuxt.js)](https://content.nuxt.com/)
[![部署平台](https://img.shields.io/badge/部署平台-Vercel-000000?logo=Vercel)](https://vercel.com/)
[![访问统计](https://img.shields.io/badge/访问统计-Umami-000000?logo=Umami)](https://github.com/umami-software/umami)
[![代码风格](https://img.shields.io/badge/代码风格-ESLint-4B32C3?logo=ESLint)](https://eslint.org/)
[![代码风格](https://img.shields.io/badge/代码风格-Stylelint-263238?logo=Stylelint)](https://stylelint.io/)

地球驿站于 2025 年 1 月 24 日重新上线。

> [!WARNING]
>
> 修改本项目需要具备**前端开发**和**项目部署**能力。由于这是个人博客，代码经过深度定制，且可能会进行较大幅度的更新，建议您 Fork 后安心使用自己分支的版本；若需引入上游（本仓库）的新功能，建议重新 Fork 最新代码，以避免同步冲突。
>
> 如果需要协助或有问题咨询，欢迎加入 QQ 群 169994096 讨论/闲聊，我会在空闲时尽力解答。

## 使用本主题的博客

> v3.3 (不含) 之前使用 Nuxt 3 + Nuxt Content 2，更新依赖/删除 lcok 文件可能导致项目无法启动。

| 博客名称                                    | 作者          | 对应上游版本    | 下游特色功能                   |
| ------------------------------------------- | ------------- | --------------- | ------------------------------ |
| **[纸鹿摸鱼处](https://blog.zhilu.site/)**  | **L33Z22L11** | **v3.4-250826** | (我是上游)                     |
| [希乐博客](https://blog.xlenco.top/)        | Xlenco        | v3.3-250812     | 最新评论                       |
| [SteinsNote](https://blog.labmem.chat/)     | Labmem-00     | ~~v3.1-241112~~ | 专栏                           |
| [月空人](https://whbbit.cn/)                | Whbbit1999    | v3.3-250521     | 项目/博客/Snippets页           |
| [地球驿站](https://blog.mugzx.top/)         | mugzx         | v3.4-250825     | 设计风格统一                   |
| [喵落阁](https://blog-v3.kemeow.top/)       | Kemeow815     | ~~v3.2-250521~~ | 即刻+友圈+最新评论+游戏/番剧页 |
| [梦爱吃鱼](https://blog.ruom.top/)          | JLinmr        | v3.2-250304     | 即刻+友圈+最新评论             |
| [Mikuの极光星](https://blog.sotkg.com/)     | PaloMiku      | v3.3-final      | 设计风格统一                   |
| [Shenley的存档点](https://blog.ykrazy.top/) | shenlye       | ~~v3.2-250521~~ | 游戏/番剧页                    |
| [BiuXin-s Blog](https://zhilu.biuxin.com/)  | damizai       | ~~v3.2-250304~~ | 即刻+友圈+最新评论             |
| [液泡部落格](https://blog.vacu.top/)        | VacuolePaoo   | ~~v3.2-250521~~ | 一言                           |
| [莫言小栈](https://www.myxz.top/)           | 661111        | v3.3-250814     | 即刻+友圈+Heo友链轮播/Profile  |
| [落憾](https://blog.enltlh.me/)             | LuoH-AN       | v3.3-final      | 即刻+标签tags                  |

## 特性

[主题特性](https://blog.zhilu.site/theme) · [组件示例](https://blog.zhilu.site/previews/example)

## 目录结构

项目使用 [Nuxt 4 项目目录结构](https://nuxt.com/docs/4.x/guide/directory-structure/app/app)。

```sh
.
├── app # 前端
│   ├── assets # 资源文件
│   ├── components # 组件
│   │   ├── content # MDC组件
│   │   ├── partial # 微型组件
│   │   ├── widget # 侧边栏组件
│   │   ├── zhilu # 个人标识组件
│   │   └── ... # 布局组件
│   ├── composables # Vue 组合式函数
│   ├── pages # 页面
│   │   ├── [...slug].vue # 正文、404页面
│   │   ├── archive.vue # 归档
│   │   ├── link.vue # 友链
│   │   ├── index.vue # 首页
│   │   └── preview.vue # 预览的文章
│   ├── plugins # Nuxt / Vue 插件
│   ├── stores # Pinia 状态管理
│   ├── types # 类型定义
│   ├── utils # 工具函数
│   ├── app.config.ts # 前端响应式配置★
│   ├── app.vue # 基本布局
│   ├── error.vue # 意外错误页
│   ├── friends.ts # 友链★
│   └── subscriptions.ts # 单向订阅/推荐网站★
├── content # 文章
│   ├── posts # 文章
│   ├── previews # 预览文章，可被站内搜索
│   ├── link.md # 友链要求
│   └── theme.md # 主题介绍
├── patches # npm 包补丁
├── public # 静态资源，生成在站点根目录
│   └── fonts # 字体
├── server # 服务端
│   ├── api # 接口
│   │   └── stats.get.ts # 博客静态统计
│   ├── plugins # Nitro 插件
│   │   └── anti-mirror.ts # 恶意反代跳转
│   └── routes # 路由
│       ├── atom.xml.get.ts # Atom 订阅源
│       └── zhilu.opml.get.ts # OPML 订阅源聚合
├── blog.config.ts # 博客静态公共配置★
├── nuxt.config.ts # Nuxt 配置
└── redirects.json # 旧站点重定向配置
```

## 快速开始

### 安装依赖

```sh
pnpm i
```

如果需要安装其他包，推荐使用 `@antfu/nip` 提供的 `nip` 命令。

### 运行开发环境

```sh
pnpm dev
```

### 初始配置

为避免误会，应当更改一些配置信息以和我的博客网站区分：

- 删除原有文章：`content/` 目录下仅保留 `link.md`，`app.config.ts` 中删去 `footer.nav[2].items[1]`（主题组件文档）或将 `/theme` 改为 `https://blog.zhilu.site/theme`（确保通过链接检测）。
- 更换服务配置：`blog.config.ts` 中的 Umami 站点统计、Cloudflare Insights 统计、Twikoo 评论服务源需要注释或更换。
- 个人信息：`blog.config.ts` 中的站点名称、头像，`app.config.ts` 中的页脚导航、出生年份等。
- 其他应当被善意认为有必要修改的文件和配置字段（参阅“目录结构”一节）。

为保证开发体验，需要安装 ESLint、Stylelint 等 VS Code 扩展。如果你不喜欢此项目的格式化风格，可以在 `./eslint.config.mjs` 和 `./.vscode/settings.json` 中调整或者不安装 VS Code 扩展。

如果文章 URL 和先前的不相同，可以通过编辑 `redirects.json` 来添加重定向。

### 创建文章

```sh
pnpm new my-post-title
```

### 构建生产环境

```sh
pnpm generate
pnpm preview
```

### 部署指南

推荐使用 Vercel 进行部署，同时也支持 Netlify、Cloudflare Pages 等平台。建议采用静态（SSG）部署方式，我的部署配置如下：

- 构建命令: `pnpm generate`/`nuxt generate`
- 输出目录: `dist`（与Nuxt预设相同）
- 安装命令: `pnpm i`（一般会自动检测）

如果直接使用平台提供的“Nuxt”预设部署，那么会变成 SSR 模式，需要调整部署命令，请参阅 Nuxt 官方文档的 [部署](https://nuxt.com/docs/getting-started/deployment) 部分。

#### 疑难解答

- Vercel 先前创建的项目需要 [手动指定 pnpm 10](https://vercel.com/docs/builds/configure-a-build#corepack)。
- 部署项目时 Node.js 版本最好高于 `22.15.0`。

## 贡献

欢迎参与项目：如果有具体问题或功能建议，可以发起 Issue；如果愿意在已确定的方向上增加功能或修复问题，可以提交 Pull Request。

## 许可证

- 项目本体：[MIT](LICENSE)
- 博客文章：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)
- 请完成必要的配置与修改后再部署项目，**不得使用“纸鹿”相关名称、Logo建立“镜像”网站或照搬文章内容而不标注来源**，否则我将设法与你联系。
- 希望你在页脚保留此项目链接，助力开源传播。
