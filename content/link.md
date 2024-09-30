---
title: 友链
aside: []
hideInfo: true
---

:friend-group

:br

::tab
---
tabs: ["我的博客信息", "申请友链"]
center: true
active: 2
---

#tab1

```yaml
- name: 希乐博客 
  desc: 总有人间人间一两风，吹我十万八千梦
  link: https://blog.xlenco.top
  icon: https://q1.qlogo.cn/g?b=qq&nk=1043865083&s=100
  feed: https://blog.xlenco.top/atom.xml
```

:::timeline

{2024-01-29}

启用友链板块

{2024-01-30}

加入开往


:::


#tab2

- 申请要求：原则上与多数独立博客的友链要求一致
  - **能够长期更新维护，并输出有价值的内容**
  - 可以参考 [加入开往](https://www.travellings.cn/docs/join) 页面的规则
- 申请方式：在评论区留言或发送邮件到 :tip{text="xlenco@email.cn" copy}
  - 标题注明 `友链申请: 你的昵称`
  - 以 :tip[任意形式]{tip="指向信息的 URL、自然语言、编程语言"} 附上友链信息
    ```ts
    export default <Friend> {
        name: '昵称/博客名称', // 昵称优先
        desc: '个人简介/博客描述', // 显示在悬浮窗中
        link: '博客地址',
        icon: '头像/站点图标', // 呼吁不使用 jsDelivr/npm 镜像作为图床
    }
    ```
    - 如果你的昵称和博客名称不同，可通过 `title: 博客别称` 提供后缀
    - 可通过 `archs: ['技术架构', '部署服务']` 提供博客架构信息
- 信息可能会被适当修改，以保证展示效果

:::friend-card
---
name: Xlenco
title: 希乐博客
desc: 总有人间人间一两风，吹我十万八千梦。
link: https://blog.xlenco.top
icon: https://q1.qlogo.cn/g?b=qq&nk=1043865083&s=100
archs: [Nuxt, Vercel]
---
:::
::
