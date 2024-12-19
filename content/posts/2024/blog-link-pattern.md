---
title: 把博客文章按年份放在子文件夹中了
description: 同时更改了文章链接前缀，编写了跳转脚本，后来通过平台重定向规则实现更规范的跳转。
date: 2024-04-29 11:10:18
updated: 2024-09-27 08:37:52
categories: [经验分享]
tags: [网站, 博客]
references:
  - title: 使用子文件夹管理 Hexo 文章且不改变文章永久链接
    link: https://prinsss.github.io/hexo-posts-in-subfolder/
  - title: 更改Hugo博客的永久URL链接，并用Netlify实现旧博文跳转
    link: https://thirdshire.com/simplify-permalinks/
---

> 我的博客很少写关于折腾博客的内容，因为我不想让博客变成博客的博客。这次的行为仅服务于博客的后期维护。
>
> 私以为，博客应当专注于内容，而不是囿于形式。

## posts 目录文章过多

不知不觉，博客已经有了大约 45 篇文章，生成的文章链接以 `:year:month/` (如 `202404/`) 开头，但 Markdown 源文件都放在了 `_posts/` 目录下，不便于管理。因此，我想在`_posts/` 目录里按年份创建子文件夹。

## 移动文章到年份文件夹

看了 [参考资料](#references)，博主给出了一个实用命令 `grep -r "date: '2015-" *.md -l | xargs mv -v -t 2015/`{lang="cmd"}，用于批量移动文件，我借助 Poe Assistant 写出了对应的 PowerShell 脚本。

```powershell
# 搜索匹配的文件
Get-ChildItem -Filter "*.md" -Recurse | ForEach-Object {
    $filePath = $_.FullName
    $match = Select-String -Path $filePath -Pattern "date: 2020-" -Quiet

    if ($match) {
        # 获取文件名
        $fileName = $_.Name

        # 创建目标目录
        $targetDirectory = "2020"
        if (-not (Test-Path -Path $targetDirectory)) {
            New-Item -ItemType Directory -Path $targetDirectory | Out-Null
        }

        # 移动文件
        Move-Item -Path $filePath -Destination (Join-Path -Path $targetDirectory -ChildPath $fileName) -Verbose
    }
}
```

## 设置链接前缀

Hexo 会自动给文章链接带上子文件夹的名称，所以在 `_config.yml` 设置文章永久链接为仅 `:title/`，就可以满足需求。如果不想要文件夹名或者想要维持原来的 URL 配置，将原先文章永久链接中的 `:title/` 替换为 `:name/` 即可。

## 旧链接重定向

通过主题提供的自定义侧栏 Widget 能力，我为 404 页面引入了自定义脚本，用于重定向旧链接。

```yaml [_config.stellar.yml]
site_tree:
  error_page:
    leftbar: recent, timeline, notice_404
```

```yaml [source/_data/widgets.yml]
notice_404:
  layout: markdown
  content: |
    <!-- Notice 还没想好，以后再写吧 -->
    <script src="/static/handler-404.js"></script>
```

用正则表达式匹配、替换，就完成了重定向。

```js [static/handler-404.js]
const newPath = location.pathname.match(/^(\/\d{4})\d{2}(\/.*)/)
if (newPath)
    location.href = newPath[1] + newPath[2]
```

Over.

## 还没有结束

[上一节](#旧链接重定向) 的内容废弃了。

HTTP 状态码不该是 404，所以需要通过 Netlify 提供的 [重定向能力](https://docs.netlify.com/routing/redirects/redirect-options/)，让状态码变为 3xx。

在建博客时埋了一个坑，我的链接是 `:year:month/:title/`，而 Netlify 的 Placeholder 仅支持诸如 `:year/:month/:title/` 的形式，所以不能使用这种配置文件：

```toml [source/netlify.toml]
[[redirects]]
from = "/post/*"
to = "/:splat"

[[redirects]]
from = "/:year/:month/:date/:slug"
to = "/:slug"
```

所以我只能给每个博客 URL 分别设置重定向规则。为了获取先前的 URL 路径，我恢复了旧的 `permalink` 配置，把其中的 `:title` 改为 `:name`。

```yaml [_config.yml]
permalink: :year:month/:name/
# permalink: :title/
```

要一条一条写重定向规则，有点麻烦，可以这么做：

- 尝试用命令生成先前博客链接路径和新的博客链接路径
  :copy{prompt="PS>" code="hexo clean; hexo generate"}
- findstr 不完全支持 PCRE，可以用 `Select-String "\\\d{6}\\"`{lang="powershell"} 代替
  :copy{prompt="PS>" code="dir -s .\public\ | findstr -r &quot;\\[0-9][0-9][0-9][0-9][0-9][0-9]\\&quot;"}

再用正则表达式稍微替换一下输出（不要忘了`/`），就能得到 Netlify 的重定向规则文件了。

``` [source/_redirects]
……
/202304/vscode-simple-config /2023/vscode-simple-config
/202305/archinstall-guide /2023/archinstall-guide
/202306/archlinux-configure /2023/archlinux-configure
/202307/archlinux-beautify /2023/archlinux-beautify
……
```

如果 generate 的文件中没有 `_redirects` 文件，那就修改一下配置文件：

```yaml [_config.yml]
include: [_redirects]
```

这下应该 over 了。

## 又没有结束

5个月后，我通过 Google Search Console 发现收录的博客链接还是原先的。于是又通过 Nuxt 的能力编写了新的重定向脚本，并期待它能获取到 canonical 标签。
