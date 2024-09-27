---
title: 组件样式示例
date: 2024-09-21 23:18:18
hideInfo: true

icon: https://www.zhilu.cyou/api/icon.png
---

## Alert

::alert
#title
标题插槽的 **粗体** `Inline code`
#default
默认插槽的 **粗体** `Inline code`
::

::alert{type="question"}
#title
标题插槽的 **粗体** `Inline code`
#default
默认插槽的 **粗体** `Inline code`
::

::alert{type="info"}
#title
标题插槽的 **粗体** `Inline code`
#default
默认插槽的 **粗体** `Inline code`
::

::alert{type="warning"}
#title
标题插槽的 **粗体** `Inline code`
#default
默认插槽的 **粗体** `Inline code`
::

::alert{type="error"}
#title
标题插槽的 **粗体** `Inline code`
#default
默认插槽的 **粗体** `Inline code`
::

## Badge

:badge[普通] :badge[指定圆形]{round} :badge[指定方形]{square}

:badge{img="1"} :badge{img="1" round} :badge{img="1" square}

::alert
#title
:badge{img="1" text="自定义文字" to="/"}
:badge{img="1" text="自定义文字" round}
:badge{img="1" text="自定义文字" square}
::

## Copy

:copy[sudo rm -rf]
