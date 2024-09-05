---
title: 友链
aside: []
---

:friend-group

:br

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

:::timeline

{2024-01-29}

启用友链板块

{2024-01-30}

加入开往

{2024-02-04}

加入萌备

:::

#tab2

:copy{prompt="QQ群"}[169994096]

#tab3

- 申请要求：原则上与多数独立博客的友链要求一致
  - **能够长期更新维护，并输出有价值的内容**
  - 可以参考 [加入开往](https://www.travellings.cn/docs/join) 页面的规则
- 申请方式：在评论区留言或发送邮件到 :tip{text="hi@zhilu.cyou" copy}
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
    如果你的昵称和博客名称不同，还能通过 `title: 博客别称` 提供后缀
- 信息可能会被适当修改，以保证展示效果

:::friend-card
---
name: 纸鹿本鹿
title: 摸鱼处
desc: 纸鹿至麓不知路，支炉制露不止漉
link: https://blog.zhilu.cyou
icon: https://www.zhilu.cyou/api/avatar.png
---
:::
::
