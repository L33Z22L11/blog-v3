---
title: Tailscale 不完全使用指南
description: Tailscale 搭建虚拟局域网，支持多设备间轻松实现 Windows 文件共享、SSH 访问、远程桌面及 Moonlight 游戏串流。
date: 2023-10-08 10:34:00
updated: 2024-05-16 08:30:47
image: https://7.isyangs.cn/24/6664009cce512-24.jpg
categories: [经验分享]
tags: [教程, tailscale, 软件, 远程]
recommend: true
---

## 介绍

Tailscale是一款虚拟组网软件，它不需要公网IP地址，也不会像内网穿透软件过于依赖转发服务器的带宽，只需要安装、登录，你在Internet上的设备就会出现在同一局域网下。

> 工作原理：
>
> - [How Tailscale works](https://tailscale.com/blog/how-tailscale-works)
> - [How NAT traversal works](https://tailscale.com/blog/how-nat-traversal-works)

这篇教程挺不错的，可以阅读一下：

::link-card
---
icon: https://github.com/Ghost-chu.png
title: Tailscale 安利指南 - 快速向你的好友推销 Tailscale
link: https://www.ghostchu.com/4200/tailscale-%e5%ae%89%e5%88%a9%e6%8c%87%e5%8d%97-%e5%bf%ab%e9%80%9f%e5%90%91%e4%bd%a0%e7%9a%84%e5%a5%bd%e5%8f%8b%e6%8e%a8%e9%94%80-tailscale/
mirror: true
---
::

## 安装

打开[Tailscale 官网](https://tailscale.com/)，推荐使用微软账号认证登录，随后给各个设备安装软件，然后在设备上登录，即可进入同一内网环境。

Windows 在安装、登录之后建议在任务栏上右键图标，在“Preferences”菜单中选择“Run unattended”，即可开机自启。

## 常用命令

- 检查Tailscale内网中到某主机的连通性，分为 DERP 中转和 IP 直连两种情况。
  :copy{code="tailscale ping <host>"}
- 检查本机的网络环境。
  :copy{code="tailscale netcheck"}
- 登录新账号，也可以把获取到的登录链接发给他人帮忙登录。
  :copy{code="tailscale login"}

## 重启服务

有时 Tailscale 的直连会中断，变为 DERP 中转模式，此模式下延迟较高，若想以直连方式重连目标机器，可以重启目标机器上的 Tailscale 服务。

特别地，如果在 SSH 中重启服务，请注意 SSH 中断会导致重启失败，无法进行后续连接，所以需要另起一个与 SSH 无关的进程。Linux 中可以使用 `screen`{lang="sh"} 命令，Windows 中可以执行这个脚本文件：

```bat [restart-tailscale.bat]
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd","/c %~s0 ::","","runas",1)(window.close) && exit
powershell Invoke-WmiMethod Win32_Process Create \"powershell Restart-Service Tailscale\"
```

## 传送文件

- 分享文件
  - 电脑：右键文件，选择“Send with Tailscale...”，随后选择设备。
  - 手机：选择分享文件，选择“Tailscale”，随后选择设备。
- 接收文件
  - 文件会自动出现在接收设备的系统默认下载目录中。
  - Linux 系统输入 `sudo tailscale file get`{lang="sh"} 接收文件。

## Windows 文件共享

- 在 Windows 设置中搜索“高级共享设置”，启用“文件和打印机共享”，关闭“密码保护的共享”。
- 在需要共享的文件夹的属性设置中启用共享。
  - 如果想让其他用户访问，则需要给对应的用户添加权限。
  - 如果想免登录访问/修改，则需要给 `Everyone` 用户添加相应权限。
- 在文件资源管理器的地址栏输入 `\\主机名或者虚拟内网IP地址`，即可访问共享文件夹。

### 使用适当的账号查看共享

如果访问某些文件夹时，使用的账号没有对应的权限，则访问会被拒绝。你可以使用以下办法切换账号：

- 方法一：删除对应的Windows凭据
  - 在开始菜单中搜索“凭据”，进入“控制面板\用户帐户\凭据管理器\管理 Windows 凭据”。
  - 删除对应的用户账户，在命令行中输入 `net use /d *`{lang="sh"} 断开共享文件夹连接。
  - 重新访问目标电脑的共享文件夹，应该会弹出登录窗口。
- 方法二：通过映射网络驱动器切换账号
  - 在命令行中输入 `net use /d *`{lang="sh"}，断开先前的共享文件夹连接。
  - 右键目标电脑的某一共享文件夹，选择“映射网络驱动器…”。
  - 勾选“使用其他凭据连接”，输入用户名、密码，勾选“记住我的凭据”。
  - 在文件资源管理器左侧树形导航（或者“此电脑”）中右键刚刚映射的网络驱动器，选择“断开连接”。
  - 重新访问目标电脑的共享文件夹，应该会自动使用新用户登录。

### 在移动端访问

可以使用猫头鹰文件、MixExplorer、VLC 等软件，它们都支持 SMB 协议访问共享文件夹。你可以参考 [电脑连接手机，手机给电脑传文件……](/2024/link-util)。

## Windows OpenSSH

在Windows设置中选择“应用-可选功能-添加可选功能-查看功能”，找到“OpenSSH 服务器”，安装。

在开始菜单中搜索“服务”并打开，找到“OpenSSH SSH Server”，双击，启动类型选择“自动”，并且点击“启动”按钮。

## Windows 远程桌面

远程桌面需要Windows专业版及以上的版本，如果是家庭版系统的话：

- 可以挂载专业版的安装镜像，然后选择保留数据升级。
- 可以使用 RDPWarp、SuperRDP2 之类的软件开启远程桌面服务。

在“Windows 设置-系统-远程桌面”中启用远程连接。

随后可以在客户端按下 `Win+R`，输入 `mstsc`{lang="cmd"}，然后连接到主机名或者虚拟内网IP地址了。

## Moonlight 串流

::link-banner
---
banner: https://7.isyangs.cn/24/6664009b8f999-24.jpg
title: Moonlight 串流指南
description: 服务端Sunshine设置、客户端分辨率调整、隐私屏功能实现及触摸优化。
link: /2024/moonlight-streaming-guide
---
