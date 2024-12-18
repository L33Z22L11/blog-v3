---
title: 使用 DOSBox 的多种方式
description: DOSBox 放大画面、自动挂载、网页版和 VS Code 插件。
date: 2024-05-11 16:05:40
updated: 2024-05-30 16:42:29
categories: [经验分享]
tags: [教程, 软件, DOSBox]
---

学校开展了计算机科学导论、微型计算机原理与接口技术相关课程，要求学生使用 DOSBox 模拟 DOS 环境进行汇编。但网上看到的教程不全，遂撰写此文。

## 在 Windows 上安装 DOSBox

- 下载 DOSBox 并安装。
  - [官网下载](https://www.dosbox.com/download.php#:~:text=Windows)
  - 如果你电脑具有较好的国际互联网接入环境，可以通过 WinGet 一键安装。
    :copy{prompt="PS>" code="winget install dosbox"}
- 在以下地址之一下载 MASM 套件，解压到 `D:\Software\MASM`。
  - [dosasm/dosrun MASM-v5.00](https://github.com/dosasm/dosrun/tree/main/bundles/src/MASM-v5.00/masm)
  - [dosasm/dosrun MASM-v6.11](https://github.com/dosasm/dosrun/tree/main/bundles/src/MASM-v6.11/masm)
  - [froginwell/assembly](https://github.com/froginwell/assembly/tree/master/software)

### 优化体验

使用以下方式之一打开配置文件，版本号可能有所不同：

- 在开始菜单中搜索“DOSBox 0.74-3 Options”打开。
- 在“开始菜单>所有应用>DOSBox 0.74-3”中找到“DOSBox 0.74-3 Options”打开。
- :copy{prompt="CMD>" code="notepad %LocalAppData%\DOSBox\dosbox-0.74-3.conf"}
- :copy{prompt="PS>" code="code $env:LOCALAPPDATA\DOSBox\dosbox-0.74-3.conf"}

#### 修改显示大小

> Alt-Enter 组合键可以切换全屏和窗口模式，但是全屏后任何焦点变化（打开开始菜单、切换窗口）都会导致退出全屏。
>
> 切换全屏和窗口模式时，会伴有屏幕分辨率切换，会短暂黑屏几秒，并且其他窗口大小会受到影响（未最大化的窗口缩小到640*400，即受到全屏时的分辨率限制）。因此建议通过修改配置文件来避免使用全屏模式。

找到配置文件开头的这两行：

```ini [doxbox-0.74-3.conf]
windowresolution=original
output=surface
```

- 想要放大画面，可以修改 `windowresolution` 为以下值：
  - `1280x800`{lang="ini"}（2倍）
  - `960x600`{lang="ini"}（1.5倍）
- 如果修改了 `windowresolution`，`output` 方式也要修改。
  - 网上的多数教程都改成了 `opengl`{lang="ini"}，这种方式会导致**缩放模糊**。并且多数学生使用的笔记本同时具有核显和独显，OpenGL 引擎启动时会调用独立显卡，**增加耗电**。
  - 在这里，本人推荐改成 `overlay`{lang="ini"} 或者 `ddraw`{lang="ini"}，这些输出方式使用临近（Nearest）缩放算法，字体边缘更清晰，不会出现模糊。

#### 自动挂载

在配置文件末尾，`[autoexec]`{lang="ini"} 一节下添加以下内容，参数中的文件夹路径可以随自己喜好修改：

```ini [doxbox-0.74-3.conf]
[autoexec]
# 将 Windows 系统 D:\Software\MASM 文件夹挂载到 DOS 虚拟磁盘 C:
MOUNT C D:\Software\MASM
# 设置 C: 为 PATH，使得 MASM 文件夹中的程序在任何目录下都可调用
SET PATH=C:
# 将【已经创建的】本地代码目录挂载到 DOS 虚拟磁盘 D:
MOUNT D D:\CodeXUPT\Assembly
# 切换到 D:
D:
```

这样，启动 DOSBox 后，就会自动挂载 MASM 文件夹和代码文件夹。并且可以在代码目录下，直接通过 `masm`{lang="sh"} `debug`{lang="sh"} 等指令操作文件。

## 使用网页版 DOSBox

::link-card
---
icon: https://dosasm.github.io/dosrun/favicon.ico
title: Playground - An x86 assembly playGround in JSDos environment
link: https://dosasm.github.io/dosrun/
---
::

这个网站通过 js-dos 模拟 DOS 环境，提供了 DOS 编程练习功能，还附有一份 [帮助文档](https://dosasm.github.io/docs/tutorial-playGround/playGround)。网站托管在 GitHub Pages 上，有概率无法访问。

你也可以在CO导航的“校友推荐”板块中找到这个网站。

::link-card
---
icon: https://cooo.site/favicon.ico
title: CO导航 - 西邮导航服务
link: https://cooo.site/
---
::

## 在 VS Code 中使用 DOSBox

- 在 VS Code 中安装 [MASM/TASM 插件](https://marketplace.visualstudio.com/items?itemName=xsro.masm-tasm)。
- 在扩展设置中，将“Masmtasm.ASM: Assembler（选择使用的汇编工具）”项更改为“MASM”。
  - 也可以直接在配置文件中添加以下内容：
    ```json [%APPDATA%/Code/User/settings.json]
    {
      "masmtasm.ASM.assembler": "MASM",
    }
    ```
- 在 `.asm` 文件的编辑界面右键，可以看到运行调试相关的选项。

如果遇到问题，可以查看 [帮助文档](https://dosasm.github.io/docs/tutorial-masm-tasm/vsce-basic)。
