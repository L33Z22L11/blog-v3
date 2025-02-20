---
title: 组件样式示例
date: 2024-09-21 23:18:18
updated: 2025-02-12 11:18:33

# type: story
---

## Markdown 内容组件

Nuxt Content 使用 Markdown 语法和约定来提供丰富的文本编辑体验。它使用自定的 MDC 语法，可以让你在 Markdown 中使用 Vue 组件，并支持多种 remark 扩展。

:::render-with-raw
```mdc wrap
::link-card
---
title: MDC 基本语法（必读）
icon: https://v2.content.nuxt.com/favicon.ico
link: https://v2.content.nuxt.com/usage/markdown
class: gradient-card active
---
::

~~也许要看到 [本页源码](https://github.com/L33Z22L11/blog-v3/blob/main/content/previews/example.md) 才能领会到这种语法的特性~~，现在可以在页面内看源代码了，[就像**这样**——]{.example-info #just-like-this style="color: #00bb66"}，或是主题介绍页面的组件入口卡片那样……确定不对照源码阅读吗？
```
:::

## 内容组件样式示例

我编写了一些可以在 Markdown 文件中调用的组件，以下是一些示例。

### 通过 CSS 类名控制的样式

::render-with-raw
```mdc
- 各级标题
  - 在 Front matter 中设置 `type: story`{lang="yaml"} 可以换用不同样式。
  - 跟随 URL Hash（网址锚点）的高亮。
- > 引用。
- 无序和有序列表。
- **粗体**、~~删除线~~。
- 分割线。
---
- 带有 `icon` 类名的图片，如 ![图片](https://picsum.photos/100/100){.icon}。
- [只在 `type: story`{lang="yaml"} 时🀄]{.title-like}
- [故事感。]{.text-story}
- [阴 影 回 声]{.text-repeat}
- 滚动，然后悄悄[变大变高]{.text-zoom}，惊艳所有人。
```
::

### Markdown 原生组件

可以通过 Mardown 原生语法、HTML 语法和 MDC 语法使用的组件。

#### 链接 `ProseA`

[这是内部链接](#链接-prosea)。[站外链接](https://zhilu.cyou) 默认在新标签页打开，并在鼠标悬浮时展示域名。

还会根据域名展示图标，例如 [微软文档](https://learn.microsoft.com/zh-cn/)、[GitHub](https://github.com/)、[Bilibili](https://www.bilibili.com/)、[QQ 官网](https://im.qq.com/)、[微信公众号](https://mp.weixin.qq.com/) 等。

:::alert{title="自定义图标"}
::render-with-raw
```mdc wrap
你可以将 `icon` 属性指定 Iconify 图标名，例如 [a](#链接-prosea){icon="ph:swatches-duotone"}。图标可在 [Iconify](https://icon-sets.iconify.design/) 或 [Yesicon](https://yesicon.app/) 搜索。
```
::
:::

##### 为更多站点匹配图标

你可以在 `app/utils/icon.ts` 分别为主域名或专门域名（优先级高）添加匹配规则来为更多站点匹配图标。

#### 代码 `ProseInlineCode`

`行内代码` 和 [在超链接中的 `行内代码`](#代码-proseinlinecode)。

还可以通过在反引号后加 `{lang="js"}` 等语言实现高亮，例如 `const a = 1`{lang="js"} 。

#### 代码块 `ProsePre`

```
纯文本代码块
```

``` [文件名]
带文件夹名、未指定语言的代码块
```

```yaml
语言: yaml # 指定语言但无文件名
```

```yaml [特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别长的文件名]
羽化边缘: 如果一行特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别长，溢出滚动时有羽化边缘。
```

```md [CHANGELOG.md]
# 更新日志
- 特殊文件名自动匹配图标
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
- 超出 `appConfig.content.codeblockCollapsibleRows` 行的代码自动折叠
```

````md [更多功能] icon=ph:files-duotone wrap expand
- 在 Markdown 文件中，可以通过代码块语法的 meta 标记
  - `wrap` 直接启用自动换行功能，以展示特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别长的文本而不换行
  - `icon=ph:files-duotone` 自定义代码块图标
  - `expand` 禁用自动折叠功能

# 代码块语法

```语言简写 [文件名] icon=图标 wrap expand
- 上面这几项都是可选的。
- 如果有语言简写，必须位于反引号后的第一项。
- 方括号包裹的是文件名。
- icon=图标、wrap、expand 都是 meta 标记。
- 如果要在代码块中嵌套代码块语法，外层可以用四个反引号包裹。
```
````

##### 高亮

代码块通过 Shiki 进行高亮，可在 `blog.config.ts` 中配置语言（Markdown 中出现的所有语言）和代码高亮主题。

##### 为更多语言匹配图标

你可以根据 `app/utils/icon.ts` 语言图标匹配流程为文件后缀、语言简写或别名添加匹配规则来为更多语言匹配图标：

1. 查找 `file2icon` 映射表，将文件名后缀替换为图标名。
2. 若无匹配，查找 `ext2lang` 映射表，将语言简写或别名转换为 Catppuccin 图标库中的语言名。
3. 将 Catppuccin 图标库中的语言名转换为 Iconify 图标名。

#### 表格 `ProseTable`

> 支持表格横向滚动或自动换行的切换。

| 表头滚动吸附 | 滚动时边缘羽化 | 如果标题或内容很 loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog | 这里还有一列，但是是空内容 |
| :----------- | :------------- | :-------------------------------------------------------------------------------- | :------------------------- |
| 未实现       | 已实现         | 可以切换滚动方式                                                                  |

### 自定义组件

可以通过 Vue 模板语法、MDC 语法使用的组件。

#### Alert

:::render-with-raw
```mdc
::alert
你好
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

:alert{icon="ph:files-duotone" color="var(--c-accent)" title="仅标题，并且自定义图标和颜色"}
```
:::

#### Badge

:::render-with-raw
```mdc
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
```
:::

#### :blur[Blur]

::::render-with-raw
```mdc
:blur[你知道得太多了。]

::blur
:::quote
也未必。
:::
::
```
::::

#### CardList

> 给列表刷上了自定义样式，待完善。

:::render-with-raw
```mdc
::card-list
- 无序列表项1
- 无序列表项2
  - 无序列表项2-1
  - 无序列表项2-2
::
```
:::

#### Chat

:::render-with-raw
```mdc expand
::chat
{:2024-11-09 23:39:30}

{.}

也许

{.}

我们可以聊聊天

{.纸鹿}

我还可以有名字

{:纸鹿撤回了一条消息}

{用户1}

有趣\
我学到了。
::
```
:::

#### Copy

:::render-with-raw
```mdc
:copy{code="rm -rf # 修改命令后再复制，也可撤销修改"}

:copy{prompt code="不带提示符的命令，可以是 URL、单行代码"}

:copy{prompt="自定义命令提示符、高亮语言" lang="js" code="const customLang = 'js' // 滚动条、边缘羽化会出现，假如它特别特别特别特别特别特别特别特别长"}
```
:::

##### 自动推断语言

语言从 `app/utils/str.ts` 的 `getPromptLanguage` 里根据命令提示符前缀推断，使用 [plain-shiki](https://github.com/KazariEX/plain-shiki) 高亮。和之前的 Markdown 代码块使用相同的高亮语言和高亮主题配置。

#### EmojiClock

> 现在几点了？

::render-with-raw
```mdc
:emoji-clock
```
::

#### FeedCard 和 FeedGroup

> 用于在友链页面展示链接，由于友链页面的 Markdown 部分要可能会显示这个组件，就放在这个目录下大家都能调用了。去友链页面看看吧。

#### Folding

> 折叠组件，支持折叠和展开，可以嵌套使用。

::::render-with-raw
````mdc expand
::folding
#title
可以通过标题插槽传值 [超链接](#folding) **粗体** `Inline code`
#default
默认插槽的 [超链接](#folding) **粗体** `Inline code`

:::folding{open title="折叠还可以嵌套"}
默认展开的折叠。

  ::::alert{type="error"}
  #title
  在嵌套使用的组件内部使用 MDC 的 `#slotname` 插槽语法
  #default
  必须缩进，否则会报错。
:::
::

::folding{open}
```md [folding]
- 默认展开的折叠。
```
::
````
::::

#### Key

> 按下键时会亮，可以通过 `@press` 配置触发事件，鼠标点击也会触发事件，博客全站搜索框的按键提示使用了这个组件。

::render-with-raw
```mdc wrap
:key[Esc]{code="escape"} :key[F2]{code="f2"} :key[Ctrl]{code="control"} :key[Shift]{code="shift"} :key[a]{code="a"} :key[Space]{code=" "} :key[Tab]{code="tab"} :key[Enter]{code="enter"}

:key[Ctrl+Shift+A]{code="a" ctrl shift} :key[Alt]{code="alt"} :key[Alt+Shift]{code="shift" alt} :key[Ctrl+Alt]{code="alt" ctrl}

:key[↑]{code="arrowup"} :key[↑]{code="arrowup"} :key[↓]{code="arrowdown"} :key[↓]{code="arrowdown"} :key[←]{code="arrowleft"} :key[→]{code="arrowright"} :key[←]{code="arrowleft"} :key[→]{code="arrowright"} :key[B]{code="b"} :key[A]{code="a"} :key[B]{code="b"} :key[A]{code="a"}
```
::

#### LinkBanner

:::render-with-raw
```mdc
::link-banner
---
banner: https://picsum.photos/480/240
title: 标题
description: 这是一行描述，如果不提供描述会展示域名
link: "#link-banner"
# mirror: # 是否借助第三方图片加载服务，见源代码
---
::
```
:::

#### LinkCard

:::render-with-raw
```mdc
::link-card
---
icon: https://picsum.photos/100/100
title: 标题
description: 这是一行描述，如果不提供描述会展示域名
link: "#link-card"
# mirror: # 是否借助第三方图片加载服务，见源代码
---
::
```
:::

#### Pic

> 用于展示图片，支持说明文字、点击后打开灯箱缩放。

:::render-with-raw
```mdc
::pic
---
src: https://picsum.photos/480/240
# mirror: # 是否借助第三方图片加载服务，见源代码
caption: 说明文字，还支持通过 width 或 height 属性指定尺寸
# zoom: false # 是否开启灯箱缩放，默认开启
---
::
```
:::

#### Poetry

> 在文章的 type 为 `tech` 或 `story` 时，它有不同的样式。

:::render-with-raw
```mdc
::poetry
---
title: 诗有诗的标题
author: 一名作者
footer: 可选的落款
---
如你所见，
我,
是一首——
*诗*。
::
```
:::

#### Quote

> 在文章的 type 为 `tech` 或 `story` 时，它有不同的样式。

:::render-with-raw
```mdc
:quote[有时候，有些话，有点意思。]

::quote{icon="ph:files-duotone"}
令图标有所指，引用亦有中心。
::

::quote
#icon
ヾ(•ω•`)o
#default
图标插槽也可以是 Emoji 或颜文字，或者英文装饰。
::
```
:::

#### RenderWithRaw

> 这是一个元组件，用于同时渲染 MDC 和原始 MDC 代码，使用时请清楚自己在做什么。

::::render-with-raw
````mdc wrap
:::render-with-raw
```mdc wrap
:tip[Tip我啊，被包了又包]{tip="怎么包，都有面"}
```
:::
````
::::

#### Tab

:::render-with-raw
````mdc wrap expand
::tab{:tabs='["一个简单的", "Tab"]'}
#tab1
```md
# 一个简单的 Tab
```
#tab2
```md
# Tab
```
::

::tab
---
tabs: ["当当当", "高级交互！", "就是藏得有点深"]
center: true
active: 2 # 默认显示第二个选项卡，可选
---
#tab1
这个组件设置了居中（自动调整而不是占满宽度）和默认显示第二个选项卡。
#tab2
```md
是这样。
```
#tab3
你找到我了吗？
::
````
:::

#### Timeline

:::render-with-raw
```mdc expand
::timeline
{前天}

看到了小兔

{昨天}

是小鹿

{今天}

是你。
::

::timeline
{今日无事}

{今日依旧无事}

{然后——}

一件事\
两件事。

*再添一笔*。
::
```
:::

#### Tip

::render-with-raw
```mdc wrap
:tip[我是一条小提示]{tip="提示的内容是提示"}， :tip[我没有图标]{icon tip="或许也可以没有内容"}， :tip[+v 点击就能复制，太方便了！]{copy}
```
::

#### VideoEmbed

> 放点视频给你看。

:::render-with-raw
```mdc
::video-embed
---
type: bilibili
id: BV1Yr421p7rW
---
::
```
:::

#### ZhiluHeader

::render-with-raw
```mdc
:zhilu-header
```
::

鼠标悬浮时的动画 Emoji `📄🦌🙌🐟🏖️` 对应“纸鹿摸鱼处”的汉字，在 `app.config.ts` 中配置，字体由 `阿里妈妈方圆体` 分割而来。

## 组件使用方法

一是看开头提到的 MDC 文档，至关重要。二是看使用组件对应的源代码 (`example.md`)，也很重要。三是看我文章的调用方式，没有就慎用。

### 组件的不完美性

博客开发精力有限，常用的组件会仔细打磨，不常用的组件仅仅满足需求。

所以，少年，选择你的英雄吧！
