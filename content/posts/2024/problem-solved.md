---
title: 有问题，就要讲出来。
description: 讲出来，修好了学校不通的路，解决了别人和我使用博客主题时遇到的问题，用 Nuxt.js 重构了个人网站，也配好了 Stylelint 和 Windows 上的 clangd。
date: 2024-06-04 08:02:36
updated: 2024-06-11 01:06:28
type: story
categories: [杂谈]
tags: [问题, 校园, 系统, 朋友]
---

## 此路不通

在几年前，由于「这样或者那样」的原因，学校家属院和东校区之间修建了很长一段隔离栅（护栏网），食堂旁边的两处台阶都被阻断了通行。但是几年过去，已经没有阻断通行的必要，学校却只拆除了其中一处台阶的一片隔离栅，而另一处台阶仍然被阻断。

有些影响通行，但是大家能绕路另一处台阶，所以这段被学生们戏称为「柏林墙」的隔离栅已经在「形势」好转后，不合理地横亘长达一年之久。

终于，在一次又一次的绕行之后，我忍不住了。5月14日，我在学校的信息直通车（综合反馈答复平台）上提出建议，希望学校将另一处台阶打开。四天后，拦截台阶的那片隔离栅就被拆除。

不过，在可预知的未来中，缺失了两片隔离栅的「柏林墙」将依然屹立于东校区与家属院之间，成为历史的痕迹。

## 修修博客

### 锚点块

六天前，一位自称为 Hermitlsr 的人通过 QQ 联系我，询问我关于 Stellar 主题的问题。他说自己最近开始重新打理博客，升级主题后，新版标题左侧的锚点块并没有显示。

最终，我们通过腾讯会议找到了问题：他先前为了兼容公式显示，换用了 `hexo-render-markdown-it-plus` 作为 Markdown 渲染器，这个渲染器虽然在标题之前也插入了标题锚点块，但是由于类名不同，主题的锚点块样式并没有成功应用。在恢复使用默认的 `hexo-render-marked` 之后，问题就暂时解决了。

Hermitlsr 给主题提了一个 Issue。不久后被 KazariEX 看到，我们在腾讯会议上沟通，一起修复了相关的 Stylus 样式代码，使用其他 Markdown 渲染引擎也能正常显示样式了，好耶。

### 夸克APP

五天前，Kegongteng 在「纸鹿摸鱼处」博客的交流群中指出，Stellar 博客主题生成的页面**在手机端显示不正常**。先前我也注意到了相关问题，但并没有在意。

问题既然被放到了明面上，那无论如何我都得尝试解决了。我先在手机上测试了一下，发现只有「夸克」才会出现问题。专门下载了夸克，发现它不支持远程调试，我只能在本地测试环境中加入了 Eruda 插件，才找到了问题。

夸克**不支持 `prefers-color-scheme`{lang="css"} CSS 媒体特性**，这个特性能让浏览器检测到用户处于深色模式时，使用网页自定的深色模式样式。很难想象这个 2019 年 Chrome 支持、2020 年“Baseline Widely available”全部支持的特性在 4 年后的这款 APP 上无法工作，看着它关于界面“基于创新无限的极速内核 Quarkium”的描述，我再一次感到了莫大的讽刺。

后来，朋友告诉我夸克支持深色模式。我在夸克 APP 设置里启用之后，它放着网页官方提供的深色模式不用，而是换上了自己的代码干预网页显示。烂欸。😾

### PR 与 Commit 关键词

KazariEX 指出，我给主题提交 PR 之后，虽然使用了相应关键词，但对应的 Issue 并没有自动关闭。在重新阅读 [使用关键词将拉取请求链接到议题](https://docs.github.com/zh/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) 之后，我发现是因为我 commit 时依照作者的风格写的提交信息是以 `[fix]` 开头的，方括号阻碍了关键词的匹配。

作者会在合并 Pull request 时选择 Squash and merge，默认情况下，PR 的标题会作为 Commit 的标题（参见 [GitHub 文档](https://docs.github.com/zh/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#merge-message-for-a-squash-merge)），所以需要在 PR 的标题中同时链接 Issue，才能在被合并时关闭 Issue。

后来，我把这个想法投入了实践，在 PR 合并的时候，我怀着期待的心情，查看了对应 Issue 的状态——它还是没有自动关闭，因为不是我提出的。

### 注入动画代码

和 KazariEX 聊到他主页 Logo 的动画，他参考了 Kloudy Shape 的 Logo 动画样式。忽而想到自己的主页也可以做一个 Logo 动画。

我的 Logo 使用的是可变字体，能调整字体的粗细和方圆程度。先前做过一版 Logo 字体缓慢变化的效果，不过切换页面时 Logo 又会从初始状态变化，大概因为我没用路由或者 PJAX 加载页面。后来决定让字体的参数随着时间变化，算是暂时解决了切换页面时动画不连续的问题。又过了一段时间，我发现动画的性能不佳，为了优化体验，索性关闭动画。

直到看到大家的 Logo 动画，我决定重新写一个出来。

经过一段时间的头脑风暴，它终于有了一个原型：“纸鹿摸鱼处”五个字利用可变字体的特性变形，辅以📄🦌🙌🐟🏖️几个 Emoji 元素的景深动画。

思路是通过 JS 注入元素，通过 CSS 变量控制动画的参数。经过了许多修改优化，终于实现了以下效果：

:zhilu-header

在制作动画的过程中，也遇到文字抖动、溢出边界、显示滚动条等问题，稍微做了些优化，如果你现在使用“检查元素”功能的话，会发现 `.emoji-tail`{lang="css"} 采用了 Grid 布局方式，我最近愈发体会到 CSS Grid 的妙用了。

## 个人主页

过年时用 VitePress 重构了一年半未动的个人主页。六天前和 KazariEX 一起在腾讯会议上修 bug 时提到了自己的主页，我们一拍即合，他带我直接零基础实战 Nuxt.js，经过几小时的共同努力就成功上线。

目前个人主页还是毛坯状态，正在努力完善。

::blur
正如博客写到这里的时候，已经是开题第六天晚上了。
::

## Stylelint

我在上一篇文章中吐槽 Stylelint 和 pnpm 之后，KazariEX 写了一篇博客文章，讲述自己在开发过程中配置、使用 CSS 的习惯。

::link-card
---
icon: https://archive.bikari.top/favicon.svg
title: 个人向 CSS 编码风格汇总 - 微光档案
link: https://archive.bikari.top/book/daily/44dc7f8
---
::

按照这个教程，我在个人主页开发过程中成功引入并配置了 Stylelint。

BTW，之前使用 pnpm 全局安装 Stylelint 时找不到依赖项，使用此配置可以提升依赖项到 `node_modules` 的根目录。

```ini [~/.npmrc]
shamefully-hoist=true
```

## clangd

Shawn 看到了我的上一篇文章，写了一篇在 Windows 上使用 clangd 的文章。

::link-card
---
icon: https://github.com/ShawnJeffersonWang.png
title: Windows 下配置 Clang 和 clangd
link: https://shawn.thisis.host/2024/clang-config/
mirror: true
---
::

我在 Linux 上安装了 Clang 和 clangd 后就能正常使用了。但我在 Windows 上只安装了 LLVM 和 clangd，当时应该是没有安装 MSVC 或者 [MSBuild（Microsoft C++ / Visual Studio 生成工具）](https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/)工具，所以才没有成功。

::quote
问题：讲出来——然后解决了。
::
