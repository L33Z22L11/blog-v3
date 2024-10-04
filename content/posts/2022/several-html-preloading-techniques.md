---
title: dns-prefetch、prefetch、preload、defer、async 字段的区别
date: 2022-12-19 17:45:07
updated: 2022-12-19 17:45:07
image: https://xlenco.onmicrosoft.cn/img/html.png
description: 这篇文章介绍了几种HTML资源预加载技术。
---
### 1、`dns-prefetch`

域名转化为 `ip` 是一个比较耗时的过程，`dns-prefetch` 能让浏览器空闲的时候帮你做这件事。尤其大型网站会使用多域名，这时候更加需要 `dns` 预取。

```html
<link rel="dns-prefetch" href="//baidu.com" />
```

### 2、`prefetch`

`prefetch` 一般用来预加载可能使用的资源，一般是对用户行为的一种判断，浏览器会在空闲的时候加载 `prefetch` 的资源。

```html
<link rel="prefetch" href="http://www.baidu.com/" />
```

### 3、`preload`

和 `prefetch` 不同，`prefecth` 通常是加载接下来可能用到的页面资源，而 `preload` 是加载当前页面要用的脚本、样式、字体、图片等资源。所以 `preload` 不是空闲时加载，它的优先级更强，并且会占用 `http` 请求数量。

```html
<link rel="preload" href="style.css" as="style" />
```

#### `as` 值包括

- `script`
- `style`
- `image`
- `media`
- `document` `onload` 方法是资源加载完成的回调函数

### 4、`preconnect`

当浏览器向服务器请求一个资源的时候，需要建立连接，而建立一个安全的连接需要经历以下 3 个步骤：

- 查询域名并将其解析成 IP 地址（DNS Lookup）；
- 建立和服务器的连接（Initial connection）；
- 加密连接以确保安全（SSL）；

以上 3 个步骤浏览器都需要和服务器进行通信，而这一来一往的请求和响应势必会耗费不少时间。
当我们的站点需要对别的域下的资源进行请求的时候，就需要和那个域建立连接，然后才能开始下载资源，如果我都已经知道了是和哪个域进行通信，那不就可以先建立连接，然后等需要进行资源请求的时候就可以直接进行下载了。对比正常请求和配置了 preconnect 时候的请求，它们在请求时间轴上看到的表现是不一样的。
通过如下配置可以提前建立和 [https://example.com](https://example.com) 这个域的连接：

```
<link rel="preconnect" href="https://example.com">
```

通过 preconnect 提早建立和第三方源的连接，可以将资源的加载时间缩短 100ms ~ 500ms，这个时间虽然看起来微不足道，但是它是实实在在的优化了页面的性能，提升了用户的体验。

> 通过 preconnect 和别的域建立连接后，应该尽快的使用它，因为浏览器会关闭所有在 10 秒内未使用的连接。不必要的预连接会延迟其他重要资源，因此要限制 preconnect 连接域的数量。


### 5、`defer` 和 `async`

```html
//defer
<script defer src="script.js"></script>
//async
<script async src="script.js"></script>
```

`defer` 和 `async` 都是异步(并行)加载资源，不同点是 `async` 是加载完立即执行，而 `defer` 是加载完不执行，等到所有元素解析完再执行，也就是 `DOMContentLoaded` 事件触发之前。 因为 `async` 加载的资源是加载完执行，所以它比不能保证顺序，而 `defer` 会按顺序执行脚本。
![-162351542.png](https://cdn-ak.f.st-hatena.com/images/fotolife/x/xlenco/20240620/20240620204341.png)
