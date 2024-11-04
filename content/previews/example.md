---
title: 组件样式示例
date: 2024-09-21 23:18:18
hideInfo: true

icon: https://www.zhilu.cyou/api/icon.png
---

## a (`ProseA`)

[内部链接](#a-prosea)，另外，[站外链接](https://zhilu.cyou) 默认在新标签页打开，并展示域名。

还会根据域名展示图标，例如 [微软文档](https://learn.microsoft.com/zh-cn/)、[GitHub](https://github.com/)、[Bilibili](https://www.bilibili.com/)、[QQ 官网](https://im.qq.com/)、[微信公众号](https://mp.weixin.qq.com/) 等，有必要时再添加。

## Alert

::alert
#title
标题插槽的 [超链接](#alert) **粗体** `Inline code`
#default
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

::alert{type="question"}
#title
标题插槽的 [超链接](#alert) **粗体** `Inline code`
#default
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

::alert{type="info"}
#title
标题插槽的 [超链接](#alert) **粗体** `Inline code`
#default
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

::alert{type="warning"}
#title
标题插槽的 [超链接](#alert) **粗体** `Inline code`
#default
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

::alert{type="error"}
#title
标题插槽的 [超链接](#alert) **粗体** `Inline code`
#default
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

## Badge

纯文本 :badge[普通]{link="#badge"} :badge[指定圆形]{round} :badge[指定方形]{square}

GitHub头像自动识别 :badge[KazariEX]{round link="https://github.com/KazariEX"}
可指定方形 :badge[isYangs/GioPic]{square link="https://github.com/isYangs/GioPic"}

带链接 :badge{img="https://picsum.photos/100/100" link="#badge"}
指定圆形 :badge{img="https://picsum.photos/100/100" round}
指定方形 :badge{img="https://picsum.photos/100/100" square}

<!-- [在 :badge[超链接] 里也会变](#badge) -->

::alert
#title
在其他组件中使用 :badge{img="https://picsum.photos/100/100" text="带链接" link="#badge"}
#default
:badge{img="https://picsum.photos/100/100" text="指定圆形" round} 背景色 [可以 :badge{img="https://picsum.photos/100/100" text="动态变化" square} 使用](#badge)
::

## :blur[Blur]

## Code (`ProseInlineCode`)

`inline code` and [a hyperlink with `inline code`](#code-proseinlinecode)

## Codeblock (`ProsePre`)

```
only text
```

``` [filename]
without language
```

```yaml
language: yaml
```

```yaml [filename]
language: yaml # with filename
```

## Copy

> 语言从 `str.ts` 的 `getPromptLanguage` 里推断，使用 [plain-shiki](https://github.com/KazariEX/plain-shiki) 高亮。

:copy{command="sudo rm -rf"}

:copy{prompt command="zhilu://link.without.prompt"}

:copy{prompt="custom prompt" language="js" command="const customLanguage = 'js' // scrollable when it is tooooooooooooooooooooooo long"}

## Key

:key[Esc]{code="escape"} :key[F2]{code="f2"} :key[Ctrl]{code="control"} :key[Shift]{code="shift"} :key[a]{code="a"} :key[Space]{code=" "} :key[Tab]{code="tab"} :key[Enter]{code="enter"}

:key[Ctrl+Shift+A]{code="a" ctrl shift} :key[Alt]{code="alt"} :key[Alt+Shift]{code="shift" alt} :key[Ctrl+Alt]{code="alt" ctrl}

:key[↑]{code="arrowup"} :key[↑]{code="arrowup"} :key[↓]{code="arrowdown"} :key[↓]{code="arrowdown"} :key[←]{code="arrowleft"} :key[→]{code="arrowright"} :key[←]{code="arrowleft"} :key[→]{code="arrowright"} :key[B]{code="b"} :key[A]{code="a"} :key[B]{code="b"} :key[A]{code="a"}
