---
title: VS Code 简单配置项
description: 简单配置 VS Code，启用字体连字、平滑滚动、自动换行等功能，并提供了前端实用配置和常用快捷键，提升编辑器体验。
date: 2023-04-13 20:05:50
updated: 2024-12-18 22:13:41
image: https://7.isyangs.cn/24/65a8dcff71bdf-24.jpg
categories: [经验分享]
tags: [教程, vscode, 软件]
recommend: true
---

## 主题和图标

我先前常用 OneDark Pro 主题搭配 Material Icon Theme 图标包。目前在用 Catppuccin Mocha 主题和图标包，这个主题具有彩虹色标题和括号对，非常有趣。

使用 Material Product Icons 产品图标可以显著增强图标可读性。

## 配置文件

如果你想获得与我接近的体验，可以选择性地添加以下配置。

### 基础样式

```json [%APPDATA%/Code/User/settings.json]
{
  // 编辑器字体
  "editor.fontFamily": "Sarasa Mono SC, JetBrains Mono, Fira Code, Monaco, Consolas, 'monospace', system-ui, monospace, Symbols Nerd Font, FiraCode Nerd Font, JetBrainsMono Nerd Font, Hack Nerd Font",
  // 编辑器字体连字特性
  "editor.fontLigatures": true,
  // 编辑器字体大小
  "editor.fontSize": 17,
  // Ctrl+滚轮 缩放编辑器字体大小
  "editor.mouseWheelZoom": true,
  // 编辑器的空格渲染为“·”，并隐藏字词之间的单个空格
  "editor.renderWhitespace": "boundary",
  // 编辑器自动换行，也可通过 Alt+Z 切换
  "editor.wordWrap": "on",
  // 终端字体大小
  "terminal.integrated.fontSize": 15,
  // Ctrl+滚轮 缩放终端字体大小
  // "terminal.integrated.mouseWheelZoom": true,
  // 编辑器选项卡自动换行而非横向滚动
  "workbench.editor.wrapTabs": true,
}
```

### 增强样式

```json [%APPDATA%/Code/User/settings.json]
{
  // 编辑器光标渐变闪烁动画
  "editor.cursorBlinking": "phase",
  // 编辑器光标平滑移动动画
  "editor.cursorSmoothCaretAnimation": "on",
  // 括号对高亮引导线
  "editor.guides.bracketPairs": true,
  // 编辑器缩略图渲染为色块而非字符
  "editor.minimap.renderCharacters": false,
  // 放大编辑器缩略图
  "editor.minimap.scale": 2,
  // 缩略图高亮当前所在区域
  "editor.minimap.showSlider": "always",
  // 缩略图自适应宽度
  "editor.minimap.size": "fit",
  // 最后一空行淡化行号
  "editor.renderFinalNewline": "dimmed",
  // 编辑器平滑滚动动画
  "editor.smoothScrolling": true,
  // 终端平滑滚动动画
  "terminal.integrated.smoothScrolling": true,
  // 终端当前命令吸附至顶端
  // "terminal.integrated.stickyScroll.enabled": true,
  // 设置窗口标题栏外观，可以屏蔽 Linux 的默认 GTK 样式
  "window.titleBarStyle": "custom",
  // 设置工作台活动栏（左侧栏）图标置顶，增加横向空间
  // "workbench.activityBar.location": "top",
  // 启用工作台列表平滑滚动动画
  "workbench.list.smoothScrolling": true,
}
```

### 项目优化

我十分理解未保存代码可能会丢失修改，但我依然不建议启用自动保存。一方面 VS Code 会保持未保存文件的编辑状态，另一方面，自动保存会影响以下体验：

- 使用带有热更新功能的插件（Live Server）、框架（Vite）时页面会频繁异常刷新。
- 无意识的键入文本会导致代码损坏。如果你之后关闭了窗口，那么做出的修改难以复原。
- 与保存时自动格式化功能冲突。**与其自动保存+手动格式化，不如按 `Ctrl+S` 保存时自动格式化**。这样不仅方便，并且还能养成频繁保存的习惯。

```json [%APPDATA%/Code/User/settings.json]
{
  // 对于 Markdown 文件
  "[markdown]": {
    "editor.fontSize": 19,
    // 启用 Markdown 打字机模式，打字时当前行位于屏幕中央
    // 较大的值会完全居中，同时不利于拖动选中的文本
    // "editor.cursorSurroundingLines": 9,
    // 不猜测字符集编码，因为绝大多数都使用 UTF-8
    "files.autoGuessEncoding": false,
    // 保存时不删除行末空格，因为尾随两个空格代表换行
    "files.trimTrailingWhitespace": false,
  },
  // 保存时自动格式化，可按 Ctrl+K, Ctrl+Shift+S 保存时不格式化
  "editor.formatOnSave": true,
  // 编写代码时自动格式化
  "editor.formatOnType": true,
  // 行内代码提示只在按下 Ctrl+Alt 时显示
  "editor.inlayHints.enabled": "offUnlessPressed",
  // 自动检测文件编码
  "files.autoGuessEncoding": true,
  // Git 定时拉取
  "git.autofetch": true,
  // 编辑器行内显示 Git blame 追溯信息
  "git.blame.editorDecoration.enabled": true,
  // 编辑器状态栏显示 Git blame 追溯信息
  "git.blame.statusBarItem.enabled": true,
  // 同步 Git 存储库无需确认
  "git.confirmSync": false,
  // 在没有暂存的更改时提交所有更改
  "git.enableSmartCommit": true,
  // 集成终端中 Git 触发编辑器时使用 VS Code
  "git.terminalGitEditor": true,
  // 增大集成终端最大记录行数
  "terminal.integrated.scrollback": 10000,
}
```

### 前端配置

```json [%APPDATA%/Code/User/settings.json]
{
  "[css]": {
    // 使用 Stylelint 格式化，防止原生格式化后产生冲突
    // 对于未配置 Stylelint 的项目，需要手动调用原生格式化
    "editor.defaultFormatter": "stylelint.vscode-stylelint",
  },
  // 保存时使用 ESLint 和 Stylelint 修复代码风格，需要在项目内配置
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
    "source.fixAll.stylelint": "always",
  },
  // 链接式编辑（HTML标签自动重命名）
  // "editor.linkedEditing": true,
  // Iconify IntelliSense 显示图标时不隐藏图标名
  "iconify.inplace": false,
  // Stylelint 启用的语言
  "stylelint.validate": [
    "css",
    "postcss",
    "scss",
    "vue",
  ],
  // Vue 在 ref 后自动补全 .value
  "vue.autoInsert.dotValue": true,
  // Vue 内联提示：显示解构的属性
  // /* props. */destructedProp
  "vue.inlayHints.destructuredProps": true,
  // Vue 内联提示：显示内联处理程序中的事件参数
  // <Comp @e="/* $event => */ func()" />
  "vue.inlayHints.inlineHandlerLeading": true,
  // Vue 内联提示：显示缺失的必需属性
  // <Comp /* !prop1 */ />
  "vue.inlayHints.missingProps": true,
  // Vue 内联提示：显示 v-bind 缩写
  // <Comp :prop/* ="prop" */ />
  "vue.inlayHints.vBindShorthand": true,
}
```

### 其他配置

```json [%APPDATA%/Code/User/settings.json]
{
  // 设置 C/C++ 插件的格式化规则
  "C_Cpp.clang_format_fallbackStyle": "{BasedOnStyle: Chromium, IndentWidth: 4}",
  // 设置 clangd 插件 include 路径
  "clangd.fallbackFlags": [
    "-I${workspaceFolder}",
  ],
  // 忽略某些扩展的配置同步
  "settingsSync.ignoredExtensions": [
    // 如在 Windows 上使用 C/C++，在 Linux 上使用 clangd
    "ms-vscode.cpptools",
    "llvm-vs-code-extensions.vscode-clangd",
  ],
  // Error Lens 插件错误提示字号
  "errorLens.fontSize": ".8em",
  // 错误提示的背景不覆盖整行
  "errorLens.messageBackgroundMode": "message",
  // 错误提示的字数限制
  "errorLens.messageMaxChars": 50,
  // 错误提示携带图标
  "errorLens.messageTemplate": "$severity $message",
}
```

## 常用功能和快捷键

可以通过 GitHub 登录账户启用设置同步，在 GitHub 网页浏览仓库时按 `.` 键能进入网页版 VS Code 编辑器。

工作台“资源管理器”选项卡的“时间线”（窗口左下角）功能十分有用，可以查看文件修改历史及修改时间，对比差异或恢复。

VS Code 里有许多有用的快捷键，比如：

- 按 `F1` 或 `Ctrl+Shift+P` 打开命令面板，搜索要执行的操作，还可以查看或设置操作的快捷键。
- `Ctrl+P` 快速打开项目内文件。
- `Ctrl+R` 快速打开最近的项目（文件夹/文件）。
- `Ctrl+K, Ctrl+W` 关闭所有选项卡，我称其为「选项卡清理大师」。

再比如文本编辑时：

- `Ctrl+D` 快速选中多个相同的文本。
- `Ctrl+Alt+Backspace` 可以删除光标所在的括号对。
- `Alt+Shift+→` 可以扩选光标所在的文本范围，这在处理引号包裹的字符串或 HTML 标签时十分有用。
