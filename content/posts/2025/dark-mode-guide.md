---
title: 深色模式开发的最佳实践
description: 实现深色模式，不要只会 `prefers-color-scheme` 了，还有一堆问题等你来修。
date: 2025-04-14 10:07:16
updated: 2025-04-14 11:57:43
categories: [经验分享]
tags: [代码, 问题]
---

## 自动深色模式

### 使用 CSS 媒体查询

相信大家在查阅深色模式实现时，都遇到过这种写法：

```css
@media (prefers-color-scheme: dark) {
  body {
    background: black;
    color: white;
  }
}
```

::alert{title="参阅文档"}
[`prefers-color-scheme` 媒体特性 - CSS：层叠样式表 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@media/prefers-color-scheme)
::

### 渐进增强而非并列查询

有些同学会说，诶，我有个好主意，我了解 `prefers-color-scheme` 的值还有 `light` 和 `no-preference`，我把基础样式并列地写进这三种媒体查询里。

这对吗？Chrome 76 起才支持 `prefers-color-scheme` 媒体特性，放在某些兼容性差的浏览器里，这些规则都不会生效。

::alert{title="参阅 Issue"}
[移动端夸克浏览器适配问题 · Issue #477 · xaoxuu/hexo-theme-stellar](https://github.com/xaoxuu/hexo-theme-stellar/issues/477)
::

所以最好采用「渐进增强」的策略，即先写基础样式，再写深色模式样式，这样可以保证低版本内核的浏览器正常显示。

```css
body {
  background: white;
  color: black;
}

@media (prefers-color-scheme: dark) {
  body {
    background: black;
    color: white;
  }
}
```

### 使用 CSS 变量

又有同学要头疼了，按钮、弱文本也要适应深色模式，那我岂不得维护许多深色模式下的 CSS 声明块？

这个时候，[CSS 变量](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties) 就派上用场了。我们可以维护一个普通模式和深色模式的「调色盘」，其他声明块中需要使用颜色，只需要通过 `var(--my-color-1)` 的形式引用即可。

```css [https://cooo.site/asset/index.css]
:root {
    --bg1: #f7f9ff;
    --bg2: #fff;
    --text1: #334;
    --text2: #556;
    --text3: #aab;
    --line: rgba(127, 127, 191, .2);
    --ac1: #37f;
    --ac2: rgba(0, 127, 255, .5);
    --ac3: hsla(210, 100.00%, 50.00%, 0.20);
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg1: #111;
        --bg2: #222;
        --text1: #eee;
        --text2: #ccc;
        --text3: #777;
        --ac1: #fc2;
        --ac2: rgba(255, 191, 0, .5);
        --ac3: rgba(255, 191, 0, .2);
    }
}
```

另外，要注意各个颜色模式下的对比度，在确保文字清晰的同时，不要使用过高的对比度（纯黑、纯白），让用户的体验更舒适。收起 :tip[「A屏黑」]{tip="OLED 屏幕显示纯黑色几乎不费电，OLED 手机引入市场时不少 APP 做了深色模式纯黑色背景的适配"} 的想法，纯黑色省电的代价是黑暗环境中高对比度对用户视觉的刺激。

## 手动深色模式

又有同学在想了：我们做出的自动深色模式只是设备支持下的自动切换小彩蛋，如何显式展示技术力，比如放个深色模式按钮呢？

假设我们已经通过 `localStorage` 存储了用户主题并在加载时给 `<html>` 添加了 `data-theme` 属性，看起来完美实现了颜色模式切换，其实还会遇到几个降低用户体验的问题。

### 浏览器生成的自动深色模式

你的浅色模式在设备的浅色模式下表现很好，但是当设备在深色模式时，你的浅色模式可能表现得一团糊涂。

::alert{title="参阅文档"}
- [自动深色主题 | Blog | Chrome for Developers](https://developer.chrome.google.cn/blog/auto-dark-theme)
- [`color-scheme` - CSS：层叠样式表 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/color-scheme)
- [CSS 颜色调整规范定义的标准元数据名称 - HTML（超文本标记语言） | MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Reference/Elements/meta/name#%E5%85%B6%E4%BB%96%E8%A7%84%E8%8C%83%E4%B8%AD%E5%AE%9A%E4%B9%89%E7%9A%84%E6%A0%87%E5%87%86%E5%85%83%E6%95%B0%E6%8D%AE%E5%90%8D%E7%A7%B0)
::

怎会如此！Chrome 的贴心设计优化了不支持深色模式的网页显示，但成为了开发者在深色模式下展示浅色网页的心智负担。

我们需要通过 `color-scheme` 告诉浏览器网页支持深色和浅色模式，不要让浏览器扳倒我们自己的适配。两种方法二选一即可：

- 在 HTML 头部通过元数据声明 `<meta name="color-scheme" content="light dark">`{lang="html"}
- 在 CSS 中声明 `:root { color-scheme: light dark; }`{lang="css"}

记得在手动深色模式（类名而非媒体查询的实现）下设置 `:root[data-theme="dark"] { color-scheme: dark; }`{lang="css"}。不然想一想 `color-scheme: light dark` 会怎么表现？滚动条、按钮等元素在 [用户代理样式表](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_cascade/Cascade#css_%E5%A3%B0%E6%98%8E%E7%9A%84%E6%BA%90) 给出的是浅色的样式！这和手动深色模式的预期不一致。

### 页面初载时的闪烁

你的深色模式在设备深色模式下表现很好，但是当设备在浅色模式下，你的深色模式在初载时可能闪白，这对于用户眼睛的伤害是巨大的（点名批评 [GitHub Docs](https://docs.github.com/zh)）。

我曾使用 Pinia 管理用户主题，但 Pinia 的挂载需要时间，产生了页面闪白问题。我留意到一些网站是没有的，比如 VitePress，我研究了其代码实现（[vitepress/src/node/config.ts#L263](https://github.com/vuejs/vitepress/blob/main/src/node/config.ts#L263)）。它在 `<head>`{lang="html"} 中添加了同步的 `<script>`{lang="html"}，通过 IIFE 立即执行函数，在 DOM 构建完成前就完成了主题切换，避免了页面闪白。

```html [https://cooo.site/asset/index.html]
<head>
    <script>
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark')
        }
    </script>
</head>
```

### 一致性和 CSS 代码冗余

代码冗余会轻松地创建不一致，而不一致带来潜在的破环力是惊人的：

```css
:root {
  --c-bg: white;
  --c-text: black;
}

@media (prefers-color-scheme: dark) {
    /* 原本是 :root[data-theme="auto"]
     * 但下一个选择器应该有相同或更高的优先级 */
    :root {
      --c-bg: #111;
      --c-text: #eee;
    }
}

[data-theme="dark"] {
  --c-bg: black;
  --c-text: white;
  color-scheme: dark;
}
```

这样，你的深色模式定义了两次，你需要小心地维护这些代码。也许可以用 `@mixin`{lang="css"} 来减少冗余？但终归不是完美的解决方案。

这时，抛弃掉 `[data-theme="auto"]`{lang="css"} 就显得有用了——通过在 JS 中提前让「自动」的状态「塌缩」为确定的「浅色」或「深色」，这样 CSS 中只需要维护两种模式下选择器对应的样式即可。

不要忘记监听 `prefers-color-scheme` 的变化：

```ts
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e =>
  setTheme(e.matches ? 'dark' : 'light')
)

function setTheme(theme: 'light' | 'dark') {
  localStorage.setItem('theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
  // 如果使用类名实现，则
  // document.body.classList.toggle('dark', theme === 'dark')
}
```

什么，竟然有人操作 `document.getElementByTagName('html')[0].className`{lang="ts"}？回家吧孩子。

::quote
Take care of your user, and code well. ☝️
::
