---
title: Windows 终端体验优化指南
description: 一篇优化 Windows Terminal 体验的指南，涵盖 PowerShell 增强、Oh My Posh 主题配置、集成 Git Bash 以及终端美化等方面。
date: 2024-06-16 22:48:57
updated: 2024-11-02 17:55:29
image: https://7.isyangs.cn/24/6671b766a4312-24.jpg
categories: [经验分享]
tags: [教程, 系统, Windows, 终端]
recommend: true
---

## 启动

- 按 Win+R 打开运行窗口，输入 `wt`{lang="sh"}，回车即可打开 Windows Terminal。
- 按 Win+X 打开开始按钮右键菜单，按 I（或 Alt+I）打开 Windows Terminal。

## PowerShell

### 安装 sudo

如果你还没有升级到 Windows 24H2，你可以通过安装 gsudo 来添加 sudo 支持。

- 安装 gsudo
  :copy{prompt="PS>" code="winget install gsudo"}

新系统的 sudo 命令十分令人恼火，它貌似无法执行 PowerShell 命令。要想在同一目录以管理员权限执行命令：

- 在此目录以管理员权限启动新的终端：
  :copy{prompt="PS>" code="sudo wt -d $(pwd)"}

### 如果使用 Windows Powershell

根据 Microsoft 官方文档，PowerShell 和 Windows PowerShell 是两款不同的产品。

PSReadLine 模块会提供自动补全功能，Windows PowerShell 安装的是旧版本的 PSReadLine 模块，需要强制更新。

- 安装新版 PSReadLine 模块
  :copy{prompt="PS(管理员)>" code="Install-Module PSReadLine -Force"}
  如果第一次执行时提示安装 NuGet 提供程序，那么可能需要再次执行命令才能安装 PSReadLine。

### 启用自动补全

- 新建 PS 配置文件的文件夹，若已存在可以忽略
  :copy{prompt="PS>" code="mkdir $PROFILE/.."}
- 打开 PS 配置文件
  :copy{prompt="PS>" code="notepad $PROFILE"}
  - 也可以更改系统全局配置文件
  :copy{prompt="PS>" code="sudo notepad $PROFILE.AllUsersAllHosts"}
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

### 小技巧

- 快速切换到管理员终端（需要配置 OpenSSH 服务）
  :copy{prompt="PS>" code="ssh localhost"}
- 在配置文件中添加此行，快速进入 Git Bash
  :copy{prompt="$PROFILE" lang="sh" code="Set-Alias bash $env:ProgramFiles\Git\bin\bash"}
- 在配置文件中添加此行，按 `Ctrl+D` 退出 PowerShell
  :copy{prompt="$PROFILE" lang="sh" code="Set-PSReadlineKeyHandler -Chord Ctrl+d -Function DeleteCharOrExit"}

### Oh My Posh

- 安装 oh-my-posh（参见 [官方文档](https://ohmyposh.dev/docs/installation/windows)）
  :copy{prompt="PS>" code="winget install JanDeDobbeleer.OhMyPosh"}
- 更改 PowerShell [执行策略](https://learn.microsoft.com/zh-cn/powershell/module/microsoft.powershell.core/about/about_execution_policies)
  :copy{prompt="PS>" code="Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"}
  - 也可通过管理员权限更改系统策略
  :copy{prompt="PS>" code="sudo Set-ExecutionPolicy RemoteSigned"}
- 配置（参见 [官方文档](https://ohmyposh.dev/docs/installation/prompt)）
  - 打开 PS 配置文件
  :copy{prompt="PS>" code="notepad $PROFILE"}
  - 在文件中添加以下内容
    ```powershell [$PROFILE]
    oh-my-posh init pwsh | Invoke-Expression
    ```
- 安装字体
  - 访问 [Nerd Fonts 网站](https://www.nerdfonts.com/font-downloads) 或者 [Release 页面](https://github.com/ryanoasis/nerd-fonts/releases)
  - 按 `Ctrl+F` 搜索你常使用的字体，并下载（下载 `Symbols Only`/`NerdFontsSymbolsOnly.zip` 即可）
  - 解压后选中字体，右键安装
  - 在 Windows Terminal 中，按 `Ctrl+,` 打开设置
  - 配置文件 - 默认值 - 外观 - 字体 - 选择你下载的字体 - 保存

## Git Bash

在安装了 Git for Windows 后，可以将 Git Bash 添加到 Windows Terminal 中。

- 打开 Windows Terminal 设置
- 配置文件 - 添加新配置文件
  - :copy{prompt="名称" code="Git Bash"}
  - :copy{prompt="命令" code="%ProgramFiles%\Git\bin\bash.exe --login -i"}
  - :copy{prompt="启动目录" code="%USERPROFILE%"}
  - :copy{prompt="图标" code="%ProgramFiles%\Git\mingw64\share\git\git-for-windows.ico"}

::link-banner
---
banner: https://7.isyangs.cn/24/6664009c87ec5-24.jpg
title: SSH 免密登录
description: 生成SSH密钥，启用公钥认证，将公钥添加至授权列表，实现 Windows/Linux/GitHub SSH 免密登录。
link: /2023/ssh-key-login
---
::

## 美化

修改位置：Windows Terminal 设置 - 配置文件 - 默认值 - 外观

- 文本
  - 配色方案：One Half Dark
  - 字体：`Cascadia Code, Symbols Nerd Font`
  - 自动调整无法区分的文本的亮度：仅适用于配色方案中的颜色
- 透明度
  - 背景不透明度：75%
  - 启用亚克力材料：开

## 搜索历史命令

在更新了 PS ReadLine 后，可以通过按 F2 键切换行内补全和补全列表。

另外，`Ctrl + R` 也可用于搜索命令历史记录。使用方法如下：

1. **进入搜索模式**：按下 `Ctrl + R`，你会看到提示符变成 `(reverse-i-search)`，这意味着你可以开始搜索之前执行过的命令。
2. **输入搜索关键字**：开始输入你想要查找的命令的部分内容，PowerShell 会实时显示与输入内容匹配的最近命令。
3. **查看匹配结果**：如果有多个匹配的命令，你可以继续按 `Ctrl + R` 来查看更早的匹配结果。每按一次，会向后查找一个匹配的命令。
4. **执行命令**：当找到想要的命令后，按 `Enter` 执行该命令。
5. **取消搜索**：如果不想执行搜索到的命令，可以按 `Ctrl + G` 或 `Esc` 取消搜索，返回到普通的命令提示符。

同时，`Ctrl + S` 用于正向搜索命令历史记录。使用方法如下：

1. **进入正向搜索模式**：按下 `Ctrl + S`，你会看到提示符变成 `(forward-i-search)`。
2. **输入搜索关键字**：开始输入你想要查找的命令的部分内容，PowerShell 会实时显示与输入内容匹配的下一个命令。
3. **查看匹配结果**：如果有多个匹配的命令，你可以继续按 `Ctrl + S` 来查看下一个匹配结果。
4. **执行命令**：当找到想要的命令后，按 `Enter` 执行该命令。
5. **取消搜索**：按 `Ctrl + G` 或 `Esc` 可以取消搜索，返回到普通的命令提示符。

## 使用 Fastfetch 获取系统信息

在 Windows 下，推荐使用 [Scoop](https://scoop.sh/) 安装命令行程序。安装 Scoop 后，可以通过 `scoop install fastfetch`{lang="sh"} 安装 [Fastfetch](https://github.com/fastfetch-cli/fastfetch)。（参考[Windows 上的开源软件入门 > 使用包管理器安装软件](/2024/sfd-xupt#使用包管理器安装软件)）

- 打印系统信息
  :copy{prompt="PS>" code="fastfetch"}
- 更详细地显示系统信息，并隐藏 Logo
  :copy{prompt="PS>" code="fastfetch -c all -l none"}

Fastfetch 还支持更进一步地定义配置文件。

## 一些有趣的命令

- 通过 PS ReadLine 获取历史记录
  :copy{prompt="PS>" code="Get-Content (Get-PSReadlineOption).HistorySavePath"}
- 获取命令位置（类似于 Linux 的 `which`{lang="sh"}）
  :copy{prompt="PS>" code="(Get-Command <command>).Definition"}
  :copy{prompt="PS>" code="where.exe <command>"}
- 在此次打开文件资源管理器
  :copy{prompt="PS>" code="explorer ."}
- 在无网状态下开启移动热点
  :copy{prompt="PS>" code="[Windows.Networking.NetworkOperators.NetworkOperatorTetheringManager,Windows.Networking.NetworkOperators,ContentType=WindowsRuntime]::CreateFromConnectionProfile([Windows.Networking.Connectivity.NetworkInformation,Windows.Networking.Connectivity,ContentType=WindowsRuntime]::GetInternetConnectionProfile()).StartTetheringAsync()"}
