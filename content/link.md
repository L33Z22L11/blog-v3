---
title: 友链
aside: false
---

::tab
---
tabs: ["我的博客信息", "交流群", "申请友链"]
center: true
active: 2
---

#tab1
```yaml
- name: 纸鹿摸鱼处 # 可选：纸鹿本鹿
  link: https://blog.zhilu.cyou
  icon: https://www.zhilu.cyou/api/avatar.png
  desc: 纸鹿至麓不知路，支炉制露不止漉
  feed: https://blog.zhilu.cyou/atom.xml
```

#tab2
:copy{prompt="QQ群" command="169994096"}

#tab3
申请要求：原则上与多数独立博客的友链要求一致，可以参考 [加入开往](https://www.travellings.cn/docs/join) 页面的规则。

如果你想申请友链，请发邮件到 `hi@zhilu.cyou`，标题为 `友链申请: 你的昵称`，内容如下：

```ts [使用任意语言导出以下字段]
export default <Friend> {
    name: '昵称/博客名称',
    desc: '个人简介/博客描述', // 显示在悬浮窗中
    link: '博客地址',
    icon: '头像/站点图标', // 呼吁不使用 jsDelivr/npm 镜像作为图床
}
```

为了展示效果，我可能会将一些内容替换为其他内容，将会被渲染为：

::friend-card
---
name: 纸鹿摸鱼处
desc: 纸鹿至麓不知路，支炉制露不止漉
link: https://blog.zhilu.cyou
icon: https://www.zhilu.cyou/api/avatar.png
---
::

::accordion{summary="如果想深度定制，可提供以下信息"}

数据格式及展示效果如下：

```ts
export default <Friend> {
    name: '个人昵称',
    title: '博客简称', // 例如小站、空间站，显示为后缀，最好不超过4字
    desc: '个人简介/博客描述',
    link: '博客地址',
    icon: '头像/站点图标',
    comment: '介绍', // 由纸鹿做出的简单介绍
}
```

::friend-card
---
name: 纸鹿本鹿
title: 摸鱼处
desc: 纸鹿至麓不知路，支炉制露不止漉
link: https://blog.zhilu.cyou
icon: https://www.zhilu.cyou/api/avatar.png
comment: 纸鹿本鹿当然是我自己。
---
::

:friend-group
