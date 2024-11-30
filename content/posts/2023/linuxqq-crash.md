---
title: Linux QQ 崩溃解决办法
description: 针对 Linux QQ 崩溃问题，给出了临时和长期解决办法。QQ 软件的崩溃数据会影响其正常运行。
date: 2023-03-16 21:02:22
updated: 2023-08-09 17:20:11
image: https://7.isyangs.cn/24/65a8dcff995c4-24.jpg
categories: [经验分享]
tags: [qq, 问题, 软件]
references:
  - title: AUR 中 linuxqq 的评论
    link: https://aur.archlinux.org/packages/linuxqq
---

## 临时解决办法

:copy{code="rm -r ~/.config/QQ/crash_files"}

## 长期解决办法

在执行临时办法后，执行以下命令：
:copy{code="mkdir -m 444 ~/.config/QQ/crash_files"}

## 点评

垃圾桶里不能有垃圾。

## 后续

::link-banner
---
title: 封面被 LinuxQQ 官方用了，但是有一些小缺陷
banner: https://7.isyangs.cn/24/66714b1f0bc35-24.jpg
link: /2024/cover-copied
---
::
