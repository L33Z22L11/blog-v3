---
title: 组件样式示例
date: 2024-09-21 23:18:18
updated: 2025-02-12 11:18:33

# type: story
---

## 在 Markdown 中使用组件

Nuxt Content 使用 Markdown 语法和约定来提供丰富的文本编辑体验。它使用自定的 MDC 语法，可以让你在 Markdown 中使用 Vue 组件，并支持多种 remark 扩展。

::tab{:tabs='["组件","语法"]'}
#tab1
::link-card
---
title: MDC 基本语法（必读）
icon: https://content.nuxt.com/favicon.ico
link: https://content.nuxt.com/docs/files/markdown#mdc-syntax
class: gradient-card active
---
::

~~也许要看到 [本页源码](https://github.com/L33Z22L11/blog-v3/blob/main/content/previews/example.md) 才能领会到这种语法的特性~~，现在可以在页面内看源代码了，[就像**这样**——]{.example-info #just-like-this style="color: #00bb66"}，或是主题介绍页面的组件入口卡片那样……确定不对照源码阅读吗？

#tab2
```mdc wrap
::link-card
---
title: MDC 基本语法（必读）
icon: https://v2.content.nuxt.com/favicon.ico
link: https://content.nuxt.com/docs/files/markdown#mdc-syntax
class: gradient-card active
---
::

~~也许要看到 [本页源码](https://github.com/L33Z22L11/blog-v3/blob/main/content/previews/example.md) 才能领会到这种语法的特性~~，现在可以在页面内看源代码了，[就像**这样**——]{.example-info #just-like-this style="color: #00bb66"}，或是主题介绍页面的组件入口卡片那样……确定不对照源码阅读吗？
```
::

我编写了一些可以在 Markdown 文件中调用的组件，以下是一些示例。

## 通过 CSS 类名控制样式

::tab{:tabs='["组件","语法"]'}
#tab1
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

#tab2
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

## Markdown 语法组件

可以通过 Markdown 原生语法、HTML 语法和 MDC 语法使用的组件。

### 链接 `ProseA`

[这是内部链接](#链接-prosea)。[站外链接](https://zhilu.site) 默认在新标签页打开，并在鼠标悬浮时展示域名。

还会根据域名展示图标，例如 [微软文档](https://learn.microsoft.com/zh-cn/)、[GitHub](https://github.com/)、[Bilibili](https://www.bilibili.com/)、[QQ 官网](https://im.qq.com/)、[微信公众号](https://mp.weixin.qq.com/) 等。

::alert{title="自定义图标"}
  ::tab{:tabs='["组件","语法"]'}
  #tab1
  你可以将 `icon` 属性指定 Iconify 图标名，例如 [a](#链接-prosea){icon="ph:swatches-duotone"}。图标可在 [Iconify](https://icon-sets.iconify.design/) 或 [Yesicon](https://yesicon.app/) 搜索。

  #tab2
  ```mdc wrap
  你可以将 `icon` 属性指定 Iconify 图标名，例如 [a](#链接-prosea){icon="ph:swatches-duotone"}。图标可在 [Iconify](https://icon-sets.iconify.design/) 或 [Yesicon](https://yesicon.app/) 搜索。
  ```
  ::
::

#### 为更多站点匹配图标

你可以在 `app/utils/icon.ts` 分别为主域名或专门域名（优先级高）添加匹配规则来为更多站点匹配图标。

### 代码 `ProseCode`

`行内代码` 和 [在超链接中的 `行内代码`](#代码-prosecode)。

还可以通过在反引号后加 `{lang="js"}` 等语言实现高亮，例如 `const a = 1`{lang="js"} 。

### 代码块 `ProsePre`

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
- 若行数超出
  `appConfig.component.codeblock.triggerRows`
  （默认32）
  - 则自动折叠到
  `appConfig.component.codeblock.collapsedRows`
  （默认16）
- 如果设置了 expand，则不会自动折叠
- 如果设置了 wrap，则会自动换行
- 如果设置了文件名，则会在代码块标题前展示图标
  - 图标只在有文件名时展示
  - 默认图标是语言图标
  - 特殊文件名也会自动识别出图标
  - 文件名可以是任意字符串，例如 `CHANGELOG.md`、`README.md` 等
  - 文件名也可以是路径，例如 `src/components/ProsePre.vue` 等
  - 还可以通过 `icon=图标` 自定义图标

\
\
\
\
\
\
\
\
\
\
\
\
\
\
\
```

````md [更多功能] icon=ph:files-duotone wrap expand
- 在 Markdown 文件中，可以通过代码块语法的 meta 标记
  - `wrap` 直接启用自动换行功能，以展示特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别特别长的文本而不换行
  - `icon=ph:files-duotone` 自定义代码块图标
  - `expand` 禁用自动折叠功能

# 代码块语法

```语言简写 [文件名] icon=图标 wrap expand
- 上面这几项都是可选的。
- 如果有语言简写，必须位于反引号后的第一项，且需要是小写字母。
  - https://shiki.style/languages
- 方括号包裹的是文件名。
- icon=图标、wrap、expand 都是 meta 标记。
- 如果要在代码块中嵌套代码块语法，外层可以用四个反引号包裹。
```
````

#### 高亮和转换

代码块通过 Shiki 进行高亮，可在 `blog.config.ts` 中配置语言（Markdown 中出现的所有语言）和代码高亮主题。

转换器（如 diff）可通过 https://shiki.style/packages/transformers#transformers 配置，启用的转换器可在 `app/stores/shiki.ts` 查看。

#### 为更多语言匹配图标

你可以根据 `app/utils/icon.ts` 语言图标匹配流程为文件后缀、语言简写或别名添加匹配规则来为更多语言匹配图标：

1. 查找 `file2icon` 映射表，将文件名后缀替换为图标名。
2. 若无匹配，查找 `ext2lang` 映射表，将语言简写或别名转换为 Catppuccin 图标库中的语言名。
3. 将 Catppuccin 图标库中的语言名转换为 Iconify 图标名。

### 表格 `ProseTable`

> 支持表格横向滚动或自动换行的切换。

| 表头滚动吸附 | 滚动时边缘羽化 | 如果标题或内容很 loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooog | 这里还有一列，但是是空内容 |
| ----------- | -------------: | :-------------------------------------------------------------------------------- | :------------------------- |
| 已实现       | 已实现         | 可以切换滚动方式                                                                  |

### 数学公式

> 由 $\KaTeX$ 驱动，支持 $\TeX$ 和部分 $\LaTeX$ 语法。如果 Markdown 正文需要直接使用 \$ 符号，需要使用 `\$` 转义。
>
> [支持语法列表](https://katex.org/docs/supported)（[中文版](https://www.luogu.com.cn/paste/hs3jg81l)）

::tab{:tabs='["组件","语法"]'}
#tab1
$\text{课程绩点} = \frac{\text{课程分数(成绩)}}{10} - 5$

$$ \text{学分绩点} = \text{课程学分} \times \text{课程绩点} $$

```math
\text{平均绩点(GPA)} =\frac {\text{学分绩点之和}}{\text{课程学分之和}} = \frac{\sum (\text{课程学分} \times \text{课程mag绩点})}{\sum \text{课程mag学分}}
```

#tab2
````mdc wrap
$\text{课程绩点} = \frac{\text{课程分数(成绩)}}{10} - 5$

$$ \text{学分绩点} = \text{课程学分} \times \text{课程绩点} $$

```math
\text{平均绩点(GPA)} =\frac {\text{学分绩点之和}}{\text{课程学分之和}} = \frac{\sum (\text{课程学分} \times \text{课程mag绩点})}{\sum \text{课程mag学分}}
```
````
::

### 乐谱渲染播放

> 必要时可用豆包等 AI 将乐谱识别为 ABC 记法。只在网络状态良好时加载播放能力。
>
> 编辑器、Cheat Sheet 和语法检查：https://editor.drawthedots.com/

::tab{:tabs='["组件","语法"]'}
#tab1
```music-abc
L:1/8
Q:1/4=100 "andante moderato"
M:2/4
K:D
"D" FA A>B | AF DD/E/ |1 "G" FF ED | "A" E2 z2 :|2 "G" FF "A" EE | "D" D2 z2 ||
```

```music-abc
L:1/8
Q:1/4=100
M:2/4
K:D
V:1 clef=treble
V:2 clef=bass
%%MIDI program 32
[V:1] z2 z f/g/ | aa a>b | af dd/e/ | ff ee | d2 z2 || FA A>B | AF DD/E/ |
w: | | | | | 你 爱 我 | 我 爱 你 蜜 雪
[V:2] z4 | D,[F,A,] .A,[F,A,] | .D,[F,A,] .A,[E,A,] | .G,,[G,D,] .A,,[E,A,] | .D,[F,A,] [D,,D,]2 || .D,,[D,F,] .A,,[D,F,] | .D,,[D,F,] .A,,[D,F,] |
[V:1] FF ED | E2 z2 | FA A>B | AF DD/E/ | FF EE | D2 z2 | G2 G2 |
w: 冰 城 甜 蜜 | 蜜 | 你 爱 我 | 我 爱 你 蜜 雪 冰 城 甜 蜜 | 蜜 | 你 爱
[V:2] .G,,[B,G,] .D,[B,G,] | .A,,[A,C] .E,[A,C] | .D,,[D,F,] .A,,[D,F,] | .D,,[D,F,] .A,,[D,F,] | .G,,[G,D,] .A,,[E,A,] | .D,,[A,,D,] .[A,,D,]2 | .G,,[B,G,] .D,[B,G,] |
[V:1] GB z2 | A2 AF | E2 z2 | FA A>B | AF DD/E/ | FF EE | D2 z2 |]
w: 我 呀 | 我 爱 | 你 | 你 爱 我 | 我 爱 你 蜜 雪 冰 城 甜 蜜 | 蜜
[V:2] .G,,[B,G,] .D,[B,G,] | .D,,[F,D,] .A,,[F,D,] | .A,,[A,C] .E,[A,C] | .D,,[F,D,] .A,,[F,D,] | .D,,[F,D,] .A,,[F,D,] | .G,,[G,D,] .A,,[E,A,] | .D,.A,, [D,,D,]2 |]
```

#tab2
````mdc wrap expand
```music-abc
L:1/8
Q:1/4=100 "andante moderato"
M:2/4
K:D
"D" FA A>B | AF DD/E/ |1 "G" FF ED | "A" E2 z2 :|2 "G" FF "A" EE | "D" D2 z2 ||
```

```music-abc
L:1/8
Q:1/4=100
M:2/4
K:D
V:1 clef=treble
V:2 clef=bass
%%MIDI program 32
[V:1] z2 z f/g/ | aa a>b | af dd/e/ | ff ee | d2 z2 || FA A>B | AF DD/E/ |
w: | | | | | 你 爱 我 | 我 爱 你 蜜 雪
[V:2] z4 | D,[F,A,] .A,[F,A,] | .D,[F,A,] .A,[E,A,] | .G,,[G,D,] .A,,[E,A,] | .D,[F,A,] [D,,D,]2 || .D,,[D,F,] .A,,[D,F,] | .D,,[D,F,] .A,,[D,F,] |
[V:1] FF ED | E2 z2 | FA A>B | AF DD/E/ | FF EE | D2 z2 | G2 G2 |
w: 冰 城 甜 蜜 | 蜜 | 你 爱 我 | 我 爱 你 蜜 雪 冰 城 甜 蜜 | 蜜 | 你 爱
[V:2] .G,,[B,G,] .D,[B,G,] | .A,,[A,C] .E,[A,C] | .D,,[D,F,] .A,,[D,F,] | .D,,[D,F,] .A,,[D,F,] | .G,,[G,D,] .A,,[E,A,] | .D,,[A,,D,] .[A,,D,]2 | .G,,[B,G,] .D,[B,G,] |
[V:1] GB z2 | A2 AF | E2 z2 | FA A>B | AF DD/E/ | FF EE | D2 z2 |]
w: 我 呀 | 我 爱 | 你 | 你 爱 我 | 我 爱 你 蜜 雪 冰 城 甜 蜜 | 蜜
[V:2] .G,,[B,G,] .D,[B,G,] | .D,,[F,D,] .A,,[F,D,] | .A,,[A,C] .E,[A,C] | .D,,[F,D,] .A,,[F,D,] | .D,,[F,D,] .A,,[F,D,] | .G,,[G,D,] .A,,[E,A,] | .D,.A,, [D,,D,]2 |]
```
````
::

## 自定义组件

可以通过 Vue 模板语法、MDC 语法使用的组件。

### Alert

::tab{:tabs='["组件","语法"]'}
#tab1
  ::alert
  你好
  ::

  ::alert{type="question"}
  默认插槽的 [超链接](#alert) **粗体** `Inline code`
  ::

  ::alert{type="info" title="自定义标题"}
  默认插槽的 [超链接](#alert) **粗体** `Inline code`
  ::

  ::alert{type="warning" card}
  #title
  卡片风格 标题插槽的 [超链接](#alert) **粗体** `Inline code`
  #default
  默认插槽的 [超链接](#alert) **粗体** `Inline code`
  ::

  ::alert{type="error" flat}
  #title
  扁平风格 标题插槽的 [超链接](#alert) **粗体** `Inline code`
  #default
  默认插槽的 [超链接](#alert) **粗体** `Inline code`
  ::

  :alert{icon="ph:files-duotone" color="var(--c-accent)" title="仅标题，并且自定义图标和颜色"}

#tab2
```mdc wrap expand
::alert
你好
::

::alert{type="question"}
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

::alert{type="info" title="自定义标题"}
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

::alert{type="warning" card}
#title
卡片风格 标题插槽的 [超链接](#alert) **粗体** `Inline code`
#default
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

::alert{type="error" flat}
#title
扁平风格 标题插槽的 [超链接](#alert) **粗体** `Inline code`
#default
默认插槽的 [超链接](#alert) **粗体** `Inline code`
::

:alert{icon="ph:files-duotone" color="var(--c-accent)" title="仅标题，并且自定义图标和颜色"}
```
::

### Badge

::tab{:tabs='["组件","语法"]'}
#tab1
:badge[普通带链接]{link="#badge"} :badge[纯文本指定圆形]{round} :badge[纯文本指定方形]{square} :badge[带个图]{img="https://picsum.photos/100/100"}

外部域名自动获取站点图标 :badge[纸鹿]{link="https://www.zhilu.site"}，
:badge[古怪杂记本]{link="https://gug.thisis.host/" square}，
GitHub链接能自动识别头像 :badge[KazariEX]{link="https://github.com/KazariEX"}，
也可指定方形 :badge[isYangs/GioPic]{square link="https://github.com/isYangs/GioPic"}。

::alert
#title
在其他组件中使用 :badge{img="https://picsum.photos/100/100" text="带链接" link="#badge"}
#default
:badge{img="https://picsum.photos/100/100" text="指定圆形" round} 背景色 [可以 :badge{img="https://picsum.photos/100/100" text="动态变化" square} 使用](#badge)
::

#tab2
```mdc wrap expand
:badge[普通带链接]{link="#badge"} :badge[纯文本指定圆形]{round} :badge[纯文本指定方形]{square} :badge[带个图]{img="https://picsum.photos/100/100"}

外部域名自动获取站点图标 :badge[纸鹿]{link="https://www.zhilu.site"}，
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
::

### BlogHeader

::tab{:tabs='["组件","语法"]'}
#tab1
:blog-header

#tab2
```mdc
:blog-header
```
::

鼠标悬浮时的动画 Emoji `📄🦌🙌🐟🏖️` 对应“纸鹿摸鱼处”的汉字，在 `app.config.ts` 中配置，字体由 [阿里妈妈方圆体](https://www.iconfont.cn/fonts/detail?cnid=pOvFIr086ADR) 分割而来。

```sh wrap
# iconfont 网页版生成的字体子集在 Chrome 124 的版本无法解析，需要借助 fonttools 工具手动生成子集
pip install fonttools brotli
pyftsubset ./AlimamaFangYuanTi.ttf --text=Header文本 --flavor=woff2
```

### :blur[Blur]

::tab{:tabs='["组件","语法"]'}
#tab1
:blur[你知道得太多了。]

::blur
:::quote
也未必。
:::
::

#tab2
```mdc
:blur[你知道得太多了。]

::blur
:::quote
也未必。
:::
::
```
::

### CardList

> 给列表刷上了自定义样式，待完善。

::tab{:tabs='["组件","语法"]'}
#tab1
::card-list
- 无序列表项1
- 无序列表项2
  - 无序列表项2-1
    - 无序列表项2-1-1
  - 无序列表项2-2
::

#tab2
```mdc
::card-list
- 无序列表项1
- 无序列表项2
  - 无序列表项2-1
    - 无序列表项2-1-1
  - 无序列表项2-2
::
```
::

### Chat

::tab{:tabs='["组件","语法"]'}
#tab1
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

#tab2
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
::

### Copy

::tab{:tabs='["组件","语法"]'}
#tab1
:copy{code="rm -rf # 修改命令后再复制，也可撤销修改"}

:copy{prompt code="不带提示符的命令，可以是 URL、单行代码"}

:copy{prompt="自定义命令提示符、高亮语言" lang="js" code="const customLang = 'js' // 滚动条、边缘羽化会出现，假如它特别特别特别特别特别特别特别特别长"}

#tab2
```mdc wrap
:copy{code="rm -rf # 修改命令后再复制，也可撤销修改"}

:copy{prompt code="不带提示符的命令，可以是 URL、单行代码"}

:copy{prompt="自定义命令提示符、高亮语言" lang="js" code="const customLang = 'js' // 滚动条、边缘羽化会出现，假如它特别特别特别特别特别特别特别特别长"}
```
::

#### 自动推断语言

语言从 `app/utils/str.ts` 的 `getPromptLanguage` 里根据命令提示符前缀推断，使用 [plain-shiki](https://github.com/KazariEX/plain-shiki) 高亮。和之前的 Markdown 代码块使用相同的高亮语言和高亮主题配置。

### EmojiClock

> 现在几点了？

::tab{:tabs='["组件","语法"]'}
#tab1
:emoji-clock (半小时) :emoji-clock{rotate} (5分钟) :emoji-clock{datetime="2024-11-09 23:39:30"} (指定时间)

#tab2
```mdc
:emoji-clock (半小时) :emoji-clock{rotate} (5分钟) :emoji-clock{datetime="2024-11-09 23:39:30"} (指定时间)
```
::

### FeedCard 和 FeedGroup

> 用于在友链页面展示链接，由于友链页面的 Markdown 部分要可能会显示这个组件，就放在这个目录下大家都能调用了。去友链页面看看吧。

### Folding

> 折叠组件，支持折叠和展开，可以嵌套使用。

:::tab{:tabs='["组件","语法"]'}
#tab1
  ::folding
  #title
  可以通过标题插槽传值 [超链接](#folding) **粗体** `Inline code`
  #default
  默认插槽的 [超链接](#folding) **粗体** `Inline code`

    ::folding{open title="折叠还可以嵌套"}
    默认展开的折叠。

      ::alert{type="error"}
      #title
      在嵌套使用的组件内部使用 MDC 的 `#slotname` 插槽语法
      #default
      必须缩进，否则会报错。
      ::
    ::
  ::

::folding{open}
```md
- 默认展开的折叠。
```
::

#tab2
````mdc expand
  ::folding
  #title
  可以通过标题插槽传值 [超链接](#folding) **粗体** `Inline code`
  #default
  默认插槽的 [超链接](#folding) **粗体** `Inline code`

    ::folding{open title="折叠还可以嵌套"}
    默认展开的折叠。

      ::alert{type="error"}
      #title
      在嵌套使用的组件内部使用 MDC 的 `#slotname` 插槽语法
      #default
      必须缩进，否则会报错。
      ::
    ::
  ::

::folding{open}
```md
- 默认展开的折叠。
```
::
````
:::

### Key

> 按下键时会亮，可以通过 `@press` 配置触发事件，鼠标点击也会触发事件，博客全站搜索框的按键提示使用了这个组件。

::tab{:tabs='["组件","语法"]'}
#tab1
- 纯 Code

  :key{code="Escape"} :key{code="F2"} :key{code="Control"} :key{code="A"} :key{code=" "} :key{code="Tab"} :key{code="Enter"}

- 指定修饰符、图标、文本（macOS 自动使用图标）

  :key{code="Control" icon} :key{alt icon} :key{shift icon} :key{code=" " text="空格"} :key{code="Tab" icon} :key{code="Enter" icon}

- 组合键

  :key{code="A" ctrl shift} :key{alt shift} :key{code="Escape" ctrl alt icon}

~~热血组合技 :key{code="ArrowUp"} :key{code="ArrowUp"} :key{code="ArrowDown"} :key{code="ArrowDown"} :key{code="ArrowLeft"} :key{code="ArrowRight"} :key{code="ArrowLeft"} :key{code="ArrowRight"} :key{code="B"} :key{code="A"}~~

#tab2
```mdc wrap
- 纯 Code

  :key{code="Escape"} :key{code="F2"} :key{code="Control"} :key{code="A"} :key{code=" "} :key{code="Tab"} :key{code="Enter"}

- 指定修饰符、图标、文本（macOS 自动使用图标）

  :key{code="Control" icon} :key{alt icon} :key{shift icon} :key{code=" " text="空格"} :key{code="Tab" icon} :key{code="Enter" icon}

- 组合键

  :key{code="A" ctrl shift} :key{alt shift} :key{code="Escape" ctrl alt icon}

~~热血组合技 :key{code="ArrowUp"} :key{code="ArrowUp"} :key{code="ArrowDown"} :key{code="ArrowDown"} :key{code="ArrowLeft"} :key{code="ArrowRight"} :key{code="ArrowLeft"} :key{code="ArrowRight"} :key{code="B"} :key{code="A"}~~
```
::

### LinkBanner

::tab{:tabs='["组件","语法"]'}
#tab1
::link-banner
---
banner: https://picsum.photos/480/240
title: 标题
description: 这是一行描述，如果不提供描述会展示域名
link: "#link-banner"
# mirror: # 是否借助第三方图片加载服务，见源代码
---
::

#tab2
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
::

### LinkCard

::tab{:tabs='["组件","语法"]'}
#tab1
::link-card
---
icon: https://picsum.photos/100/100
title: 标题
description: 这是一行描述，如果不提供描述会展示域名
link: "#link-card"
# mirror: # 是否借助第三方图片加载服务，见源代码
---
::

#tab2
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
::

### Pic

> 用于展示图片，支持说明文字、点击后打开灯箱缩放。

::tab{:tabs='["组件","语法"]'}
#tab1
::pic
---
src: https://picsum.photos/480/240
# mirror: # 是否借助第三方图片加载服务，见源代码
caption: 说明文字，还支持通过 width 或 height 属性指定尺寸
# zoom: false # 是否开启灯箱缩放，默认开启
---
::

#tab2
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
::

### Poetry

> 在文章的 type 为 `tech` 或 `story` 时，它有不同的样式。

::tab{:tabs='["组件","语法"]'}
#tab1
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

#tab2
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
::

### Quote

> 在文章的 type 为 `tech` 或 `story` 时，它有不同的样式。

::tab{:tabs='["组件","语法"]'}
#tab1
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

#tab2
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
::

### Tab

::tab{:tabs='["组件","语法"]'}
#tab1
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

#tab2
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
::

### Timeline

::tab{:tabs='["组件","语法"]'}
#tab1
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

#tab2
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
::

### Tip

::tab{:tabs='["组件","语法"]'}
#tab1
:tip[我是一条小提示]{tip="提示的内容是提示"}， :tip[我没有图标]{icon tip="或许也可以没有内容"}， :tip[+v 点击就能复制，太方便了！]{copy}

#tab2
```mdc wrap
:tip[我是一条小提示]{tip="提示的内容是提示"}， :tip[我没有图标]{icon tip="或许也可以没有内容"}， :tip[+v 点击就能复制，太方便了！]{copy}
```
::

### VideoEmbed

> 放点视频给你看。

::tab{:tabs='["组件","语法"]'}
#tab1
::video-embed
---
type: raw
id: https://sf-atsx-tob.larksuite.com/obj/static-atsx-online-sg-ee-tob-mycis/02c7da694d343896877c09de9db4fc42/8ede49e0a92f53cdafbbf49339194986d9d900fb2abe242b9a8b4e338bf18b05.mp4
poster: https://sf-atsx-tob.larksuite.com/obj/static-atsx-online-sg-ee-tob-mycis/02c7da694d343896877c09de9db4fc42/e23074879c61a4d61e905ccef5771a36a2d19689c1204c2b32caa53711ac83ad.png
---
::

::video-embed
---
type: bilibili
id: BV1Yr421p7rW
---
::

::video-embed
---
type: douyin-wide
id: '7339041157571169546'
---
::

::video-embed
---
type: douyin
id: '7222222794333998392'
---
::

#tab2
```mdc
::video-embed
---
type: raw
id: https://sf-atsx-tob.larksuite.com/obj/static-atsx-online-sg-ee-tob-mycis/02c7da694d343896877c09de9db4fc42/8ede49e0a92f53cdafbbf49339194986d9d900fb2abe242b9a8b4e338bf18b05.mp4
poster: https://sf-atsx-tob.larksuite.com/obj/static-atsx-online-sg-ee-tob-mycis/02c7da694d343896877c09de9db4fc42/e23074879c61a4d61e905ccef5771a36a2d19689c1204c2b32caa53711ac83ad.png
---
::

::video-embed
---
type: bilibili
id: BV1Yr421p7rW
---
::

::video-embed
---
type: douyin-wide
id: '7339041157571169546'
---
::

::video-embed
---
type: douyin
id: '7222222794333998392'
---
::
```
::

## 组件使用方法

一是看开头提到的 MDC 文档，至关重要。二是看使用组件对应的源代码 (`example.md`)，也很重要。三是看我文章的调用方式，没有就慎用。

### 组件的不完美性

博客开发精力有限，常用的组件会仔细打磨，不常用的组件仅仅满足需求。

所以，少年，选择你的英雄吧！
