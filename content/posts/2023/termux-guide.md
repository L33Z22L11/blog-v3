---
title: Termux 简单指南
description: Termux 安装、配置 SSH，切换国内源，安装 ZSH、X11 图形界面，探索更多可能性。
date: 2023-11-13 21:50:08
updated: 2024-04-28 20:25:16
cover: https://7.isyangs.cn/24/6664009d45024-24.jpg
categories: [经验分享]
tags: [教程, termux, 软件]
recommend: true
---

## 安装 Termux

[Termux官网](https://termux.dev/cn/)

## 更换为国内镜像源及升级

- 选择单个国内镜像源
  :copy[termux-change-repo]
- 包列表会自动更新，可以直接升级
  :copy[pkg upgrade]
- 此时 `termux-change-repo` 也会更新，你可以重新选择镜像群组
  :copy[termux-change-repo]
- 启用 root 和 x11 仓库
  :copy[pkg install root-repo x11-repo]

## 安装 SSH

- 安装 OpenSSH
  :copy[pkg install openssh]
  - 如果报错可能是因为没有执行 `pkg upgrade`。
- 设置密码
  :copy[passwd]
- 启动 SSH 服务
  :copy[sshd]
- 如果想要在 Termux 启动后自动启动 `sshd`，可以执行：
  :copy[echo "sshd" >> ~/../usr/etc/profile]

## 使用 Pacman 包管理器(可选)

- 安装 Pacman
  :copy[pkg install pacman]
- 初始化 Pacman
  :copy[pacman-key --init && pacman-key --populate]
- 更新
  :copy[pacman -Syyu]

如果安装遇到 `<filename> exists in filesystem` 问题，可以在安装时添加 `--overwrite="*"` 参数。

## 修改欢迎语(Message of the day)

- 安装 Vim
  :copy[pkg install vim]
  - 也可以使用已安装的 Nano 编辑器。
- 拟定欢迎语
  - 我使用[TextKool](https://textkool.com/en/ascii-art-generator?font=ANSI%20Shadow)生成了艺术字。
- 将欢迎语写入 MOTD 文件
  :copy[vim ~/../usr/etc/motd]

## 安装 Termux:Styling 以更换主题和字体

- 通过 [F-Droid](https://f-droid.org/packages/com.termux.styling/) 下载 Termux:Styling 插件。
  - 可参考 [Termux:Styling - Termux Wiki](https://wiki.termux.com/wiki/Termux:Styling)。
- 安装 Termux:Styling 应用程序。
- 打开 Termux，长按。
- 选择 `More...`，点击 `Style` 即可更改配色方案和字体。
  - 我选择的是 `Base16 One Dark` 配色和 `Iosevka` 字体。

## 安装 Zsh

- 安装 Zsh 和补全插件
  :copy[pkg install git zsh zsh-completions]
- 安装 Zsh 自动建议
  :copy[git clone --depth=1 https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions]
- 安装 Zsh 语法高亮
  :copy[git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting ~/.zsh/zsh-syntax-highlighting]
- 安装 Zsh 主题
  :copy[git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.zsh/powerlevel10k]
- 向 `~/.zshrc` 添加内容：
  :copy[vim ~/.zshrc]

```sh [~/.zshrc]
HISTFILE=~/.histfile
HISTSIZE=1000
SAVEHIST=1000
autoload -Uz compinit && compinit
zstyle ':completion:*' menu select

source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
source ~/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source ~/.zsh/powerlevel10k/powerlevel10k.zsh-theme

bindkey '^[[H' beginning-of-line
bindkey '^[[F' end-of-line
bindkey '^[[1;5C' forward-word
bindkey '^[[1;5D' backward-word
bindkey '^H' backward-kill-word
bindkey '^[[3~' delete-char

zstyle ':completion:*' menu select

alias ls='ls --color=auto'
alias ll='ls -alFh --time-style=iso'
alias ip='ip --color'
alias grep='grep --color=auto'
```

- 设置默认 Shell 并进入
  :copy[chsh -s zsh && exec zsh]
  其他 Linux 发行版的终端名称应当是绝对路径（如 `/usr/bin/zsh`）而不是别名（如 `zsh`）。
- 初次启动时会进入 Powerlevel10k 的配置界面
  - 配置结束后，你也可以通过 `p10k configure` 重新配置主题。

## 安装 Termux:X11 图形界面

- 安装 Termux:X11 支持包
  :copy[pkg install termux-x11-nightly]
- 在手机上安装对应的 [APK文件](https://github.com/termux/termux-x11/releases/tag/nightly)。
- 安装 Xfce4 桌面环境，也可以选择其他桌面环境
  :copy[pkg install xfce4 xfce4-goodies]
- 以后可以使用此命令启动桌面环境进程，亦可将此命令写在脚本中，方便启动。
  :copy[termux-x11 :1 -xstartup "dbus-launch --exit-with-session xfce4-session"]

## 更多

安装了 Termux，还可以干什么？有人用它启动 code-server，有人用它搭建博客，有人用它开启 Minecraft 服务器，有人用它远程连接到自己的服务器……你可以通过搜索引擎了解更多可能。
