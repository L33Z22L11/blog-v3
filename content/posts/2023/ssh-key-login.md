---
title: SSH 免密登录
description: 生成SSH密钥，启用公钥认证，将公钥添加至授权列表，实现 Windows/Linux/GitHub SSH 免密登录。
date: 2023-12-25 16:15:00
updated: 2024-11-02 17:24:04
image: https://7.isyangs.cn/24/6664009c87ec5-24.jpg
categories: [经验分享]
tags: [教程, ssh, 远程]
---

在终端中使用 SSH 之前，可以先美化终端以提升用户体验。

::link-banner
---
banner: https://7.isyangs.cn/24/6671b766a4312-24.jpg
title: Windows 终端体验优化指南
description: 一篇优化 Windows Terminal 体验的指南，涵盖 PowerShell 增强、Oh My Posh 主题配置、集成 Git Bash 以及终端美化等方面。
link: /2024/windows-terminal
---
::

## 生成SSH密钥

ED225519 类型的密钥综合性能更好。

:copy{command="ssh-keygen -t ed25519"}

连续按回车键即可。如果你想自定义生成内容，请使用 `ssh-keygen -t ed25519 -C "内容"`。生成好的**公钥**可以通过 `cat ~/.ssh/id_ed25519.pub` 查看。

## 将公钥加入认证列表

如果服务端是 Windows OpenSSH，请将服务端 `%ProgramData%\ssh\sshd_config` 文件中的此行取消注释（需要管理员权限）：

```sh [%ProgramData%\ssh\sshd_config]
# PubkeyAuthentication yes
```

在`~/.ssh/authorized_keys`文件中逐行添加**公钥**即可。此文件的权限应当是`644`，否则可能会被拒绝读取（也就是无法用SSH公钥认证登录）。

示例：[我的SSH公钥](https://gist.github.com/L33Z22L11/fdac255fe90aa9677bf530e7792db703)

## 避免每次输入用户名和IP地址

在 SSH 配置文件中按照以下格式添加条目，即可直接通过 Host 项的名字连接，还能在 `ssh` 命令输到一半时按 Tab 键自动补全：

```ssh-config [~/.ssh/config]
Host zhilu-server
    Hostname 1.1.1.1
    Port 8022
    User zhilu
```

在 SSH 配置文件中，缩进是一个 Tab 或者 4 个空格。（早期 CMake 的惯用缩进 8 个空格作为规范）

## 使用公钥完成 GitHub 登录

参见 GitHub 官方教程：[通过 SSH 连接到 GitHub](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)。

### 设置 SSH 代理

通常，不建议使用 HTTPS 连接到 GitHub，通过 SSH 连接时一般不需要代理即可直接访问。如果没有使用“TUN 模式”或透明代理（Proxy），系统代理设置不会自动应用到 SSH 连接上。

大多数代理节点不允许直接访问 22 端口，因此在使用 SSH 连接 GitHub 仓库时，应使用 443 端口。

- Linux 和 macOS：可以使用 `nc` 工具来实现 SOCKS5 代理。
- Windows：需要用 `connect` 命令，该命令可在 Git for Windows 提供的 Git Bash 中找到。

设置代理时，在 SSH 配置文件中启用以下内容，将 `ProxyCommand` 的代理地址替换为实际的 SOCKS5 地址：

```ssh-config [~/.ssh/config]
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
    ProxyCommand connect -S 127.0.0.1:10808 %h %p
```
若不是 Windows，需要把 `connect -S` 更改为 `nc -v -x`。

这样配置后，SSH 将通过代理访问 GitHub。注释掉这几行，即可关闭代理设置。

## 关于 SSH 的更多玩法

::link-card
---
icon: https://cdn.yuuu.org/img/favicon-192x192.png
title: ssh 知识整理 | 微霞
link: https://yuuu.org/post/64202.html
---
::
