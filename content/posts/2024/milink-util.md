---
title: 小米电脑管家安装教程
description: 非小米笔记本安装小米电脑管家的方法及功能介绍，推荐 MiLink NFC 项目实现小米设备的一碰连/一碰传功能。
date: 2024-01-31 22:16:39
updated: 2024-02-01 14:20:10
image: https://7.isyangs.cn/24/6664009b29739-24.jpg
categories: [经验分享]
tags: [教程, 小米, 互联, 互传, 网络, 软件, 远程, 系统]
---

## 视频教程

:video-embed{type="bilibili" id="BV17F4m137ng"}

## 小米电脑管家

### 安装

小米电脑管家下载页面：[Xiaomi HyperConnect 跨端智联](https://hyperos.mi.com/continuity#:~:text=%E7%AE%A1%E5%AE%B6)

酷安@ChsBuffer制作的机型伪装补丁：[PC小米妙享安装+解锁流转补丁](https://www.coolapk.com/feed/42297337)

将下载到的安装包exe和补丁dll放在同一目录下，启动安装程序即可。

### 功能

- 手机投屏到电脑，同时打开多个手机APP
- 电脑通过手机网络上网
- 平板控制电脑或充当扩展屏
- 电脑键鼠控制平板
- 电脑程序调用手机前后摄像头

### 问题

小米电脑管家里的应用商店挺坑的，不建议安装。

如果重启后小米电脑管家提示WiFi/蓝牙功能异常，是因为其自启先于网卡驱动加载完成，在Windows服务中把`Xiaomi Continuity Service`改为延迟启动即可。

## NFC 一碰连/一碰传

淘宝APP内点击我的淘宝-签到领现金，可以领取几元的无门槛红包，在活动界面内搜索NFC标签(建议规格在215及以上)并添加购物车，随后在购物车内选择支付，即可以较低的价格(一般在几分左右)购买NFC标签。你可以下载下面的程序自行研究一碰连/一碰传功能并制作具有相应功能的NFC标签。

GitHub上的MiLink NFC项目：[XFY9326/MiLinkNFC](https://github.com/XFY9326/MiLinkNFC)

Gitee上的MiLink NFC下载：[逸雪飞扬/MiLinkNFC](https://gitee.com/XFY9326/MiLinkNFC/releases)
