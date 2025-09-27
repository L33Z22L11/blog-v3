---
title: Arch Linux 初步配置
description: 在 Arch Linux 系统上安装配置必备软件，如蓝牙、Yay、Zsh、输入法等。
date: 2023-06-24 09:31:15
updated: 2024-12-19 08:23:15
image: https://7.isyangs.cn/24/6664009851eb0-24.jpg
categories: [经验分享]
tags: [教程, archlinux, 系统]
---

## 如果你没有浏览器

这篇文章中有大量命令，如果你的 Arch Linux 没有浏览器，可以这样做：
- 启动 SSH 服务
  :copy{code="sudo systemctl start sshd"}
- 查看 IP 地址
  :copy{code="ip -br a"}
- 在其他有浏览器的设备上通过 SSH 连接到这台设备（复制后按 Ctrl+Shift+V 粘贴内容）
  :copy{prompt="PS>" code="ssh 用户名@IP地址"}

## 换源

Pacman（Arch Linux 的包管理器）会使用安装时的镜像源列表设置。

如果在安装时使用 ArchInstall 里的 Mirror 选项设置了源，建议使用 Reflector 来更新源。

- 安装
  :copy{code="sudo pacman -S reflector"}
- 使用 Reflector 更新源
  :copy{code="sudo reflector --verbose --country China --sort rate --save /etc/pacman.d/mirrorlist"}
- 移除风控严格的镜像源，防止滚包中断或损坏本地数据库
  :copy{code="sudo sed -i '/zju/d' /etc/pacman.d/mirrorlist"}

如果你在日常滚包时更新时提示 `-> could not open file /var/lib/pacman/sync/core.db: Unrecognized archive format`，说明数据库文件被替换为风控页面的 HTML 文件，需要手动删除被篡改的本地数据库，然后重新滚包。

## 字体

- 中文字体
  :copy{code="sudo pacman -S ttf-sarasa-gothic"}
- Nerd 字体 (zsh 主题需要)
  :copy{code="sudo pacman -S ttf-nerd-fonts-symbols"}

## 设置时间策略

> Linux 一般认为主板时间是 UTC 时间，而 Windows 认为主板时间是当地时间。如果在双系统之间切换，则开机时时间会不正常，所以需要设置时间策略。

- 让 Linux 认为主板时间是当地时间，而不是 UTC
  :copy{code="sudo timedatectl set-local-rtc true"}

> 如果不想这样设置，还可以在 Windows 中添加注册表项，让 Windows 认为主板时间是 UTC。但是不要在两个系统中同时设置，否则矫枉过正会导致切换系统时产生反向时间差。
>
> :copy{prompt="PS(管理员)>" code="reg add HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1"}

## 显卡驱动

- 仅限主流 Nvidia 显卡
  :copy{code="sudo pacman -S nvidia"}

一般情况下不需要做出更多的配置，如果遇到问题，请参考 [ArchWiki - NVIDIA](https://wiki.archlinuxcn.org/wiki/NVIDIA) 和 [archlinux 简明指南 - 显卡驱动](https://arch.icekylin.online/guide/rookie/graphic-driver)（[镜像站](https://arch.cooo.site/guide/rookie/graphic-driver)）。另外，Nvidia 对于 Wayland 的兼容不佳，所以尽可能选择 X11 相关的桌面环境。

- 安装完显卡驱动后重启，检测 Nvidia 显卡驱动是否正常工作
  :copy{code="nvidia-smi"}
- 如果显示 `couldn't communicate with the NVIDIA driver` 提示，可能是显卡驱动没有安装成功
  - 可以先卸载 Nvidia 相关软件包
    :copy{code="sudo pacman -Rs nvidia nvidia-utils"}
  - 强制更新 Pacman 软件包列表
    :copy{code="sudo pacman -Syyuu"}
  - 重新安装 Nvidia 驱动
    :copy{code="sudo pacman -S nvidia"}
  - 重启

之后在桌面右键菜单第二项“配置显示设置…”，将显示器缩放调整为一个合适的倍数。

## Git

:copy{code="sudo pacman -S git"}

## GOPROXY 环境变量

可以使用 [七牛云Goproxy.cn](https://goproxy.cn/)、[goproxy.io](https://goproxy.io/zh/) 镜像加速。

- 编辑环境变量文件
  :copy{code="sudo vim /etc/environment"}
- 向环境变量中添加以下内容（按 `i` 键进入编辑模式，按 `Esc` 键退出编辑模式，输入 `:wq` 保存并退出）
  ```ini [/etc/environment]
  # GOPROXY
  GO111MODULE=on
  GOPROXY=https://goproxy.cn
  ```

## Pacman/Yay 加速编译

- 查看 CPU 线程数
  :copy{code="cat /proc/cpuinfo | grep processor | wc -l"}
- 编辑 makepkg 配置文件
  :copy{code="sudo vim /etc/makepkg.conf"}
- 修改编译线程数：删除 `MAKEFLAGS=j[N]`{lang="ini"} 前面的注释标记，并将 `N` 替换为 CPU 线程数（输入 `/MAKE` 搜索）
  ```ini [/etc/makepkg.conf]
  MAKEFLAGS="-j8"
  ```

## 启用蓝牙

:copy{code="sudo systemctl enable --now bluetooth"}

## Yay

- 下载，需要先安装 Git。
  :copy{code="git clone http://aur.archlinux.org/yay.git && cd yay"}
- 编译安装，不行就多试几次或者换个网络。
  :copy{code="GOPROXY=http://goproxy.cn makepkg -si"}
- 安装后就能清除 Git 目录了。
  :copy{code="cd .. && rm -rf yay"}

## 浏览器

- Microsoft Edge
  :copy{code="yay -S microsoft-edge-dev-bin"}
- Google Chrome
  :copy{code="yay -S google-chrome"}

## VS Code

  :copy{code="yay -S visual-studio-code-bin"}

## V2\$(echo r)aya

需要先安装浏览器，或者局域网下其他设备访问本设备的 2017 端口的 Web 控制台。

- 安装 V2\$(echo r)aya-bin
  :copy{code="yay -S v2$(echo r)aya-bin"}
- 启动 V2\$(echo r)aya 服务并设置开机启动
  :copy{code="sudo systemctl enable --now v2$(echo r)aya"}

如果遇到问题，可以手动安装。

- 切换到 yay/v2\$(echo r)aya 目录
  :copy{code="cd ~/.cache/yay/v2$(echo r)aya-bin"}
- 编辑 PKGBUILD 文件
  :copy{code="vim PKGBUILD"}
- 删除报错的 `armv6h` 架构，并保存退出
  ```ini [PKGBUILD]
  arch=('x86_64') # 主要保留 x86_64 架构即可
  ```
- 编译安装
  :copy{code="GOPROXY=http://goproxy.cn makepkg -si"}
- 启动 V2\$(echo r)aya 服务并设置开机启动

随后点击图标会自动访问 `http://127.0.0.1:2017`，配置即可。

- 点击右上角的“设置”
- 透明Proxy/系统Proxy：`启用: 分流规则与规则端口所选规则一致`
- 透明Proxy/系统Proxy实现方式：`tproxy`
- 规则端口的分流模式：`Mainland 白名单模式`
- 点击“保存并应用”
- 在左上角启停 V2\$(echo r)aya

## Zsh

大多数 Zsh 主题需要 Nerd 字体才能显示图标。

- 安装 Zsh 和常用插件
  :copy{code="sudo pacman -S zsh zsh-completions zsh-autosuggestions zsh-syntax-highlighting"}
- 安装 Powerlevel10k 主题
  :copy{code="yay -S zsh-theme-powerlevel10k"}
- 设置本用户的默认 Shell 为 Zsh
  :copy{code="chsh -s /usr/bin/zsh"}
- 编辑 `~/.zshrc`
  :copy{code="vim ~/.zshrc"}
- 向配置文件中添加以下内容
  ```sh [~/.zshrc]
  # Lines configured by zsh-newuser-install
  HISTFILE=~/.histfile
  HISTSIZE=1000
  SAVEHIST=1000
  bindkey -e
  # End of lines configured by zsh-newuser-install

  # The following lines were added by compinstall
  autoload -Uz compinit
  compinit
  # End of lines added by compinstall

  source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
  source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
  source /usr/share/zsh-theme-powerlevel10k/powerlevel10k.zsh-theme

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

## 输入法

- 安装 Fcitx5 和中文输入插件
  :copy{code="yay -S fcitx5-im fcitx5-chinese-addons"}
- 配置环境变量
  :copy{code="sudo vim /etc/environment"}
- 如果使用 X11，向环境变量添加以下内容
  ```ini [/etc/environment]
  # Fcitx5
  GTK_IM_MODULE=fcitx
  QT_IM_MODULE=fcitx
  XMODIFIERS=@im=fcitx
  SDL_IM_MODULE=fcitx
  INPUT_METHOD=fcitx
  GLFW_IM_MODULE=ibus
  ```
- 如果使用 Wayland，请参考 [Fcitx5 - Arch Linux 中文维基](https://wiki.archlinuxcn.org/wiki/Fcitx5)。
- 还可以将 `fcitx5-chinese-addons` 替换为中州韵和 Rime。

## 继续优化其他体验

::link-banner
---
banner: https://7.isyangs.cn/24/666400971559b-24.jpg
title: Arch Linux 易用性及美化
link: /2023/archlinux-beautify
---
::
