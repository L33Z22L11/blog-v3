---
title: Cloudflare R2 对象存储
description: 关于 Cloudflare R2 的开通，以及需要进行的一些配置和说明，谨记切勿过分滥用，用作违法之行径。
date: 2025-08-04 13:05:10
updated: 2025-08-06 06:59:19
categories: [分享]
tags: [存储]
---

2025年8月4日凌晨时分，LineXic 建图床，遂见之，些许缓慢。

::chat

{LineXic}

新搞了个图床要不要瞅瞅😗

顺便测测速度😁

::

突感好奇，如何解决绑卡之难事？

## Cloudflare R2 不必绑卡

::chat
{:2025-08-04 00:26}

{.Mugzx}

那 Cloudflare R2 是怎么解决的，印象中这个需要用到银行卡

{LineXic}

引用：那 Cloudflare R2 是怎么解决的，印象中这个需要用到银行卡<br>
你可算问到这个啦（窃喜）

等会给你看一篇文章

[https://blog.yaria.top/posts/730cf317](https://blog.yaria.top/posts/730cf317)

［图片］

{:省略了一些聊天记录…}

{.Mugzx}

这下舒服了😙

{LineXic}

有了这个 Cloudflare 的可玩性会大很多

::

见之大[喜]{.text-zoom}！一试，真能开通。

## 媒体处理

~~由于我比较在意国内网络的访问，大多数图片还是选择放在在我的 Bitiful S4 里面，R2 存储桶暂时也没有什么规划的想法，就先放一下我的 owo.json 吧~~。我将封面图片迁往 Cloudflare R2，但需要颜色管理以及更快加载的图片依旧是 Bitiful S4。

使用 Cloudflare Images 可以转换图像。

```
https://<ZONE>/cdn-cgi/image/<OPTIONS>/<SOURCE-IMAGE>
```

根据 [Cloudflare 官方文档](https://developers.cloudflare.com/images/transform-images/transform-via-url/#options)，将`<ZONE>`修改为你的域名，`<OPTIONS>`修改为处理参数，`<SOURCE-IMAGE>`修改为图片的路径即可启用 Cloudflare Images。

```
https://r2.mugzx.top/cdn-cgi/image/f=avif/259e8d4196fea827025c2927a6fcd6e98d030057371238a77ae4cddebce86477.png
```

## 访问配置

建议除了公共使用的图片外，都去配置防盗链，可以避免盗用以及减少不必要的流量消耗，这是我的一些配置：

### CORS 策略

仅允许 `https://blog.mugzx.top` 发送 GET 请求。

```json
[
  {
    "AllowedOrigins": [
      "https://blog.mugzx.top"
    ],
    "AllowedMethods": [
      "GET"
    ]
  }
]
```

### Referer 配置

只有从 `blog.mugzx.top` 发起的请求才能访问 `r2.mugzx.top` 的资源（允许空Referer），其他域名的请求则会被拒绝。

```
(http.host eq "r2.mugzx.top" and http.referer eq "blog.mugzx.top")
```

- 然后采取措施：阻止

在[自定义规则](https://dash.cloudflare.com/security/security-rules/custom-rules)中创建。

### R2速率限制

```
(http.request.uri.path contains "/")
```

- 当速率在几秒内超过多少次请求；推荐设置在10秒内超过120次请求，最低不要超过100次请求。
  - 可根据实际情况修改。
- 然后采取措施：阻止
- 持续时间：10秒

在[速率限制规则](https://dash.cloudflare.com/security/security-rules/rate-limiting-rules)中创建。

### 图片缓存

还有[缓存配置](https://dash.cloudflare.com/rules/page-rules/form)，这里我是参考了[我爱水煮鱼](https://blog.wpjam.com/article/cloudflare-r2)的配置。

- URL：`https://blog.mugzx.top/*`​， 必须使用https协议，根据使用情况后接`*`通配符。
- 浏览器缓存 TTL：1天
- 边缘缓存TTL：1个月（经常更换图片可以适当降低）
- 缓存级别：缓存所有内容
- 源服务器缓存控制：添加但不开启

同样是根据实际情况按需修改，缓存配置会影响文件更新，当桶内资源发生变化但链接内容**没有变化**时，可以手动清除缓存。

## 感谢 Cloudflare

:quote[至此，图床配置完成。]

此 Cloudflare 之 Bug 不止于 R2，切勿过分滥用，用作违法之行径。
