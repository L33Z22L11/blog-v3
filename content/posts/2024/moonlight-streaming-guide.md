---
title: Moonlight 串流指南
description: 服务端Sunshine设置、客户端分辨率调整、隐私屏功能实现及触摸优化。
date: 2024-01-18 18:58:55
updated: 2024-07-08 12:51:35
image: https://7.isyangs.cn/24/6664009b8f999-24.jpg
categories: [经验分享]
tags: [tailscale, moonlight, sunshine, 网络, 远程, 教程]
references:
  - title: 用 Sunshine + Moonlight 打造带有“隐私模式”的游戏串流服务
    link: https://www.xkww3n.cyou/2023/09/18/sunshine-moonlight-game-streaming-privately/
recommend: 50
---

## 环境

和要串流的设备位于同一局域网，如果不是，请尝试使用 Tailscale 或者 Zerotier 进行虚拟组网，参见此教程：

::link-banner
---
title: Tailscale 不完全使用指南
banner: https://7.isyangs.cn/24/6664009cce512-24.jpg
link: /2023/tailscale-incomplete-guide
---
::

你也可以通过 IPv6 进行公网串流，但需要注意，“IPv6临时地址”特性或者防火墙可能会导致无法正常连接。

## 服务端

如果你是 NVIDIA 显卡，可以使用 GeForce Experience 中的 NVIDIA SHIELD 功能。

更推荐使用 Sunshine 作为服务端，Sunshine的默认配置可以很好地工作，一般不需要修改。

::link-card
---
icon: https://docs.lizardbyte.dev/projects/sunshine/en/latest/_static/sunshine.png
title: Sunshine 官网
link: https://app.lizardbyte.dev/Sunshine/?lng=zh-CN
---
::

## 客户端

使用 Moonlight 作为串流的客户端。可以参考B站上阿西西的教程。

::link-card
---
icon: https://moonlight-stream.org/images/moonlight.svg
title: Moonlight 官网
link: https://moonlight-stream.org/
---
::

::link-card
---
icon: https://github.githubassets.com/favicons/favicon.svg
title: Moonlight Android阿西西修改版
link: https://github.com/Axixi2233/moonlight-android
---
::

::link-card
---
icon: https://i1.hdslb.com/bfs/face/b41566f47ea0d0f1e35ed54521c849c68c026892.jpg@120w
mirror: true
title: 阿西西的日常 - 哔哩哔哩
link: https://space.bilibili.com/16893379/video
---
::

在 Moonlight 客户端中应该可以看到主机，在 Sunshine Web 控制台中输入 PIN 以配对。请在客户端设置中选择**合适的串流分辨率**和帧数。

## 隐私屏 / 作为副屏

通过“虚拟显示器”功能，可以在串流时关闭真实屏幕，从而实现隐私屏。

::link-card
---
icon: https://www.amyuni.com//images/favicon.png
title: USB 虚拟显示器驱动
link: https://www.amyuni.com/forum/viewtopic.php?t=3030
---
::

这个帖子提供了 `usbmmidd_v2.zip` 下载。将它解压到一个安全的地方，比如 `D:\Software\` ，双击 `usbmmidd.bat` 安装。

### 自定义分辨率

打开注册表，在 `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\WUDF\Services\usbmmIdd\Parameters\Monitors` 中设置虚拟显示器的分辨率，可以给名称为 0~9 的项添加串流客户端的屏幕分辨率为字符串值。

### 设置隐私屏应用

在 Sunshine Web 控制台的“应用程序”标签页中点击 `+ 添加新应用`，配置如下：

- 应用名称：`隐私串流`，下方“启动/退出时执行命令”(Command Preparations) 中添加以下命令：
- 启动/退出时执行命令：
  | ▶ Do Command                    | ↺ Undo Command                        | 🛡 Run as Admin |
  | :------------------------------ | :------------------------------------ | :------------- |
  | `deviceinstaller64 enableidd 0` | `deviceinstaller64 enableidd 0`       | ☑ Elevated     |
  | `deviceinstaller64 enableidd 1` | `deviceinstaller64 enableidd 0`       | ☑ Elevated     |
  |                                 | `rundll32 user32.dll,LockWorkStation` | ☐ Elevated     |
  | `DisplaySwitch /external`       | `DisplaySwitch /internal`             | ☐ Elevated     |
  - 多执行一次“关闭虚拟显示器”是为了防止虚拟显示器多开导致串流主机分辨率异常且操作卡顿。
  - `rundll32 user32.dll,LockWorkStation` 是为了在结束串流后锁定电脑。**注意，串流暂停或结束后电脑声音将不通过串流设备播放。**
- 工作目录：usbmmidd 解压后所在目录
  :copy{prompt command="D:\Software\usbmmidd_v2\"}

点击“保存”按钮，你应该能看到串流列表里多了刚刚添加的“隐私串流”应用。

### Linux 作为服务端，使用虚拟副屏

参考千雪的这篇文章。

::link-card
---
icon: https://q1.qlogo.cn/g?b=qq&nk=3526514925&s=3
title: 📲 在 Linux 上使用 Sunshine 把安卓平板作为虚拟副屏，画面清晰延迟极低
link: https://blog.chyk.ink/2024/05/12/linux-virtual-display-sunshine/
---
::

## 触摸优化

### 多点触控支持

Moonlight 修改版（下载链接在视频简介）支持 Windows 多点触控。

::link-card
---
icon: https://www.bilibili.com/favicon.ico
title: 使用触摸界面串流原神
link: https://www.bilibili.com/video/BV1Si4y1Y7Jb/
---
::

  - 在安卓设置中开启 Moonlight 物理键盘的无障碍功能，即可将安卓设备上的快捷键操作重定向到串流主机上。
  - 如果想唤出设备输入法键盘，可以在 Moonlight 修改版设置中启用 “快捷选项”。

#### 防止多指手势被设备劫持

特别地，在 MIUI / HyperOS 中，可以开启 `设置 > 桌面 > 系统导航方式 > 屏蔽三指、四指手势`，并将 Moonlight 添加到 MIUI 游戏加速列表中，在游戏加速设置中选择屏蔽手势、防误触，在单项游戏高级设置中关闭边缘误触抑制。这样做可以让多指手势通过 Moonlight 发送给宿主机，而不是被 MIUI / HyperOS 捕获。其他品牌设备同理。

### 全屏模式下唤出开始菜单、控制中心或任务栏

串流时从屏幕底端中部上划，即可显示开始菜单；从屏幕底端右侧上划，即可显示控制中心；手势被打断后，只显示任务栏。

### 竖屏串流支持

使用 Sunshine Nightly 版本。

### 使用屏幕键盘

#### 自动弹出 Windows 触摸键盘

将 `Windows 设置 > 时间和语言 > 输入 > 触摸键盘 > 显示触摸键盘` 改为 `始终`。

#### 在任务栏上显示触摸键盘按钮

将 `Windows 设置 > 个性化 > 任务栏 > 系统托盘图标 > 触摸键盘` 改为 `始终`。

#### 客户端键盘

原版 Moonlight 客户端三指轻触即可呼出设备输入法键盘。

#### 全功能键盘

上文提到的 [Moonlight 修改版](#触摸优化) 支持全功能键盘，可以支持更多功能。

😆享受你的串流体验吧！
