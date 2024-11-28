---
title: 电脑连接手机，手机给电脑传文件……
description: 在同一局域网下，电脑与手机之间互传文件、屏幕投影和远程控制的各种方法。
date: 2024-02-01 00:28:48
updated: 2024-11-28 11:08:41
image: https://7.isyangs.cn/24/6664009b04dea-24.jpg
categories: [经验分享]
tags: [教程, Windows, 安卓, 互联, 互传, 网络, 系统, 远程]
---

以下内容假定你的设备在同一局域网下，如果不在，你可以参考 [Tailscale 不完全使用指南](/2023/tailscale-incomplete-guide)。

## 传输文件

不管以什么为服务端，都可以实现双向互传文件。

### 以电脑为服务端

- 如果有 Python，可以在文件夹内运行命令`python -m http.server <端口号>`{lang="sh"}，其他设备浏览器输入电脑 IP 地址的 8000 端口即可访问，适合少量大文件的分发。
- ⭐SMB 文件共享：参阅 [Windows 文件共享](/2023/tailscale-incomplete-guide#Windows-文件共享) 一节的内容(内网无需安装Tailscale)，手机可以安装猫头鹰文件查看/下载。
- Windows 就近共享：在手机上安装 [NearShare](https://nearshare.shortdev.de/) 或者 [AndDrop](https://www.appinn.com/anddrop/)。
- macOS 隔空投送：安卓手机可以安装 [AndDrop](https://www.appinn.com/anddrop/)。
- ToDesk、向日葵具有传输文件的功能，QQ 也有直接查看电脑文件的功能，但升级后砍了。

### 以手机为服务端

- ⭐系统自带文件管理/互传 APP：一般具有 FTP/HTTP 文件管理服务。
- [文件闪传](https://skyhacker2.github.io/blog/index.html?projects/%E6%96%87%E4%BB%B6%E9%97%AA%E4%BC%A0.md)：通过网页管理手机文件。
- [简朴](https://github.com/ismartcoding/plain-app/blob/main/README_zh_CN.md)：浏览器管理手机文件。
- [⭐猫头鹰文件](https://www.skyjos.cn/owlfiles/)：可访问 FTP/SFTP/WebDAV/SMB 服务器，也可以自建 SMB 服务器。
- Tailscale：右键，选设备，发送！参阅 [传送文件](/2023/tailscale-incomplete-guide#传送文件) 一节的内容。

### 对等传输

- [KDE Connect](https://kdeconnect.kde.org/)：文件、链接、键鼠。
- [LocalSend](https://localsend.org/)：全平台文件传输工具。
- [⭐Web Link](https://webl.ink/)：通过 WebRTC 实现的网页版文件传输工具，NAT 打洞成功后可以满速传输文件。

### 大道至简

在设备终端命令行内安装 OpenSSH (手机在 Termux 内操作，需要执行 `termux-setup-storage`{lang="sh"} 命令)，然后用 `scp`{lang="sh"} 命令完成这一切吧。

## 屏幕投影

### 电脑

- [VLC](https://www.videolan.org/vlc/)：选择“媒体>流>捕获模式>桌面”，随后可以将画面串流成多种协议的内容。
- [AirDroid Cast 网页版](https://webcast.airdroid.com/home)：通过浏览器的能力捕获画面，无线投屏到其他设备。

### 安卓手机

- [⭐ScreenStream](https://github.com/dkrivoruchko/ScreenStream)：安卓设备投屏到网页。
- 文件闪传也附带投屏功能。

### 终端共享 Shell 会话

- 使用 screen 开启共享会话，其他设备 ssh 连接上后执行 `screen -x`{lang="sh"} 即可共享输出。
- 也可以使用 gotty、tty-share 等工具将 shell 会话投影到网页上。

## 远程控制

### 电脑

- ⭐微软自带的远程桌面：家庭版不可使用（可以用 [SuperRDP2](https://github.com/anhkgg/SuperRDP) 解锁），使用时电脑会锁定。
- 第三方商业软件：Todesk(内存泄漏)、向日葵远程控制(轻度广告)、RayLink。
- ⭐Moonlight：电脑端需要有 Sunshine / NVIDIA SHIELD 服务，可参考 [Moonlight 串流指南](/2024/moonlight-streaming-guide)。
- [spacedesk](https://test.spacedesk.net/home)：作为电脑的扩展屏使用。

### 手机

- 系统自带家人关怀远程协助应用：如果有的话。
- [RustDesk](https://rustdesk.com/zh/)：全平台互相控制。
- AnLink：操作手机、播放手机音频、传输文件。
- [Scrcpy](https://github.com/Genymobile/scrcpy) / [⭐Escrcpy](https://github.com/viarotel-org/escrcpy)：基于 USB 调试/无线调试特性操作手机，前者需要安装配置 Android Platform Tools (ADB)环境，为命令行程序，后者已集成好环境，具有图形化界面，还支持播放设备音频、同时开启多个 APP。

### 大道至简

你需要 OpenSSH。
