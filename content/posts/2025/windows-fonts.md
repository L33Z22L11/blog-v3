---
title: 将微软雅黑替换为新版样式
description: 电脑上的旧微软雅黑在小字体验上并不友好，我参考了b站UP的教程视频，将字体替换。
date: 2025-07-23 00:15:25
updated: 2025-07-23 18:51:08
image: https://r2.mugzx.top/2025/07/23.avif
categories: [分享]
tags: [字体]
recommend: true
references:
  - title: 看小字不割裂的新微软雅黑！手把手无损替换旧微软雅黑！
    link: https://www.bilibili.com/video/BV1YGE1z2ECR
---

字体样式决定文字辨识，好的样式有助于内容的传播。

## 字体渲染

Windows的微软雅黑字体在1080P屏幕下的显示效果有些许不足，比如在部分文字渲染中显示点阵字体，使用小号文字显示不够清晰等问题。

:blur[观察`C:\Windows\Fonts`路径下的系统默认微软雅黑字体，会发现其文件版本为2017年推出的 Windows 10 秋季创意者更新中推出的v6.25版本（细体为v6.23版本），但在其后续的版本中又出现过 :tip[＂新微软雅黑＂]{tip="Noble Scarlet字体，又名微软雅黑v11.3"}。]

在b站搜索发现，将旧微软雅黑替换为v11.3的版本，可以提升一定的体验。

## 替换之前

下载所需的字体文件：[＂新微软雅黑＂ & Microsoft YaHei UI](https://pan.moe/s/p6KVuw)

在C盘下创建存放字体的文件夹，在替换字体之前记得备份一份旧微软雅黑文件，避免造成系统异常。

按住 :key[Shift]{code="shift"} 重启电脑，进入高级启动选项菜单，然后：

::timeline

{依次点击进入：}

1️⃣疑难解答

2️⃣高级选项

3️⃣命令提示符
::

输入：

:copy{prompt="X:\Windows\System32>" lang="bat" code="xcopy C:\wryh C:\Windows\Fonts"}

如果提示找不到文件，就需要通过记事本间接查看实际盘符了。

:copy{prompt="改为实际盘符" code="notepad"}

按照提示完成操作，退出点击继续，重启后即可开始使用新字体啦ヾ(≧∇≦*)ゝ！

::alert{type="error"}
#title
注意！
#default
在每次系统的大型更新后，字体文件将会重置，需要将＂新微软雅黑＂字体重新进行替换。
::
