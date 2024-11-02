---
title: 友链
aside: []
hideInfo: true
---

::tab
---
tabs: ["我的博客信息", "申请友链"]
center: true
---

#tab1

```yaml
- author: 纸鹿本鹿
  title: 纸鹿摸鱼处
  desc: 纸鹿至麓不知路，支炉制露不止漉
  link: https://blog.zhilu.cyou
  feed: https://blog.zhilu.cyou/atom.xml
  icon: https://www.zhilu.cyou/api/avatar.png
```

#tab2

- 申请要求：原则上与多数独立博客的友链要求一致
  - 能够**长期更新维护**，并输出**有价值的原创内容**
  - 可以参考 [加入开往](https://www.travellings.cn/docs/join.html) 页面的规则
- 申请方式：在评论区留言或发送邮件到 :tip{text="hi@zhilu.cyou" copy}
  - 标题注明 `友链申请: 你的昵称`
  - 以 :tip[任意形式]{tip="指向信息的 URL、自然语言、编程语言"} 附上友链信息
    ```ts
    export default <Friend> {
        title: '博客名称',
        desc: '博客描述',
        link: '博客地址',
        avatar: '个人头像',
    }
    ```
- 信息可能会被适当修改，以保证展示效果
::
