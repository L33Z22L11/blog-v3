---
title: 网站搭建选择指南
description: 博客重建前曾写过几篇文章，此文是我根据往昔记忆重新构建的版本，后续进行多次修改。
date: 2025-05-05 19:11:40
updated: 2025-07-23 18:51:08
image: https://mu-s4.s3.bitiful.net/2025/05/05.avif!style=1
categories: [分享]
tags: [网站, 搭建]
recommend: true
---

最初的最初，我的博客其实是准备用 Termux＋GitHub＋Hexo 来搭建的，不过后面我还是用回了 WordPress。

## 搭建方式

要想搭建博客并且让别人也能访问的方法有很多种，但大致能被分为：

| 1️⃣ | 2️⃣ | 3️⃣ |
| :- | :- | :- |
| 项目部署 | 内网穿透 | 主机搭建 |

### 项目部署

我最开始用的就是这种，但是上手没一会就放弃了。由于我当时仅仅只有手机一个设备，并且也没有专门去学 git 和 npm 的命令行知识，几乎步步都是报错，好不容易能运行开发环境了，心态也快崩掉了💔。到最后我还是回到了 WordPress。

命令行推送较为复杂，建议使用VS Code进行操作。在推送结束后，部署平台会自己触发部署并更新。

::alert{type="warning"}
#title
注意事项
#default
这类的程序并不遵守系统代理，需要进行一定设置，否则会大概率推送失败。
::

### 内网穿透

教程很多，实际运行下来并不稳定，占用家庭宽带，小心连网站都加载不出来。

::video-embed
---
type: bilibili
id: BV19u411U731
---
::

### 主机搭建

并不推荐，开销很大，作为学生，承担不起。

### 选择

::link-card
---
icon: https://www.mugzx.top/icon.png
title: Hello,World!
description: 没钱，开始第一次尝试 Nuxt 一类的静态博客。
link: /2025/hello-world#%E7%AB%99%E9%95%BF%E6%B2%A1%E9%92%B1
---
::

::alert
#title
后续
#default
有了电脑维护博客好方便。
::
