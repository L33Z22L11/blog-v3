---
title: SSH 免密登录
description: 生成SSH密钥，启用公钥认证，将公钥添加至授权列表，实现 Windows/Linux/GitHub SSH 免密登录。
date: 2023-12-25 16:15:00
updated: 2024-05-30 00:40:31
cover: https://7.isyangs.cn/24/6664009c87ec5-24.jpg
categories: [经验分享]
tags: [教程, ssh, 远程]
---

## 生成SSH密钥

ED225519 类型的密钥综合性能更好。

:copy{prefix="$" code="ssh-keygen -t ed25519"}

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

## 使用公钥完成 GitHub 登录

参见 GitHub 官方教程：[通过 SSH 连接到 GitHub](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)。

## 关于 SSH 的更多玩法

::link-card
---
icon: https://cdn.yuuu.org/img/favicon-192x192.png
title: ssh 知识整理 | 微霞
link: https://yuuu.org/post/64202.html
---
::

:ZSidebar
