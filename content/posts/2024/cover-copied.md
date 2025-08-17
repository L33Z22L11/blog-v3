---
title: 封面被 Linux QQ 官方用了，但是有一些小缺陷
description: 怀疑 Linux QQ 团队使用了作者的封面图片，严谨求证后发现事实确实如此，并且因此找到了 Linux QQ 官网的 bug。
date: 2024-06-18 13:23:05
updated: 2024-06-18 17:23:24
image: https://7.isyangs.cn/24/66714b1f0bc35-24.jpg
type: story
categories: [杂谈]
tags: [qq, 问题, 软件]
references:
  - title: Linux QQ 官网
    link: https://im.qq.com/linuxqq/index.shtml
---

## 发现相似封面

今天早上刷微信公众号，一篇文章吸引了我的注意力。

::link-banner
---
title: Linux QQ能打语音视频了！一文详解背后技术实现！
description: 原创　QQ音视频团队　腾讯云开发者　2024-06-18 08:43　北京
banner: https://mmbiz.qpic.cn/mmbiz_jpg/VY8SELNGe96D4BWicYxv0JgWsyvdCOq9qbpwmcjiaw8KJcvoeawYqAHHIUvOEq131W7FuLpKhpDrDnVfiahBf0ALg/0
mirror: true
link: https://mp.weixin.qq.com/s/M3-7XnNy30HprMpDsKBi7w
---
::

这篇文章的封面怎么和我先前制作的这么相似？

::link-banner
---
title: Linux QQ 崩溃解决办法
description: 原创　纸鹿本鹿　2023-03-16 21:02:22　纸鹿摸鱼处
banner: https://7.isyangs.cn/24/65a8dcff995c4-24.jpg
link: /2023/linuxqq-crash
---
::

刚开始，我还在惊叹，我们的设计思路何其相似，这又何尝不是一种奇妙的缘分呢？虽然 Linux QQ 官方团队发布的公众号封面里，大标题「Linux QQ」背后的阴影有些奇怪，它使用的是不透明、模糊半径小的亮灰色阴影，而我使用的是模糊半径更大的半透明透明黑色阴影。

## 确定封面被使用

再细看时，已经是半小时之后了，我留意到了「Linux QQ 官方」通过 PS 手段修改我封面的直接证据。

::pic
---
src: https://7.isyangs.cn/24/65a8dcff995c4-24.jpg
caption: 我的封面
zoom: true
---
::

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_jpg/VY8SELNGe96D4BWicYxv0JgWsyvdCOq9qbpwmcjiaw8KJcvoeawYqAHHIUvOEq131W7FuLpKhpDrDnVfiahBf0ALg/0
mirror: true
caption: 标题后方可见PS痕迹，登录窗口头像左上方最甚👆
zoom: true
---
::

::quote
我使用的背景图片来自 QQ 官网，所以我的这张封面是根据官网产品图片的二次创作，我本人当然也不反对二次创作再被官方使用。
::

::pic
---
src: https://im.qq.com/linuxqq/images/linuxqq/macbook_phone.png
caption: 我使用了 QQ 官网的这张图片
width: 360px
zoom: true
---
::

## 封面中的小问题

封面的设计思路能被 Linux QQ 官方团队使用，我感觉是很有意思的一件事情。但是，官方团队在使用这张封面时，也有必要留意一些规范。

### 大标题样式不明显

封面的文字阴影颜色是模糊半径较小的不透明灰色，而背景本身较亮。这样会导致文字与背景的对比度降低，使得大标题不够显眼。

### 垂直方向没有对齐

整体文字相对于画面中央和图标而言偏高，佐以灰色阴影，给人虚浮之感。

### 不仅仅是旧版

Linux QQ 官方团队使用的封面中，背景里的 QQ 是旧版界面，新版登录界面上方的文字是彩色的「QQ9」而不是黑色的「QQ」。

::pic
---
src: https://im.qq.com/linuxqq/images/new/login.png
caption: 新版 QQ 登录界面
width: 240px
zoom: true
---
::

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_jpg/VY8SELNGe96D4BWicYxv0JgWsyvdCOq9qbpwmcjiaw8KJcvoeawYqAHHIUvOEq131W7FuLpKhpDrDnVfiahBf0ALg/0
mirror: true
caption: 封面中使用了旧版、macOS 版 QQ 版本
zoom: true
---
::

### 甚至还是 macOS 版

继续细看 Linux QQ 官方团队使用的封面，窗口左上角竟然出现了 macOS 的🔴🟡🟢窗口控件，我立刻感到大为惊恐：Linux QQ 官方团队使用的封面由我的博客封面 PS 而来，**我在制作封面时怎么会犯如此低级的错误**？

我通过 WaybackMachine 找到了我写博客那天（2023-03-16）的 Linux QQ 官网，并未找到 macOS 版本的图片，但当我按下 F12 键尝试下载图片时，忽然出现了 [macOS 版本的产品图片](https://im.qq.com/linuxqq/images/linuxqq/macbook_phone.png)。

**破案了**！LinuxQQ 官网在宽度较小的情况下会展示 macOS 版本的界面，并且自从 [2022-12-28](https://web.archive.org/web/20221228081114/https://im.qq.com/linuxqq/index.shtml) 至今（2024-06-18）都有此问题。

## 发文目的

### 一些群友「抬杠」的论调

我把这次事件分享给博客圈子「<blur>█年之约</blur>」群友，哪怕我用陈述的口吻讲述客观事实，不夹杂主观情感，群友还在讲「让腾讯老总把位置让给你，不然难解心头之恨」之类煽动论调。

这让我感到不爽，哪怕是发几个表情包乐呵乐呵，或者单纯忽视都好，反而有人在煽动情绪。这佐证了「互联网的戾气真的越来越重了」。

### 希望修正公众号封面、QQ 官网的问题

我的博客封面使用 PPT 制作，它「不一定是质量最高的，但一定是出图最快的」。

我认为，「腾讯云开发者」公众号的运营人员就算是「选背景图-加上图标-加两行字」，也比「费尽心思修改我的-留下 PS 痕迹-甚至用错 QQ 版本」要节省时间，效果还会更好。我在公众号文章下方、「腾讯云开发者」公众号后台留言，但暂未得到回复。

希望官方团队能修正公众号封面、QQ 官网的问题。

以上。
