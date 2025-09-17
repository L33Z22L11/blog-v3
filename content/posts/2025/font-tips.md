---
title: 前端字体二三事
description: 前端字体排版有许多细节需要注意，文章从我的实际开发经验出发，介绍合成字形、对齐技巧、排版优化，以及自己的一些踩坑心得。
date: 2025-04-16 08:49:50
updated: 2025-09-17 22:42:53
image: https://7.isyangs.cn/24/680072e8c376c-24.webp
categories: [经验分享]
tags: [代码, 前端, 字体]
---

## 这个世界是一个巨大的合成

从 Minecraft 中奇妙的物品合成玩法，到现代化工领域里复杂的物质合成过程，合成深刻地影响着我们体验世界的方式。在前端的数字世界里，浏览器的字体合成 (synthesis) 为缺失的字形提供了必要的补救。然而，就像所有工具都有其局限性，在某些场景下，这种合成效果并不尽如人意。

### 浏览器合成的粗体

中文字体——当你轻易地选择网络字体、艺术字体时，粗体会拉你陷入泥潭深沼。

设想一下：当你想给网站选择一个科技感的标题字体（[钉钉进步体](https://www.iconfont.cn/fonts/detail?cnid=clpB5hhpYWUN)）或是优雅且便于阅读的正文字体（[霞鹜文楷](https://github.com/lxgw/LxgwWenKai)）时，总是不可避免地使用到粗体样式。等等，这些字体有粗体吗？

我对用户界面十分敏感，每当看到黏在一起（也许普通用户无法察觉）的笔画时，我便知道浏览器合成的粗体发力了。

```css
:root {
    font-synthesis: style;
}
```

请务必像这样干掉它！因为我们还有粗心的前端选手，对于使用 Unicode 私有区的图标字体，都错误地应用了粗体样式——你能想象到 CC-BY 的 :icon{name="fa6-brands:creative-commons-by"} 小人图标，在粗体下圆形脑袋被揍成了双圈头吗😨？

### 浏览器合成的斜体

::alert{title="参阅文档"}
- [`font-synthesis` - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-synthesis)
- [`font-style` - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-style)
::

中文语境下，具有良好美学素养的设计师不会轻易调用斜体。因为中文字体一般没有专门为斜体设计的字形，而排版软件只会粗暴地倾斜字形，导致字体不协调。

但在代码语法高亮中，我们还会遇到斜体——英文字体有斜体 (italic) 和倾斜体 (oblique)，但等宽字体呢？

非常遗憾的是，我在开发时注意到了受人喜爱的著名编程字体 [Fira Code](https://github.com/tonsky/FiraCode) 具有不协调的斜体字形，这显然是由浏览器合成的。

即使 Fira Code 具有良好的连字 (ligature) 特性，但不提供斜体字形是难以容忍的（参阅 [Issue #134](https://github.com/tonsky/FiraCode/issues/134)）。我对于 JetBrains Mono 和 Fira Code 多年里的纠结便轻易地到此为止（[commit #0df1410](https://github.com/L33Z22L11/blog-v3/commit/0df1410150db09943dd520c39dfdab065cd7d386)）了。

如果你要干掉合成斜体，可能得设置 `font-synthesis: none` 了，但我没有*对抗合成斜体*的勇气😿。

## 排版优化

### 深色模式下减少字重

在游玩「绝区零」时，我难以辨认游戏内风格字体显示的文本，阅读深色背景下的白色粗体「[印品鸿蒙体](https://www.inpin.cn/inpin/detail_new.html?fontId=inpinHongMengTi-a049701dbe5f451d82e7c5b78a88d6d4)」格外吃力。你一定听过这种说法：黑色是「收缩色」，白色是「扩张色」。因此黑底白字超粗体说是视觉灾难也毫不过分。

在我玩了半年这游戏后，我偶然得知竟然能在「游戏设置」的一个犄角旮旯里调整字体粗细！？Bro，不在默认情况下给出最佳设置，反而让用户手动调整，我真的在视觉上过于敏感吗？！在选择了「全局细体」后，终于能轻松阅读界面文本了。

### 基线、字距和行高

#### 行文中元素的垂直居中

也许你听说过所谓「元素垂直居中的 N 种方式」，但应该根据具体情况选择更合适的方式。比如这里有几种通过「不居中」实现的「居中」：

如果你有一个高度略大的图标混合在行文中，比如 :icon{name="ri:github-fill"}，它想要在视觉上垂直居中，可以通过 `vertical-align: sub` 把图标的基线对齐到父元素的下标基线；如果你有一个更大的图标，可以通过 `vertical-align: text-bottom` 把图标的基线对齐到父元素的字体底部。

如果有一个高度略大的 flexbox 混合在行文中，比如 :badge[纸鹿摸鱼处]{link="https://blog.zhilu.site/"}，flexbox 的底部会对齐到行文的基线，它内部的文本就偏高了。何解，是使用 `vertical-align: text-bottom`，然后当一个调参大侠吗？其实 flexbox 内的文本基线应该对齐到行文的基线，然后单独调整图片的对齐方式即可。

```css
.badge {
    display: inline-flex;
    align-items: baseline;
    height: 1.6em;
    line-height: 1.6;
}

.badge-icon {
    /* `center` 为的不是居中而是拉齐😈 */
    align-self: center;
    height: 100%;
}
```

哦对，如果用思源黑体 (Noto Sans SC)，你可能会发现它难以垂直居中，下文我会具体指出。

#### 宽敞一些

微信公众号的推文应用了以下规则：

```css wrap
body {
    font-family: PingFang SC, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Arial, sans-serif;
    letter-spacing: 0.034em;
    line-height: 1.6;
    word-wrap: break-word;
    text-align: justify;
    hyphens: auto;
    text-underline-position: under;
    text-decoration-skip-ink: none;
    text-underline-offset: 0.1em;
    text-size-adjust: 100%;
}
```

在这个小标题下，我更想强调合理使用 `letter-spacing` 和 `line-height`，可以让排版变得宽松，避免拥挤。留白也是一种美。

#### 不止为了宽敞

设置行高除了能让内容变得不拥挤，还能帮助你保持元素高度、垂直居中的一致性。

默认情况是 `line-height: normal`，它使用字体预设的行高。只出现中文或英文的元素就会由此产生不同的高度。另外，一些字体在不设置行高时，文字在字体框不能垂直居中（可选中后观测），而这种情况是无论外层设置多少种“居中”都无法解决的。

```css
:root {
    /* 解决文本垂直居中问题😎 */
    line-height: 1.4;
}

.foo {
    /* 输入即可召唤文本垂直居中问题 + 中英文高度不一致 */
    line-height: normal;
}
```

还有些字体就更拉了，比如“抖音美好体”，设置了行高也无法垂直居中，前端也很难调，我的建议是别用或切成图再用。CSS Houdini 的 Font Metrics API 草案、实现、推广后也许可以精调，但我觉得那是十年后的事情。

### 必要时打断

```css
:root {
    word-wrap: break-word;
    hyphens: auto;
}
```

你可能注意到刚刚微信公众号的 CSS 考虑到了这些。如果不这样写，长单词会直接撑开元素或者整个网页。那么微信公众号的 CSS 赢了吗？赢了一部分，比如下文还会继续提到 `text-size-adjust: 100%` 的妙用，但 `hyphens: auto` 在中文语言下没有发挥作用，只有网页设置 `<html lang="en">`{lang="html"} 等西文时才会生效；另外，字体选择似乎也能优化？

### 平衡换行与两端对齐

你也许会遇到这种问题：居中对齐的文本万一遇到了换行，且只将一两个字符换到下一行时，会显得很突兀。

```css
.text-center {
    text-align: center;
    text-wrap: balance;
}
```

这样做便可以使换行的字符尽量均匀分布在几行之间，避免突兀的换行。

如果文本更长些或者不居中呢？左对齐时平整的段落右侧会出现参差的负形，这时就可以使用两端对齐：

```css
p {
    text-align: justify;
}
```

1. Word 等排版软件默认使用的是左对齐吗？不，是两端对齐！
2. 两端对齐会把最后一行文本分散到一整行吗？不，分散对齐才会这样！

## 字体选择

### 正文不使用艺术字体

正文应当易于辨识。前几年 oooooohmygosh 设计的得意黑大火，我便观测到一些滥用现象。还有东方大楷、书法体等，这些艺术字体用在正文中容易造成视觉疲劳，严重影响阅读效率。

可以在标题上使用艺术字体，正文使用平凡的字体会更好些。

### 思源黑体有几种

相信各位听过思源黑体的鼎鼎大名，但它到底有几种，都能用在前端吗？

首先，便是提供厂商之分：Adobe 家给出的是 Source Han Sans，Google 家给出的是 Noto Sans。它的基线偏低，CJK 字符会在字体框的下部，因此它很难垂直居中。

其次，便是不同的语言和字形变体：Google Fonts 里常用 `Noto Sans SC`，Adobe Fonts 里有 SC（语言特定）和 CN（地区子集）版本，具体区别可以查阅 [思源黑体版本指南](https://zhuanlan.zhihu.com/p/526734630)。

不管使用何种字体的何种版本，都应**在 HTML 标签中注明 lang attribute** `<html lang="zh-CN">`{lang="html"}（`zh-Hans` 也可用，但不推荐)，否则 OpenType 字体的 locl 特性会自动选择用户语言对应的字形。许多中文网站都没有做好这一点，比如 DeepSeek 甚至标注了 `<html lang="en">`{lang="html"}。

也许是我对于字形过于敏感了？我向不少使用 Linux 的朋友指出「你浏览器里的字并非简体中文字形」时（要配置 `fontconfig` 呀），他们常常会愣一下，然后才可能注意到字形的细微差异。

### `system-ui` 与具体字体之争

当我们理解字体家族的 fallback 之后，我们可能写出这样的代码：

```css wrap
[data-domain="zhihu.com"] {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", "Source Han Sans SC", "Noto Sans CJK SC", "WenQuanYi Micro Hei", sans-serif;
}

[data-domain="nowcoder.com"] {
    font-family: PingFang SC, Source Han Sans CN, Microsoft YaHei, system, -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Segoe UI, wenquanyi micro hei, Hiragino Sans GB, Hiragino Sans GB W3, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, sans-serif;
}
```

打住，打住。`font-family: system-ui, sans-serif` 也许就够了。

假设你是一名设计师或大厂的前端开发人员（一般使用 macOS 了），你观察到 `PingFang SC`（苹方）字体下的界面符合预期。你又在 Windows 下做了测试（大概你也主动装了苹方字体）。但是纸鹿来了，他会告诉你亿些问题：

1. `苹果字体 !== PingFang SC`：苹果的英文字体是 `San Francisco`，中文字体才是 `PingFang SC`。如果直接使用 `PingFang SC` 作为中英文字体，你会**缺点「果味」**。微信公众号的网页便是如此。
2. UI 字体有特殊优化：Windows 上说不定是 `Segoe UI` 或者 `Microsoft YaHei UI` 呢？
3. 你的前端 CSS 习惯有点好，但前端 CSS 习惯好又不太可能：你也许考虑到了某些东亚语言的注音字符可以无限叠加，斜向上生长而「戳」坏你的界面布局；亦或是想要实现单行文本溢出隐藏，于是残忍地为某些元素设置了 `line-height: 1` 和 `overflow: hidden`。那么代价是什么呢？下划线不见了（也许苹方字体的还在），g/j/p/q 字母的小短腿也不见了。 :blur[你可以打开牛客帖子评论区，看看盖楼回复的用户名变成了什么样。]**字体的 fallback 机制定向地向设计师蒙蔽了单倍行高的潜在风险。**

::link-banner
---
banner: https://static.hsu.cy/blog/2024/5e81e82408924e7598460af3934e43cd.png
title: 当你以为自己用的是苹果系统字体
description: 对于苹果系统字体，用得上的时候就不要乱用，用不上的时候也不要硬用。遵守规范，思维放开，才是正道。
link: https://hsu.cy/2024/04/nopingfang/
---
::

## 字体进阶

### 自动空格

中英文间到底要不要加空格？要不要手动加空格？

我的见解是，中英文之间应当有适当的空白，但空白最好**交由排版引擎实现**而非手动添加。比如 Word，比如微信聊天界面。

Chrome 120 实现了 [CSS 文本模块级别 4 中的脚本间距](https://developer.chrome.google.cn/blog/css-i18n-features?hl=zh-cn#inter-script_spacing_text-autospace)，~~启用 `chrome://flags/#enable-experimental-web-platform-features` 便可在不同脚本（中英文）间自动添加空白~~。Chrome 140 已经支持 `text-autospace: normal` 特性，在 CSS 中设置即可使用：

```css
:root {
    text-autospace: normal;
}
```

但用户代理（浏览器）样式表中似乎缺少了这个：

```css
code, pre {
    text-autospace: no-autospace;
}
```

~~Look into my eyes，回答我，Chrome！！~~现在需要用户手动处理，因为加空格不是默认行为了。

### 对抗文本溢出算法

> 因为缩放适配小屏幕而导致文字会变得很小，许多手机浏览器会使用文本溢出算法放大文本，改善可读性。当一个包含文本的元素使用了 100% 的屏幕宽度，该算法会增加文本大小，但是不会修改布局。text-size-adjust 这个属性允许开发者去除或者修改浏览器的这种行为，比如，当网页已经适配了小屏幕之后，就不需要这么做了。
>
> —— [`text-size-adjust` - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-size-adjust)

我的网站自豪地认为响应式布局良好，但移动端浏览器依然会放大文本（平板读博客时字体巨大），甚至会导致预期外的换行（未限制 `width` 的按钮中的最后一个字换到下一行），当时研究出了 `white-space: no-wrap` 能避免，后来才发现是此实验特性在「搞鬼」。上篇文章也提到了类似哲学——

::quote
#icon
😨
#default
一些贴心的自适应设计，在一些情况下竟然变成了心智负担！
::

### 过度优化可能弄巧成拙

> `font-smooth` CSS 属性控制字体渲染时应用的抗锯齿效果。
>
> —— [`font-smooth` - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-smooth)

听起来很美好？但是，MDN Web Docs 也告诉你[不要干涉字体平滑](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-smooth#%E5%8F%82%E8%A7%81)。

### 可变字体的轮廓

你也许了解文字描边，低版本是用多个阴影叠加出来的，高版本可以用 `-webkit-text-stroke` 实现。但它和可变字体，会碰撞出神奇的火花，比如字体连接处的轮廓——

::div
---
style:
    - font-size: 3em
    - line-height: 1
    - color: transparent
    - -webkit-text-stroke: 1px var(--c-text)
---
中文1234
::

字体拐角处独特的轮廓是「[开放角](https://mp.weixin.qq.com/s/bYh3ai4SIYbsLgPzTq9wbA)」，用于在字体参数变化时实现更好的视觉连续性。但这种特性会污染简洁的轮廓，因此需要字体轮廓时不建议使用可变字体，尤其注意一些安卓手机的默认字体可能就是 VF。

### 字体高级特性

你可能还想问 !== 如何显示为 `!==`、<= 如何显示为 `<=`，这是连字 (ligature) 特性，Iosevka、Fira Code、JetBrains Mono 等编程字体都支持，VS Code 手动启用 `"editor.fontLigatures": true` 后即可看到效果。

再比如，我博客左上角鼠标放在 Logo 上时，字体粗细和方圆变化动画如何实现？我使用了阿里妈妈方圆体这款可变字体 (VF, Variable Font)，它除了支持 `wght` (粗细) 轴上的操作外，还支持 `BEVL` (圆角) 轴上的调节。

```css wrap
.header-title {
    font-family: AlimamaFangYuanTi;
    font-size: 1.5em;
    font-synthesis: none;
    font-variation-settings: "wght" 600, "BEVL" 100;

    > .split-char {
        animation: 3.14s infinite alternate vf-weight, 2.72s infinite alternate vf-bevel;
        animation-delay: var(--delay);
        animation-play-state: paused;
    }
}

@keyframes vf-weight {
    0% { font-weight: 600; }
    38.2% { font-weight: 300; }
    100% { font-weight: 900; }
}

@keyframes vf-bevel {
    from { font-variation-settings: "BEVL" 100; }
    to { font-variation-settings: "BEVL" 1; }
}

.zhilu-header:hover > .split-char {
    animation-play-state: running;
}
```

你也看到了，`wght` 轴参数可以直接通过 `font-weight` 设置。再比如 `font-variant-numeric: tabular-nums` / `font-feature-settings: "tnum"` 可以实现等宽数字，在表格、金额场景下还是很有用的，但字体不一定支持了。

::alert{title="参阅文档"}
- [可变字体指南 - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_fonts/Variable_fonts_guide)
- [font-variation-settings - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variation-settings)
- [font-variant - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-variant)
- [font-feature-settings - CSS | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/font-feature-settings)
::

### 网络字体

中文字符众多，网络字体的传输便会到达 MB 级别。所以有多种方式优化：

- 字体子集化：只加载网页用到的字符。或者极少字符直接使用图片或 SVG。
- 字体压缩：使用 woff2 等先进格式。
- 字体分包：将字体按 Unicode 码点范围拆分成多个文件，按需加载。

::alert{title="网络字体渠道介绍"}
- [Google Fonts](https://fonts.google.com/)
- [免费引入商用黑体字体系列整理及 CSS 字体引入亲妈式教程（20240915更新） – 风记星辰](https://www.thyuu.com/62610/)
- [中文网字计划](https://chinese-font.netlify.app/zh-cn/)
- [释放字体自由 - ZeoSeven Fonts](https://fonts.zeoseven.com/)
::

当然，考虑到 [Windows、Edge 已经引入 Noto Sans](https://zhuanlan.zhihu.com/p/1888247674832139754)，我们也可以帮用户、CDN减负，有本地字体时不加载网络资源：

```css
:root {
    /* Noto Sans SC 通过 CDN 提供 @font-face，无法更名或插入本地源 */
    font-family: "Inter", "Noto Sans SC-Local", "Noto Sans SC", system-ui, sans-serif;
}

@font-face {
	font-family: "Noto Sans SC-Local";
    /* 本地字体文件名 */
	src: local("Noto Sans SC");
}
```

讲了这么多，大家应该收获颇丰。不过鉴于 Noto Sans SC 的西文字形实在太丑，也为避免麻烦的苹果字体调用，还是引一个 `Inter` 字体吧。

```html wrap
<!-- 使用 .cn 域名增强可访问性 -->
<link rel="preconnect" href="https://fonts.gstatic.cn" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.cn/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap">
```

::quote
#icon
😄
#default
这当然是为了一致性，绝不是我想偷懒。
::
