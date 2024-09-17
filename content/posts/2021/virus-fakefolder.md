---
title: 假文件夹病毒真的会发作
description: 2021年5月，高中校园发生假文件夹病毒事件，通过U盘传播，病毒伪装文件夹并定时删除数据。预防措施包括留意文件夹图标异常，安装杀毒软件并正确显示隐藏文件以识别和清除病毒。
date: 2021-05-08 23:08:30
updated: 2021-10-01 21:30:00
image: https://image.baidu.com/search/down?url=https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26SuYFj0v7jz4Wpao1JAzlibcKia6mPLktFvKabXAcWOsZbxIB01DdGnCQ/640
cover_revert: true
categories: [经验分享]
tags: [高中, Windows, 系统, 病毒]
---

[查看原文](https://mp.weixin.qq.com/s/uiJgwmLSX6hYPkIR7pRbRw)

## 事件经过

2021年5月初，高二第二学期期中考试过后，在整理排版成绩单的过程中，同办公室的一名教师发现自己电脑除C盘之外，其他硬盘的文件均被删除。

这名教师在发现文件消失后，立刻请本班的学生来恢复文件并杀毒。出于兴趣，笔者在检查该机时，发现硬盘根目录存在被Fakefolder（又名incaseformat）病毒感染的文件夹以及incaseformat.txt（病毒发作留下的文件）。被删除的数据很难恢复。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26SuYFj0v7jz4Wpao1JAzlibcKia6mPLktFvKabXAcWOsZbxIB01DdGnCQ/640
mirror: true
caption: 参考图片
---
::

## 病毒原理

该病毒主要通过感染U盘中的文件夹传播。当用户打开被感染的文件夹时，病毒就会隐藏电脑和U盘中的文件夹，并将自己伪装成原文件夹。

该病毒已有十几年的历史，从2010年愚人节开始，每隔几天便删除用户文件，由于编写问题，从2021年才开始发作。电脑被病毒感染后，每隔20秒就会检测系统日期，满足逻辑则执行删除操作。

## 防范措施

推测学校目前的病毒传播路径：打印店或学生家长所在单位→初中微机教室→学校打印部→各班及教师电脑。

此前笔者已经在多名教师的U盘及学校打印部中发现此病毒，且笔者的u盘也多次遭遇该病毒感染，所幸杀毒及时，并未造成数据损失。

病毒的辨识方法：被病毒感染的文件夹图标为“**上下打开**”样式（类似风琴包），而正常的文件夹图标为“**左右翻开**”样式（类似资料册、文件盒）。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26Iz5iaibw8n6R2icQ5VGk3jnaic4Zlvqsc3uarsjfIKdPbBzrYVNHZPLX8Q/640
mirror: true
caption: 假文件夹病毒图标（与XP系统相同）
---
::

若发现硬盘和U盘中的文件夹被感染，请及时安装杀毒软件进行杀毒。

**附**：安全打开感染文件夹的方法

> Win7：打开“计算机”，在“组织”菜单中打开“文件夹和搜索选项”，在“查看”选项卡中选择“显示隐藏的文件、文件夹和驱动器”，取消勾选“隐藏已知文件的扩展名”，点击确定，忽略带有“.exe”后缀的病毒（请及时杀毒），打开被隐藏的文件夹即可。
>
> Win10：打开“此电脑”，在“查看”选项卡中打开“选项”，在“文件夹选项”中的“查看”选项卡中选择“显示隐藏的文件、文件夹和驱动器”，取消勾选“隐藏已知文件的扩展名”，点击确定，忽略带有“.exe”后缀的病毒（请及时杀毒），打开被隐藏的文件夹即可。
