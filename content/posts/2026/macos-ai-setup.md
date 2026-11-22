---
title: 我的macOS与AI环境配置偏好
description: 记录我的macOS环境配置，包括终端、Coding Agent和实用软件。
date: 2026-11-22 18:36:58
updated: 2026-11-22 23:01:35
image: # 封面图推荐 2:1，不含与标题重复的文字
categories: [技术]
tags: [macOS, zsh, AI, 环境配置, Herdr]
---

嗨嗨嗨，好久没写环境配置相关的文章了，最近趁着回购了公司的MacBook电脑，终于能把自己配置macOS环境配置文件掏出来了。

当然，AI发展越来越快，你也可以直接把[本文Markdown](/raw/2026/macos-ai-setup.md)当成skill扔给AI，但是新软件新生态会一直变化，所以我会以尽量少而核心的配置变动，撑起一个体验较为舒适的开发流程。

## 终端

我最初的选择其实是 [iTerm2](https://iterm2.com/)，但配置太过于复杂就转向了 [Ghostty](https://ghostty.org/)。

### Homebrew

1. 安装 [Homebrew](https://brew.sh/)，知名的macOS包管理工具
   :copy{code='bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'}

### Ghostty与字体

1. 安装Ghostty
   :copy{code="brew install --cask ghostty"}
2. 安装终端字体
   :copy{code="brew install font-symbols-only-nerd-font font-sarasa-gothic"}
3. 在Ghostty按 :key{cmd platform="mac" code=","}打开设置，写入以下值并保存重载
   ```ini [~/Library/Application Support/com.mitchellh.ghostty/config.ghostty]
   theme = dark: Catppuccin Mocha,light: Catppuccin Macchiato
   font-family = Sarasa Mono SC
   font-size = 15

   # SSH 连接时自动安装远端终端描述；远端缺少 tic 时回退到通用终端类型。
   shell-integration-features = ssh-env,ssh-terminfo
   ```

### Zsh与Powerlevel10k

1. 安装zsh插件
   :copy{code="brew install zsh-autosuggestions zsh-syntax-highlighting powerlevel10k"}
2. 将以下配置写入 `~/.zshrc`
   ```sh [~/.zshrc]
   HISTFILE=~/.histfile
   HISTSIZE=1000
   SAVEHIST=1000

   autoload -Uz compinit
   compinit

   source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
   source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
   source /opt/homebrew/share/powerlevel10k/powerlevel10k.zsh-theme

   bindkey -e
   bindkey '^H' backward-kill-word  # Ctrl+退格 向左删词
   bindkey '^[[1;5C' forward-word   # Ctrl+右方向键 向右移动一个词
   bindkey '^[[1;5D' backward-word  # Ctrl+左方向键 向左移动一个词
   bindkey '^[[1;3C' forward-word   # Option+右方向键 向右移动一个词
   bindkey '^[[1;3D' backward-word  # Option+左方向键 向左移动一个词
   bindkey '^[[H' beginning-of-line # Home 移到行首
   bindkey '^[[F' end-of-line       # End 移到行尾
   bindkey '^[[3;5~' kill-word      # Ctrl+Delete 向右删词
   bindkey '^[[3;3~' kill-word      # Option+Delete 向右删词

   zstyle ':completion:*' menu select
   ```
3. 重启zsh
   :copy{code="exec zsh"}
4. 自动进入Powerlevel10k配置，后续想更改可以通过此命令重设
   :copy{code="p10k configure"}

### 终端信息

可以用fastfetch和btop在终端打印出美观的设备信息
:copy{code="brew install fastfetch btop"}

## 开发环境与AI

::alert{title="包管理器不是万金油"}
无论你是否使用Node环境管理工具，都不建议使用npm安装全局包，除非你清楚将会发生什么。npm全局包目录会随着版本切换而隔离，也面临`$NPM_CONFIG_PREFIX`权限问题，因此建议使用pnpm安装全局包，pnpm 12也会避开npm包在一天内发布的版本，建议使用pnpm独立脚本而不是brew安装pnpm，不然全局目录又不一致……总之为了避免各种心智负担，安装Codex、Claude Code等工具，建议还是走原生安装命令而不是npm包或brew命令。
::

### fnm与Node.js

1. 安装fnm
   :copy{code="brew install fnm"}
2. 一般会提醒在`~/.zshrc`末尾增加初始化命令
   :copy{code="echo 'eval &quot;$(fnm env --use-on-cd --shell zsh)&quot;' >> ~/.zshrc"}
3. 安装Node
   :copy{code="fnm install lts-latest"}
   :copy{code="fnm default lts-latest"}

### pnpm

1. 安装pnpm
   :copy{code="curl -fsSL https://get.pnpm.io/install.sh | sh -"}
2. 安装常用全局包
   :copy{code="pnpm add -g rimram nrm"}

### Codex

1. 安装[Codex](https://github.com/openai/codex?tab=readme-ov-file)
   :copy{code="curl -fsSL https://chatgpt.com/codex/install.sh | sh"}
2. 关闭Codex共享daemon（关闭后Codex不会常驻后台，冷启动较慢占内存略大，但能帮助Herdr更准确地恢复各pane会话）
   :copy{code="codex features disable daemon_auto_start"}

### Herdr与Sheprd

1. 安装[Herdr](https://github.com/herdrdev/herdr?tab=readme-ov-file)
   :copy{code="brew install herdr"}
2. 写入Herdr配置文件
   ```toml [~/.config/herdr/config.toml]
   onboarding = false

   [theme]
   name = "terminal"

   [ui]
   copy_on_select = false

   [ui.toast]
   delivery = "terminal"

   [ui.sidebar.agents]
   rows = [
   	[
   		"state_icon",
   		"terminal_title_stripped"
   	],
   	[
   		"tab",
   		"workspace",
   		{ token = "machine", rules = [ { equals = "Local", ignore_case = true, hide = true } ] },
   		"agent",
   	],
   ]
   ```
3. 安装 [Sheprd](https://github.com/sheprd-labs/sheprd?tab=readme-ov-file)
   :copy{code="brew install --cask penso/tap/herdr-gpui"}
4. 写入Sheprd配置文件。以下是我本机的覆盖配置，未设置的选项会沿用 `config-gpui.toml` 中的值
   ```toml [~/.config/herdr/config-gpui.local.toml]
   theme = "Catppuccin Macchiato"
   show_gpu_load = true
   tab_layout = "cards"
   show_listening_ports = false
   agents_placement = "nested"

   [sidebar]
   family = "Sarasa Mono SC"
   indent = 12.0

   [tabs]
   family = "Sarasa Mono SC"

   [terminal]
   family = "Sarasa Mono SC"
   size = 15.0

   [status_bar]
   theme = "hidden"
   shortcuts = "icon"
   report_issue = "hidden"
   gpu_detail = "compact"
   usage = "compact"

   [features]
   acp_chats = false
   ```

### 其他Coding Agent

DeepSeek可以使用[Deepseek Harness预览版](https://www.deepseek.com/harness/)，接入[OpenRouter](https://openrouter.ai/workspaces/default)、[AMD Readon Cloud Token Factory](https://developer.amd.com.cn/radeon/tokenfactory)等中转站可以用[CLIProxyAPI](https://help.router-for.me/cn/introduction/quick-start)或[Magpie](https://usemagpie.ai/zh/)，按照他们的「Coding Agent客户端配置」文档接入[Pi](https://pi.dev/)用或者[Claude Code](https://code.claude.com/docs/zh-CN/quickstart)，但注意应该用API额度而不是违背用户协议地将Subscription转成本地API。

### AI用量

之前在用[WakaTime](https://wakatime.com/dashboard)，也有了[![wakatime](https://wakatime.com/badge/user/358c7d57-860f-4599-9aa8-f10a631fad01.svg){densities=1}](https://wakatime.com/@358c7d57-860f-4599-9aa8-f10a631fad01)4000h Coding时长，但AI上的统计有点失真了。

我目前在用[Tokscale Tracker](https://tokscale.ai/tracker)和[Vibe Usage](https://vibecafe.ai/usage)。

[![Tokscale Stats](https://tokscale.ai/api/embed/L33Z22L11/svg?tokens=compact&cost=compact){densities=1}](https://tokscale.ai/u/L33Z22L11)

[![VibeUsage](https://vibecafe.ai/@zhilu/badge){densities=1}](https://vibecafe.ai/@zhilu?ref=badge)

如果想通过有SSH客户端的设备看用量，我还有个 :badge[Vibe Usage SSH]{link="https://github.com/L33Z22L11/vibe-usage-ssh"}实现了TUI看板，当然Tokscale已经能看本机的了，这个更像是给其他人展示总用量的小工具。

## 实用软件

### 窗口与显示

1. 窗口切换：[BetterCmdTab](https://github.com/rokartur/BetterCmdTab)，可以使用 :key{cmd platform="mac" code="Tab"} 在窗口之间切换
   :copy{code="brew install --cask bettercmdtab"}
   1. 在通用-启动里打开登录时启动、隐藏菜单栏图标
   2. 在操作方式-悬停操作里打开悬停时显示操作按钮
   3. 在外观-布局里选择列表
   4. 按 :key{cmd code="Tab" platform="mac"} 后松开 :key{icon code="Tab"}，鼠标移动到某个窗口项上松开 :key{cmd platform="mac"}即可切换
2. 鼠标滚动：[LinearMouse](https://github.com/linearmouse/linearmouse)，可以分别设置鼠标和触控板的滚动方向
   :copy{code="brew install --cask linearmouse"}
   1. 推荐在系统设置中开启自然滚动，因为触摸板手势难以翻转
   2. 仅为在应用程序里为指定鼠标设置反向滚动
3. 显示器调节：[Crisp](https://github.com/didriksg/Crisp)，可以调节外接显示器亮度、分辨率和HiDPI
   :copy{code="brew install --cask crisp"}

### 文件与多媒体

1. 视频播放：[IINA](https://iina.io/)
   :copy{code="brew install --cask iina"}
2. 压缩包管理：[MacPacker](https://github.com/sarensw/MacPacker)

### 日常工具

1. 剪贴板记录：[Maccy](https://github.com/p0deje/Maccy)，推荐打开自动粘贴、提升存储数量上限，更改菜单栏图标、关闭搜索框前应用名、显示应用程序图标
   :copy{code="brew install --cask maccy"}
2. 性能监控：[Stats](https://github.com/exelban/stats)，在菜单栏查看CPU、内存等状态，推荐使用合并展示
   :copy{code="brew install --cask stats"}
3. 输入法：[豆包输入法](https://ime.doubao.com/pc)，支持多端实时同步剪贴板

如果你在苦恼macOS电量小组件将键盘显示为鼠标图标，可以试试我写的 :badge[Battery Palette]{link="https://github.com/L33Z22L11/battery-palette"}。

一口气写了几个小时，有点写不动了，随着以后使用再继续完善吧。
