---
title: VS Code 简单配置项
description: 简单配置 VS Code，启用字体连字、平滑滚动、自动换行等功能，并设置 C 格式化风格，提升编辑器体验。
date: 2023-04-13 20:05:50
updated: 2024-06-08 00:04:21
cover: https://7.isyangs.cn/24/65a8dcff71bdf-24.jpg
categories: [经验分享]
tags: [教程, vscode, 软件]
---

## 精简版

我个人喜好少而高效的配置，所以这里给出一个简单的配置，适用于大部分人。

```json [%APPDATA%/Code/User/settings.json]
{
  "editor.fontLigatures": true,
  "editor.cursorBlinking": "phase",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.mouseWheelZoom": true,
  "editor.renderWhitespace": "boundary",
  "editor.smoothScrolling": true,
  "editor.wordWrap": "on",
  "files.autoGuessEncoding": true,
  "terminal.integrated.smoothScrolling": true,
  "workbench.list.smoothScrolling": true,
  "workbench.editor.wrapTabs": true,
  "C_Cpp.clang_format_fallbackStyle": "{BasedOnStyle: Chromium, IndentWidth: 4}"
}
```

## 详细配置

如果你想获得与我接近的体验，可以选择性地添加以下配置。

### 显示优化

我常用的主题是 OneDark Pro，图标是 Material Icon Theme。

另外还有 Catppuccin Mocha 主题和图标包也十分推荐。

```json [%APPDATA%/Code/User/settings.json]
{
  // 设置编辑器字体
  "editor.fontFamily": "Sarasa Mono SC, Fira Code, JetBrains Mono, Consolas, 'monospace', system-ui, monospace, Symbols Nerd Font, JetBrainsMono Nerd Font, Hack Nerd Font",
  // 启用字体连字特性
  "editor.fontLigatures": true,
  // 设置编辑器字体大小
  "editor.fontSize": 17,
  // 将编辑器中的空格渲染为“·”，并隐藏字词之间的单个空格
  "editor.renderWhitespace": "boundary",
  // 设置终端字体大小
  "terminal.integrated.fontSize": 16,
  // 编辑器小地图显示色块而不是字符
  "editor.minimap.renderCharacters": false,
  // 放大小地图
  "editor.minimap.scale": 2,
  // 小地图高亮当前所在区域
  "editor.minimap.showSlider": "always",
  // 终端当前命令吸附至顶端
  "terminal.integrated.stickyScroll.enabled": true
}
```

VS Code 1.90 集成终端乱码是一个 [<i class='fa-brands fa-github'></i> bug](https://github.com/microsoft/vscode/issues/211922)，可以通过设置 `terminal.integrated.shellIntegration.enabled` 为 `false` 来解决。

### 便捷使用

工作台“资源管理器”选项卡的“时间线”（窗口左下角）功能十分有用，可以查看文件修改历史及修改时间，对比差异或恢复。

VS Code 里有许多有用的快捷键，比如 Ctrl+D 快速选中多个相同的文本。可以按 F1 或 Ctrl+Shift+P 打开命令面板，搜索你要执行的操作，可以查看或设置操作的快捷键。

```json [%APPDATA%/Code/User/settings.json]
{
  // 启用 Ctrl+滚轮 缩放编辑器字体大小
  "editor.mouseWheelZoom": true,
  // 打开编辑器自动换行，按 Alt+Z 也能切换
  "editor.wordWrap": "on",
  // 启用 Ctrl + 滚轮缩放终端字体大小
  "terminal.integrated.mouseWheelZoom": true,
  // 启用编辑器标签页自动换行，代替打开的标签页过多时标签页水平滚动的行为
  "workbench.editor.wrapTabs": true
}
```

### 丝滑动画

看起来更流畅了。

```json [%APPDATA%/Code/User/settings.json]
{
  // 设置文本光标闪烁动画为渐变闪烁
  "editor.cursorBlinking": "phase",
  // 启用文本光标平滑移动动画
  "editor.cursorSmoothCaretAnimation": "on",
  // 启用编辑器平滑滚动动画
  "editor.smoothScrolling": true,
  // 启用终端平滑滚动动画
  "terminal.integrated.smoothScrolling": true,
  // 启用工作台列表平滑滚动动画
  "workbench.list.smoothScrolling": true
}
```

### 项目优化

我十分理解未保存代码可能会丢失修改，但我依然不建议启用自动保存。一方面 VS Code 会保持未保存文件的编辑状态，另一方面，自动保存会影响以下体验：

- 使用带有热更新功能的插件（Live Server）、框架（Vite）时页面会频繁异常刷新。
- 无意识的键入文本会导致代码损坏。如果你之后关闭了窗口，那么做出的修改难以复原。
- 与保存时自动格式化功能冲突。相比于按格式化快捷键，按保存快捷键时自动格式化更方便，并且还能养成频繁保存的习惯。

```json [%APPDATA%/Code/User/settings.json]
{
  // 保存时自动格式化，可按 Ctrl+K, Ctrl+Shift+S 保存时不格式化
  "editor.formatOnSave": true,
  // 编写代码时自动格式化
  "editor.formatOnType": true,
  // 自动检测文件编码
  "files.autoGuessEncoding": true,
  // 设置 C/C++ 插件的格式化规则
  "C_Cpp.clang_format_fallbackStyle": "{BasedOnStyle: Chromium, IndentWidth: 4}",
  // 设置 clangd 插件 include 路径
  "clangd.fallbackFlags": [
    "-I${workspaceFolder}"
  ],
  // 设置 Git 相关自动操作
  "git.autofetch": true,
  "git.enableSmartCommit": true,
  "git.confirmSync": false
}
```

### 杂项

这些项目可能会影响少数情况下的体验。

```json [%APPDATA%/Code/User/settings.json]
{
  // 设置窗口标题栏样式，可以屏蔽 Linux 的默认 GTK 样式
  "window.titleBarStyle": "custom",
  // 设置工作台活动栏（左侧栏）图标置顶，增加横向空间
  // "workbench.activityBar.location": "top",
  // 忽略某些扩展的配置同步
  "settingsSync.ignoredExtensions": [
    // 如在 Windows 上使用 C/C++，在 Linux 上使用 clangd
    "ms-vscode.cpptools",
    "llvm-vs-code-extensions.vscode-clangd"
  ],
  // 启用 Markdown 打字机模式，打字时当前行位于屏幕中央
  "[markdown]": {
    "editor.fontSize": 21,
    "editor.cursorSurroundingLines": 5 // 较大的值会完全居中
  },
  // 只在按下 Ctrl+Alt 时显示行内代码提示
  "editor.inlayHints.enabled": "offUnlessPressed"
}
```
