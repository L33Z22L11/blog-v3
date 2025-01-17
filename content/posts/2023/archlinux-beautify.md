---
title: Arch Linux 易用性及美化
description: Plasma 桌面环境下优化小键盘、触摸板行为，配置字体。
date: 2023-07-24 21:27:45
updated: 2024-12-19 08:54:18
image: https://7.isyangs.cn/24/666400971559b-24.jpg
categories: [经验分享]
tags: [教程, archlinux, 系统]
---

## KDE 系统设置

### 美化开机密码界面

在“颜色和主题-登录屏幕 (SDDM)”中选择或者下载自己喜欢的 SDDM 主题。OpenDesktop 服务较慢，下载时可能会卡住，你也可以通过其他方式下载主题。

### 更换图标

> 可以在 [icon-theme](https://github.com/topics/icon-theme) 话题、[#icon #theme](https://github.com/search?q=%23icon+%23theme) 搜索结果或 [Pling](https://www.pling.com/browse?cat=386) 上浏览图标。

- 推荐使用 [Papirus](https://github.com/PapirusDevelopmentTeam/papirus-icon-theme) 图标主题
  :copy{code="sudo pacman -S papirus-icon-theme"}

在“颜色和主题-图标”中可以启用下载的图标。

### 更换鼠标指针样式

> 可以在 [cursor-theme](https://github.com/topics/cursor-theme) 话题、[#cursor #theme](https://github.com/search?q=%23cursor+%23theme) 搜索结果或 [Pling](https://www.pling.com/browse?cat=107) 上浏览鼠标指针样式。

- 推荐使用 [Bibata](https://github.com/ful1e5/Bibata_Cursor) 鼠标指针样式
  :copy{code="yay -S bibata-cursor-theme-bin"}

在“颜色和主题-光标”中选择下载的鼠标指针样式。

### 字体配置

在“文字和字体-字体”中点击“调整所有字体”，在弹出的窗口中勾选“字体”，选择字体列表最上方的“无衬线/Sans Serif”，点击“确定”，然后将“等宽”设置为“等宽/Monospace”。

随后将 `~/.config/fontconfig/fonts.conf` 文件设置为如下内容，也可以根据自己的喜好调整 sans-serif 和 monospace 的 fallback 列表。

```xml [fonts.conf]
<?xml version='1.0'?>
<!DOCTYPE fontconfig SYSTEM 'urn:fontconfig:fonts.dtd'>
<fontconfig>
  <alias>
    <family>sans-serif</family>
    <prefer>
      <!-- 如果中文显示不正常，就取消下面的注释 -->
      <!-- <family>WenQuanYi Micro Hei</family> -->
      <family>Sarasa UI SC</family>
      <family>Sarasa Gothic SC</family>
    </prefer>
  </alias>
  <alias>
    <family>serif</family>
    <prefer>
      <family>Source Han Serif CN</family>
      <family>Noto Serif</family>
    </prefer>
  </alias>
  <alias>
    <family>monospace</family>
    <prefer>
      <!-- 如果中文显示不正常，就取消下面的注释 -->
      <!-- <family>WenQuanYi Micro Hei Mono</family> -->
      <family>Sarasa Mono SC</family>
      <family>Fira Code</family>
      <family>JetBrains Mono</family>
    </prefer>
  </alias>
  <match target="font">
    <test name="slant">
      <const>roman</const>
    </test>
    <test compare="not_eq" name="slant" target="pattern">
      <const>roman</const>
    </test>
    <edit mode="assign" name="matrix">
      <times>
        <name>matrix</name>
        <matrix>
          <double>1</double>
          <double>0.2</double>
          <double>0</double>
          <double>1</double>
        </matrix>
      </times>
    </edit>
    <edit mode="assign" name="slant">
      <const>oblique</const>
    </edit>
    <edit mode="assign" name="embeddedbitmap">
      <bool>false</bool>
    </edit>
  </match>
  <match target="font">
    <test compare="less_eq" name="weight">
      <const>medium</const>
    </test>
    <test compare="more_eq" name="weight" target="pattern">
      <const>bold</const>
    </test>
    <edit mode="assign" name="embolden">
      <bool>true</bool>
    </edit>
    <edit mode="assign" name="weight">
      <const>bold</const>
    </edit>
  </match>
</fontconfig>
```

### 开机密码时启用小键盘数字

在“键盘”中将“NumLock 在 Plasma 启动时的状态”设置为“打开”，点击“应用”。

如果之前设置过显示器缩放、字体配置文件最好，这步可以一次性应用这些设置。在“颜色和主题-登录屏幕 (SDDM)”中“应用Plasma设置”。

### 开机时不恢复程序

在“系统”分类下的“会话-桌面会话”中，将“会话恢复”一节的“登录时自动启动应用程序”改为“启动为空会话”。

### 调整输入法候选框

在“输入法”中点击“配置附加组件-经典用户界面”右侧的选项图标，将“字体”设置中的“Family”设置为“Sans Serif”，“Size”设置为“14”，然后将“主题”和“深色主题”设置为“KDE Plasma (实验性)”，点击“应用”。

### 使用类似 Windows 的触摸板操作方式

在“鼠标和触摸板-触摸板”中启用“轻触点击”，勾选“反向滚动(自然滚动)”，点击“应用”。

### 更改休眠策略

在“省电功能”（左侧导航栏底部）中设置接通交流电时不休眠，可以防止“睡不醒”“睡醒花屏”等问题。

如果遇到了唤醒时花屏的问题，请尝试：

- 按 `Ctrl+Alt+F3` 切换到 TTY 界面，这样能停用显示驱动
- 按 `Ctrl+Alt+F1` 切换回桌面
  - 如果切换后不是预期界面，请按 `Ctrl+Alt+F2`
- 如果还是有问题，可以多切几次，不行再强制重启
