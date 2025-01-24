# 纸鹿摸鱼处

![框架](https://img.shields.io/badge/框架-Nuxt-00DC82?logo=Nuxt.js)
![CMS](https://img.shields.io/badge/CMS-Nuxt%20Content-00DC82?logo=Nuxt.js)
![部署平台](https://img.shields.io/badge/部署平台-Vercel-000000?logo=Vercel)
![访问统计](https://img.shields.io/badge/访问统计-Umami-000000?logo=Umami)
![代码风格](https://img.shields.io/badge/代码风格-ESLint-4B32C3?logo=ESLint)
![代码风格](https://img.shields.io/badge/代码风格-Stylelint-263238?logo=Stylelint)

我的第三代个人博客，于 2024 年 8 月 11 日上线。

## 预览

https://blog.zhilu.cyou

## 特性

> [!Tip]
>
> 请阅读 [在线文档](https://blog.zhilu.cyou/theme) 或 [仓库源文件](/content/theme.md)。

## 目录结构

```sh
.
├── app # 前端
│   ├── assets # 资源文件
│   ├── components # 组件
│   │   ├── content # 内容组件
│   │   ├── partial # 模块组件
│   │   ├── widget # 小组件
│   │   ├── zhilu # 个人 VI 组件
│   │   └── ... # 布局组件
│   ├── composables # 组合式函数
│   ├── pages # 页面
│   │   ├── [...slug].vue # 正文、404
│   │   ├── page.vue # 首页
│   │   ├── page/[[id]].vue # 首页动态路由
│   │   ├── archive.vue # 归档
│   │   ├── link.vue # 友链
│   │   └── preview.vue # 预览的文章
│   ├── plugins # Nuxt / Vue 插件
│   ├── stores # Pinia 状态管理
│   ├── types # 类型定义
│   ├── utils # 工具函数
│   ├── app.config.ts # 前端配置
│   ├── app.vue # 布局
│   └── error.vue # 错误页
├── content # 文章
│   ├── drafts # 草稿（生产环境不显示）
│   ├── posts # 文章
│   ├── previews # 预览文章，可被站内搜索
│   ├── link.md # 友链（正文）
│   └── theme.md # 主题介绍
├── patches # npm 包补丁
├── public # 静态资源
│   └── fonts # 字体
├── server # 服务端
│   ├── api # 接口
│   │   └── stats.get.ts # 博客静态统计
│   ├── plugins # Nitro 插件
│   │   ├── anti-mirror.ts # 恶意反代跳转
│   │   └── fix-post.ts # 修复文章时区/链接
│   └── routes # 路由
│       └── atom.xml.get.ts # Atom 订阅源
├── blog.config.ts # 博客公共配置
├── nuxt.config.ts # Nuxt 配置
├── redirects.ts # 旧站点重定向配置
└── vercel.json # Vercel 配置
```

## 快速开始

### 安装依赖

```sh
pnpm i
```

### 运行开发环境

```sh
pnpm dev
```

### 构建生产环境

```sh
pnpm generate
pnpm preview
```

### 部署

推荐使用 Vercel 部署。本站具有良好的 SSG 支持，可使用 Nuxt 预设（SSR）部署。目前的部署预设：

- Build command: `pnpm generate`
- Output directory: `dist`
- Install command: `pnpm i`

## 贡献

欢迎提交 Issue 或 Pull Request。

## 许可证

[MIT](LICENSE)
