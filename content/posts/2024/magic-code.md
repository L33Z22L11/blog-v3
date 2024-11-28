---
title: 写过的奇妙代码。
description: 这些代码不算是 Best Practice，也不算是常见的写法，令人眼前一亮/黑。
date: 2024-04-07 12:32:11
updated: 2024-04-07 20:38:20
categories: [代码]
tags: [Lab]
---

## C 语言排序：根据条件选择排序依据

这是一个简单的 ls 实现，于2023年3月4日学习 C 语言时编写。82 行处使用了选择排序，但是排序条件会根据参数的设置（`-t` `-r`）来选择排序的依据：

- `!!(param & P_r)`{lang="c"}：检查参数 param 是否设置了标志位 `P_r`（`-r` 是逆序参数）。双感叹号 `!!` 用于将布尔值转换为 0 或 1。
- 逻辑异或运算 `^`{lang="c"}：根据 `P_r` 设置情况，决定后续的排序判断结果是否需要翻转。
- `(param & P_t)`{lang="c"}：检查参数 param 是否设置了标志位 `P_t`。如果设置了，则表示需要根据文件的修改时间进行排序，否则根据文件名进行排序。

```c
// 排序文件列表
for (int i = 1, j, temp; i < entc; i++) {
    temp = enti[i];
    for (j = i;
         // 排序的 condition 很长
         j > 0 && !!(param & P_r) ^ (param & P_t
             ? entv[enti[j - 1]].mtime > entv[temp].mtime
             : strcmp(entv[enti[j - 1]].name, entv[temp].name) > 0);
        j--)
        enti[j] = enti[j - 1];
    enti[j] = temp;
}
```

这里的排序的条件比较复杂，但是有效简化了排序的逻辑，不需要再写很多 if 语句来判断排序条件。

::link-card
---
title: Linux 下简单 ls 命令的实现
link: /2023/zls
---
::

程序中关于参数解析的内容也比较有意思，使用了宏函数来解析参数，同时二进制标志位来存储参数。

## HTML 模板生成器

2023年2月7日，我建立了一个简单的网址导航页面。4 天后，我和半岛的孤城聊了聊，他觉得用 HTML 手搓导航项不够优雅，于是推荐我用类似 JSON 的结构来维护导航项。

他推荐我用 JS 的模板字符串来生成导航，但是遇到了一些问题，最后发现是生成的 HTML 标签没有正确闭合，导致浏览器报错。同时，由于我的导航项比较复杂，所以写出的模板生成器代码也很抽象。

```js
const nav = {
    name: 'CO导航',
    description: '',
    list: [],
    ele: document.getElementsByClassName('navlist'),
}

nav.list[0] = [{
    name: '线上课时',
    icon: 'fa-solid fa-chalkboard-user',
    item: [
        { text: '学习通', icon: 'iconfont icon-chaoxing', link: 'http://i.chaoxing.com/' },
    ]
}, {
    name: '西邮生活',
    icon: 'fa-solid fa-school',
    item: [
        { text: '我在校园', desc: '网页版登录', icon: 'fa-solid fa-location-dot', js: 'dialog.showMsg(this.textContent)' },
    ]
},]

nav.list.forEach((list, i) => {
    nav.ele[i].innerHTML = list.map(group => `
    <div class="card">
    <div class="between">
    <h4><i class="${group.icon} fa-space"></i>${group.name}</h4>
    ${group.desc ? `<p class="dim">${group.desc}</p>` : ``}
    </div>
    <div class="list">
    ${group.item.map(item => `
      <a data-sub="${item.desc || ''}"
      ${item.js ? `onclick="${item.js}"` : `href="${item.link}"`}
    >${item.icon ? `<i class="${item.icon} fa-space"></i>` : ``}${item.text}</a>
    `).join(`\n`)}
    </div>
    </div>`).join(`\n`)
})
```

模板生成器的嵌套结构比较复杂：

- 使用 `nav.list.forEach()`{lang="js"} 遍历名为 `nav.list`{lang="js"} 里的每一个导航块。
- 在每个导航块中，使用 `map()`{lang="js"} 方法创建新的字符串数组，使用 `join()`{lang="js"} 方法将数组里的导航组拼接为字符串。
- 在每个导航组中，使用 `map()`{lang="js"} 方法创建新的字符串数组，使用 `join()`{lang="js"} 方法将数组里的导航项拼接为字符串。
  - 导航项可能会有图标、小字描述。
  - 有的导航项不是链接，而是 JS 脚本。

其实也可以用 `createElement()`{lang="js"} 和 `appendChild()`{lang="js"} 来生成 HTML，或者 Vue 的组件也很方便。不过，用原生 JavaScript 写出来了这些，感觉还是挺奇妙的。

::link-card
---
icon: https://cooo.site/favicon.ico
title: CO导航 - 西邮导航服务
link: https://cooo.site/
---
::

## 面向函数而不是面向过程

2024年4月6日，我在维护一个网页工具的背景列表。由于这个项目已经运营了三年，背景列表已经有了四百多张图片，并且还携带了一些描述信息。为了让代码看起来短一些，我先使用比较抽象的数据结构来存储，在使用时再生成更友好的数据结构。

```js
const gallery = {
    End22: [['呱唧', '山望', '2/12/16/HBqoL'], ['呱唧', '瞰林', '2/12/16/HBBGX'],],
    Jan23: [['酸子', '云中印象', '3/01/03/E8Lwa'], ['酸子', '镜中暮', '3/01/03/E8HSK'],],
}
```

经过某个处理函数后，它应当变成这种结构：

```js
const galleryFlated = [
    { vol: 'End22', author: '呱唧', name: '山望', url: 'https://ooo.0x0.ooo/2022/12/16/HBqoL.jpg' },
    { vol: 'End22', author: '呱唧', name: '瞰林', url: 'https://ooo.0x0.ooo/2022/12/16/HBBGX.jpg' },
    { vol: 'Jan23', author: '酸子', name: '云中印象', url: 'https://ooo.0x0.ooo/2023/01/03/E8Lwa.jpg' },
    { vol: 'Jan23', author: '酸子', name: '镜中暮', url: 'https://ooo.0x0.ooo/2023/01/03/E8HSK.jpg' }
]
```

刚开始使用面向过程的方式来处理，后来发现，使用面向函数的方式更简短清晰。

```js
const galleryFlated = Object.entries(gallery).flatMap(([vol, picInfos]) =>
    picInfos.map(([author, name, shortURL]) => ({
        vol,
        author,
        name,
        url: `https://ooo.0x0.ooo/202${shortURL}.jpg`,
    }))
)
```

::link-card
---
icon: https://exam.thisis.host/favicon.ico
title: 考试时钟
link: https://exam.thisis.host
---
::

## 总结

这些代码不算是 Best Practice，甚至有些抽象，不过挺有意思的。
