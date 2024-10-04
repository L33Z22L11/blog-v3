---
title: 无需Root玩机工具Shizuku
image: https://xlenco-img.s3.bitiful.net/i/2024/08/a66d0a6348093d1a6d5d89c136464772.webp
description: 这篇文章介绍了一款无需Root即可拥有大部分玩机体验的工具Root，并且附上了一些支持Shizuku的工具。
date: 2024-08-21 17:57:18
updated: 2024-09-21 17:57:18
---

什么是ROOT？ 简单来说，ROOT就是获取根权限，比如Window有两种类型的使用者，一个是Administrator（管理员），另一个是User（普通用户）。管理员要比普通用户有更高的权限，可以对系统执行更多的操作。 在我们拿到一部安卓手机时，我们往往对此手机只有作为普通用户的使用权限，而在ROOT后，我们就能获取手机的根权限，从而对手机系统做更多操作，这就是ROOT的原因。

但是现在早已今非昔比，Root 权限的获取比较之前难上了许多。并且许多手机获取 Root 前要解锁Bootloader，可能造成不能保修。金融系的软件也不能在 Root 环境下运行。所以下面我将会介绍一款 无需 Root，即可获得较好玩机体验的工具-Shizuku。

## Shizuku

Shizuku 的名字来源于 [猫羽雫](https://mzh.moegirl.org.cn/猫羽雫) 猫羽雫（ねこはしずく）英文名 Nekoha Shizuku

Shizuku 本质是 ADB 权限管理器，并不是最高级的 ROOT 权限！因此当前阶段，Shizuku 能做到的事情不多，但足够用了。

Github 地址：https://github.com/RikkaApps/Shizuku

启动 Shizuku 的方式有：

- 通过 root 启动
- 通过无线调试
- 通过连接电脑启动

这里推荐无线调试这个方式，因为它相对于其它方式最为简单。

首先用搜索引擎搜索（推荐 bing）一下你的手机机型如何进入**开发人员选项。**

以我的荣耀手机为例，在设置中点三下**版本号，即可进入开发人员选项。**

![img](https://xlenco-img.s3.bitiful.net/i/2024/08/24da663347e724c85b3d89d85b26348b.)

在系统和更新中找到**开发人员选项，**

![img](https://xlenco-img.s3.bitiful.net/i/2024/08/f45a157fee5524663eda2b83bfa67621.)

进入后开启 **USB 调试和无线调试，**

![img](https://xlenco-img.s3.bitiful.net/i/2024/08/6abe18b30ad726c1a311bab2dd0dec6e.)

在**无线调试**中点击**使用配对码配对设备**，上滑通知栏在 shizuku 中输入配对码（前提是 shizuku 已在后台运行），再在 shizuku 中启动，等待几秒即可成功启动✌️。可能不同手机机型进入**开发人员选项**的方式各有差异，如果和我说使用的方式不同可以在网上查阅你的机型如何开启

## 支持 Shiziku 的工具

以下所有工具的网盘地址：

https://xlenco.lanzouj.com/b00l15eu2f 密码:abc5

### InstallerX

这是一款应用安装器，相比于系统自带的应用安装器安装速度慢不说还带些应用推广，而 InstallerX 安装速度就非常快了，对于一些小的应用基本秒安装。

Github 地址：https://github.com/iamr0s/InstallerX

### App Ops

App Ops 是一款应用权限管理工具，使用它可以便捷的管理应用的权限，例如给某经常弹开盘摇一摇广告的应用禁用传感器，让它再也不能兴风作浪。

Github 地址： 

https://github.com/RikkaApps/App-Ops-issue-tracker

### 自动任务

Github 地址：

https://github.com/xjunz/AutoTask

官网下载：

https://fir.xcxwo.com/tasker

直接把 Github 上的介绍放下面了

本应用专注于帮助您执行自动任务，相比于其他同类产品，本应用具有以下特点：

- 支持多种启动模式（Shizuku和辅助功能）
- 支持自定义常驻任务任务和一次性任务
- 支持手势录制，审查布局树等
- 不需要刻意保活便可常驻后台（两种模式默认系统保活）
- 省电且占用系统资源较少（事件驱动+协程，执行长时间任务也不阻塞CPU）
- 代码开源，安全可信 Material 3 风格UI，实用美观

简言之自动任务是一款可以帮你自动执行任务的一款轻量级工具，可以自动运行比如跳过广告之类的任务，并且可以自定义，功能强大。

### Scene

Scene 是一个 一个集高级重启、应用安装自动点击、CPU调频等多项功能于一体的工具箱。

Github 地址：

https://github.com/helloklf/vtools

### 爱玩机工具箱

爱玩机工具箱是一款功能非常全面的手机搞机工具，其界面简洁明了，使用方法也很简单，并且其中内置了超多的玩机功能，如：独家magisk安装器、magisk区、Xposed区，超强的应用管理功能，一键应用冻结、组件管理、伪装卸载、应用分享分享等等；同时它还能实时看手机内存、看电量、看流量、cpu、网速、帧率等详情还有悬浮窗，对于爱拿手机进行各种测试和折腾手机的人非常的适合。**部分功能收费**

酷安下载地址：

https://www.coolapk.com/apk/com.byyoung.setting

### 快捷方式

快捷方式作用如其名字一样就是创建快捷方式，满足各种创建快捷方式的需求。

貌似没找到在哪里发布，在网盘里下载。

### Anywhere-

官网： https://absinthe.life/Anywhere-Docs/

Github 地址：https://github.com/zhaobozhen/Anywhere-

Anywhere-和快捷方式类似

官网文档里的介绍：

它支持将你常用的页面 (Activity) 收集到一个界面并保存，方便快速打开。在手机 App 数量繁多的今天，Anywhere- 也许能帮助你节约一些时间，做一些微小的工作。
