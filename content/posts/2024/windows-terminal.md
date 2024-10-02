---
title: Windows 终端体验优化指南
description: 一篇优化 Windows Terminal 体验的指南，涵盖 PowerShell 增强、Oh My Posh 主题配置、集成 Git Bash 以及终端美化等方面。
date: 2024-06-16 22:48:57
updated: 2024-09-14 19:57:42
image: https://7.isyangs.cn/24/6671b766a4312-24.jpg
categories: [经验分享]
tags: [教程, 系统, Windows, 终端]
recommend: true
---

## 启动

- 按 Win+R 打开运行窗口，输入 `wt`，回车即可打开 Windows Terminal。
- 按 Win+X 打开开始按钮右键菜单，按 I（或 Alt+I）打开 Windows Terminal。

## PowerShell

### 安装 sudo

虽然 Windows 会在即将推出的版本加上 sudo，但目前还没有，需要通过安装 gsudo 来添加 sudo 支持。

- 安装 gsudo
  :copy{prompt="PS>"}[winget install gsudo]

### 如果使用 Windows Powershell

根据 Microsoft 官方文档，PowerShell 和 Windows PowerShell 是两款不同的产品。

PSReadLine 模块会提供自动补全功能，Windows PowerShell 安装的是旧版本的 PSReadLine 模块，需要强制更新。

- 安装新版 PSReadLine 模块
  :copy{prompt="PS>"}[sudo Install-Module PSReadLine -Force]
  如果第一次执行时提示安装 NuGet 提供程序，那么可能需要再次执行命令才能安装 PSReadLine。

### 启用自动补全

- 新建 PS 配置文件的文件夹，若已存在可以忽略
  :copy{prompt="PS>"}[mkdir $PROFILE/..]
- 打开 PS 配置文件
  :copy{prompt="PS>"}[notepad $PROFILE]
  - 也可以更改系统全局配置文件
  :copy{prompt="PS>"}[sudo notepad $PSHOME\profile.ps1]
- 添加以下内容
  ```powershell [$PROFILE]
  # 按 Tab 键显示补全菜单，按方向键切换选项
  Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
  # 启用行内自动补全，按右方向键补全
  Set-PSReadLineOption -PredictionSource History
  # 启用自动补全列表，按 F2 也可以切换行内补全和补全列表
  # Set-PSReadLineOption -PredictionSource History -PredictionViewStyle ListView
  # 行内自动补全使用 Ctrl+右方向键 按单词补全
  Set-PSReadLineKeyHandler -Chord "Ctrl+RightArrow" -Function ForwardWord
  ```

### Oh My Posh

- 安装 oh-my-posh（参见 [官方文档](https://ohmyposh.dev/docs/installation/windows)）
  :copy{prompt="PS>"}[winget install JanDeDobbeleer.OhMyPosh]
- 配置（参见 [官方文档](https://ohmyposh.dev/docs/installation/prompt)）
  - 更改 PS 脚本执行策略
  :copy{prompt="PS>"}[sudo Set-ExecutionPolicy RemoteSigned]
  - 打开 PS 配置文件
  :copy{prompt="PS>"}[notepad $PROFILE]
  - 在文件中添加以下内容
    ```powershell [$PROFILE]
    oh-my-posh init pwsh | Invoke-Expression
    ```
- 安装字体
  - 访问 [Nerd Fonts 网站](https://www.nerdfonts.com/font-downloads) 或者 [Release 页面](https://github.com/ryanoasis/nerd-fonts/releases)
  - 按 Ctrl+F 搜索你常使用的字体，并下载
  - 解压后选中字体，右键安装
  - 在 Windows Terminal 中，按 Ctrl+, 打开设置
  - 配置文件 - 默认值 - 外观 - 字体 - 选择你下载的字体 - 保存

#### VS Code 集成终端乱码

这是一个 [bug](https://github.com/microsoft/vscode/issues/211922)，可以通过设置 `terminal.integrated.shellIntegration.enabled` 为 `false` 来解决。

## Git Bash

在安装了 Git for Windows 后，可以将 Git Bash 添加到 Windows Terminal 中。

- 打开 Windows Terminal 设置
- 配置文件 - 添加新配置文件
  - :copy{prompt="名称"}[Git Bash]
  - :copy{prompt="命令"}[%ProgramFiles%\Git\bin\bash.exe --login -i]
  - :copy{prompt="启动目录"}[%USERPROFILE%]
  - :copy{prompt="图标"}[%ProgramFiles%\Git\mingw64\share\git\git-for-windows.ico]

## 美化

修改位置：Windows Terminal 设置 - 配置文件 - 默认值 - 外观

- 文本
  - 配色方案：One Half Dark
  - 字体：CaskaydiaCove Nerd Font 或通过 Scoop 的 `Cascadia-Code` 包提供的 Cascadia Code NF
  - 自动调整无法区分的文本的亮度：仅适用于配色方案中的颜色
- 透明度
  - 背景不透明度：50%
  - 启用亚克力材料：开
