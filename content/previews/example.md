---
title: 组件样式示例
date: 2024-09-21 23:18:18
hideInfo: true
---

## Markdown 内容组件

Nuxt Content 使用 Markdown 语法和约定来提供丰富的文本编辑体验。它使用自定的 MDC 语法（[文档](https://content.nuxt.com/usage/markdown)），可以让你在 Markdown 中使用 Vue 组件，并支持多种 remark 扩展。

## 内容组件样式示例

我编写了一些可以在 Markdown 文本中调用的组件，以下是一些示例。

### Markdown 原生标签

#### 链接 `ProseA`

[这是内部链接](#链接-prosea)。[站外链接](https://zhilu.cyou) 默认在新标签页打开，并在鼠标悬浮时展示域名。

还会根据域名展示图标，例如 [微软文档](https://learn.microsoft.com/zh-cn/)、[GitHub](https://github.com/)、[Bilibili](https://www.bilibili.com/)、[QQ 官网](https://im.qq.com/)、[微信公众号](https://mp.weixin.qq.com/) 等。

::alert{title="自定义图标"}
你可以将 `icon` 属性指定为 Iconify 图标名，例如 :a[a]{href="#链接-prosea" icon="ph:swatches-duotone"}。
::

##### 为更多站点匹配图标

你可以在 `app/utils/icon.ts` 分别为主域名或专门域名（优先级高）添加匹配规则来为更多站点匹配图标。

#### 代码 `ProseInlineCode`

`行内代码` 和 [在超链接中的 `行内代码`](#代码-proseinlinecode)。

#### 代码块 `ProsePre`

```
only text
```

``` [filename]
without language
```

```yaml
language: yaml # without filename
```

```yaml [code block with a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog filename]
feature: |
  如果一行过于loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog，溢出滚动时有羽化边缘。
```

```md [CHANGELOG.md]
# 更新日志
- 为特殊文件名指定图标
```

```md [更多功能] icon=ph:files-duotone wrap
- 在 Markdown 文件中，可以通过代码块语法的 meta 标记
  - 直接启用自动换行功能，以展示 loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog 文本
  - 自定义代码块图标
```

##### 高亮

代码块通过 Shiki 进行高亮，可在 `blog.config.ts` 中配置语言（Markdown 中出现的所有语言）和代码高亮主题。

##### 为更多语言匹配图标

你可以根据 `app/utils/icon.ts` 语言图标匹配流程为文件后缀、语言简写或别名添加匹配规则来为更多语言匹配图标：

1. 查找 `file2icon` 映射表，将文件名后缀替换为图标名。
2. 若无匹配，查找 `ext2lang` 映射表，将语言简写或别名转换为 Catppuccin 图标库中的语言名。
3. 将 Catppuccin 图标库中的语言名转换为 Iconify 图标名。

#### 表格 `ProseTable`

打算做表头滚动吸附，但还未实现。目前支持表格横向滚动或自动换行的切换。

| 表头滚动吸附 | 滚动时边缘羽化 | 如果标题或内容很 loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog | 这里还有一列，但是是空内容 |
| :----------- | :------------- | :-------------------------------------------------------------------------------- | :------------------------- |
| 未实现       | 已实现         | 可以切换滚动方式                                                                  |

### 自定义组件

#### Alert

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

:alert{icon="ph:files-duotone" color="var(--c-accent)" title="仅标题，并且自定义图标和颜色"}

#### Badge

:badge[普通带链接]{link="#badge"} :badge[纯文本指定圆形]{round} :badge[纯文本指定方形]{square}

可以 :badge[带个图]{img="https://picsum.photos/100/100"} 也可以只有图 :badge{img="https://picsum.photos/100/100" round}，也能指定方形 :badge{img="https://picsum.photos/100/100" square}

外部域名自动获取站点图标 :badge[纸鹿]{link="https://zhilu.cyou"}，
:badge[古怪杂记本]{link="https://gug.thisis.host/" square}，
GitHub链接能自动识别头像 :badge[KazariEX]{link="https://github.com/KazariEX"}，
也可指定方形 :badge[isYangs/GioPic]{square link="https://github.com/isYangs/GioPic"}。

::alert
#title
在其他组件中使用 :badge{img="https://picsum.photos/100/100" text="带链接" link="#badge"}
#default
:badge{img="https://picsum.photos/100/100" text="指定圆形" round} 背景色 [可以 :badge{img="https://picsum.photos/100/100" text="动态变化" square} 使用](#badge)
::

#### :blur[Blur]

#### Copy

> 语言从 `str.ts` 的 `getPromptLanguage` 里推断，使用 [plain-shiki](https://github.com/KazariEX/plain-shiki) 高亮。

:copy{command="sudo rm -rf"}

:copy{prompt command="zhilu://link.without.prompt"}

:copy{prompt="custom prompt" language="js" command="const customLanguage = 'js' // scrollable when it is tooooooooooooooooooooooo long"}

#### Key

:key[Esc]{code="escape"} :key[F2]{code="f2"} :key[Ctrl]{code="control"} :key[Shift]{code="shift"} :key[a]{code="a"} :key[Space]{code=" "} :key[Tab]{code="tab"} :key[Enter]{code="enter"}

:key[Ctrl+Shift+A]{code="a" ctrl shift} :key[Alt]{code="alt"} :key[Alt+Shift]{code="shift" alt} :key[Ctrl+Alt]{code="alt" ctrl}

:key[↑]{code="arrowup"} :key[↑]{code="arrowup"} :key[↓]{code="arrowdown"} :key[↓]{code="arrowdown"} :key[←]{code="arrowleft"} :key[→]{code="arrowright"} :key[←]{code="arrowleft"} :key[→]{code="arrowright"} :key[B]{code="b"} :key[A]{code="a"} :key[B]{code="b"} :key[A]{code="a"}
