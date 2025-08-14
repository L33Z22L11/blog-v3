<!-- 友链页面的“申请友链”要求 -->

- 申请要求：原则上与多数独立博客的友链要求一致
  - 能够**长期更新维护**，并输出**有价值的原创内容**
  - 可以参考 [加入开往](https://www.travellings.cn/docs/join.html) 页面的规则
- 申请方式：在评论区留言或发送邮件到 :tip{text="me@mugzx.top" copy}
  - 标题注明 `友链申请: 你的昵称`
  - 以 :tip[任意形式]{tip="指向信息的 URL、自然语言、编程语言"} 附上友链信息

::folding
#title
**展开看看👀**
#default
````md
```ts
export default {
  author: "博主称呼",
  sitenick: "站点标签",
  title: "博客名称",
  desc: "博客介绍",
  link: "博客地址",
  feed: "订阅源地址",
  icon: "站点图标",
  avatar: "博主头像",
  archs: ["框架", "部署方式"],
  date: "申请日期",
  comment: "评论",
  error: "错误信息",
} satisfies Friend
```
````
::
- ⚠️ 信息可能会被适当修改，以保证展示效果
  - 当站点无法访问时，将会使用 `error` 错误字段
- ⛔ 请参考 **格式说明** 发送必要的友链信息
