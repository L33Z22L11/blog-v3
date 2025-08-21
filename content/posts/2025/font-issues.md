---
title: 修改博客，字体裁剪
description: 字体子集化处理，节省不必要的加载时间，提升访问体验，十分甚至九分的有效。
date: 2025-02-06 22:13:42
updated: 2025-07-23 19:04:02
image: https://r2.mugzx.top/2025/02/06.avif
categories: [分享]
tags: [字体, 博客]
recommend: true
---

## 注意实际体验

### 好看是好看

以前在用 WordPress 的Argon主题时，我经常会去 Echo 大佬的博客里看他的美化教程。当时也是刚接触博客圈子不久，只想着怎么让博客更好看。一直在那改样式、改背景、改字体。

### 加载却很慢

:zhilu-header

在我修改现在的博客主题时，发现博客页眉处景深动画标题使用的 :tip[`阿里妈妈方圆体`]{tip="AlimamaFangYuanTi.woff2"} 字体文件拖慢了博客整体的加载速度，导致加载变慢。身为站长的我当然不能忍，很快啊，我就立马打开 DeepSeek 开始求助了起来:

::chat

{.Mugzx}

我想要在一个已有的字体文件的基础上保留里面我想要的字体（地球驿站）

{:(以下是DeepSeek的生成了一大段话之后的总结)}

{DeepSeek}

- **推荐工具**：优先使用 :tip[`fonttools`]{tip="使用Python语言通过命令行工具来进行字体子集化"} 命令行工具，快速精准生成子集字体。
- **手动备用**：少量字符或图形界面操作可选 :tip[FontCreator]{tip="字体编辑软件，要手动选择需要保留的字形"}。
- **最终验证**：务必测试安装后的字体，确保无乱码或缺失。

::

- `fonttools` 需要安装 `python` 环境，我觉得有点麻烦，直到最后也没用上💦。

- FontCreator 只能手动的来一个一个删来进行字体子集化处理。

::link-banner
---
banner: https://xlenco-img.s3.bitiful.net/i/2024/10/e308bb926c6e3323783e6c536edc136f.webp
title: 前端字体压缩方案 | 希乐博客
link: https://blog.xlenco.top/2024/font-compression-scheme
---
::

我参考了希乐的这篇文章提出的字体压缩方案，可以保留字体中需要的字符，压缩字体文件大小。符合我的需求，但是只能保留粗体样式，这样一来驿站的字体动画就看不出来效果了。

## 处理字体大小

#### 网站

我通过搜索引擎找到了这个字体子集化网站：[在线字体裁剪](https://font-subset.disidu.com)。不过用这个网站裁剪的字体文件还是有些许问题的，通过 FontCreator 打开之后可以发现里面保留了 AB 字形。

#### 命令行

纸鹿大佬也提供了[命令行生成子集](https://blog.zhilu.site/previews/example#zhiluheader)的方案，即借助前面所说的 `fonttools` 命令行工具生成。

```sh
# iconfont 网页版生成的字体子集在 Chrome 124 的版本无法解析，需要借助 fonttools 工具手动生成子集
pip install fonttools brotli
pyftsubset ./AlimamaFangYuanTi.ttf --text=Header文本 --flavor=woff2
```
