---
title: 从 CSS 排序折腾到 Stylelint 和 pnpm
description: 试图不走寻常路，通过 pnpm 全局安装 Stylelint 实现 CSS 排序，却遭遇诸多挑战。理想的方案是否真的可行？
date: 2024-05-21 22:44:44
updated: 2024-05-25 15:56:33
image: https://7.isyangs.cn/24/6664009e81625-24.jpg
categories: [经验分享]
tags: [软件, 问题]
references:
  - title: 这些内容不值得参考。
---

## tl;dr

Stylelint 是一个 CSS 语法检查工具。pnpm 是一个 Node.js 包管理工具，它相比默认的 npm 有诸多优势。本应该给每个项目分别安装 Stylelint 并撰写配置文件，但是为了方便，我决定全局安装，这样我就不用为每个项目重复安装、配置了。

想法很美好，但碰了好几次头。在折腾环境与环境折腾自己的过程中，我似乎体会到了理想主义者常有的那种……我不是完全的理想主义者，所以写博客的时候有些许红温。算了，[大家直接看结论就好](#重新思考最佳实践)。

## SSH 启动之我 hexo-cli 呢

某天写完博客后，出门想起来博客应该更新了，遂通过某台设备 SSH 连接 Windows，执行相关命令，没想到竟然报错如下：

```log wrap
hexo : 无法将“hexo”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
所在位置 行:1 字符: 1
+ hexo deploy
+ ~~~~
+ CategoryInfo : ObjectNotFound: (hexo:String) [], CommandNotFoundException
+ FullyQualifiedErrorId : CommandNotFoundException
```

不是，我那么大个 Hexo 呢！？

### 用远程桌面，根本难不倒他

后来的事情便不再赘述了。

## 从 CSScomb 到 CSScomb，然后选择 Stylelint

在我初学前端时，时常感到 CSS 声明的顺序难以决定和整理，后来找到了 [CSScomb](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-csscomb) 插件来整理 CSS 声明顺序。在 VS Code 配置文件中设置 `{ "csscomb.preset": "csscomb" }`{lang="json"} 即可使用这个插件。

因为插件长期不更新，另一位俄国老哥创建了同名 VS Code 插件 [CSScomb](https://marketplace.visualstudio.com/items?itemName=naumstory.vscode-csscomb) 来吐槽。原插件在 2020 年更新后就 Archive 了，而且也没有 CSS 新特性的支持。

### “好装不好用”还是“好用不好装”？只知道我好菜。

后来，我看到了 [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)，它比 CSScomb 更好用，而且支持 VS Code 的自动格式化功能。

> 有人问我有关 Linux 发行版的选择，我想了想，说（对于通俗意义上的新手而言）Ubuntu 容易安装，但后续配置环境时不太方便；Arch Linux 难以安装，但配置环境相比要轻松不少。

这是一场“好装不好用”与“好用不好装”的博弈，但我当时初次接触前端，连 npm 都不知道，又看到官方文档里繁琐的配置过程，折腾许久后就只知道了我好菜。

### 下午四点，KazariEX 让我充满动力：起床干活！

今天早上满课，12:30 又有 C++ 实验，下机之后就只想睡大觉，~~但想到了「Stylelint」，于是又睡大觉~~。（通义灵码干的，或许赛博生命体也爱睡大觉）

睡觉前，在 KazariEX 的群里从前端页面布局耗时聊到 CSS 插件。睡醒后，我提到了 CSS 声明顺序整理，KazariEX 就推荐了 [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)，我模糊回忆起之前浅尝辄止的经历。**无论如何，再试试吧。**

#### 看看 hexo-server-live

::link-card
---
icon: https://github.githubassets.com/favicons/favicon.svg
title: KazariEX/hexo-server-live
link: https://github.com/KazariEX/hexo-server-live
---
::

同时，KazariEX 向我推荐了一个 Hexo 插件，用于在本地文件更新后自动刷新预览。我的评价是好用爱用。😋再看是 KazariEX 写的，更喜欢了。

### 同时也是被 Yuanfang 拉着帮忙的纸鹿

中午睡醒刚下床，微信电话铃声就响个不停，接听却没声音。打字吧：

::chat

{Yuanfang}

哥😭我给虚拟机编译内核，`make install`{lang="sh"} 时候 `/boot` 分区满了，我不敢整，怕搞崩，你能来给扩容一下不🥹

{Yuanfang}

📞通话时长 00:22

{.}

你耳机是不是没电了

{.}

我刚下床

{Yuanfang}

📞通话时长 00:41

{Yuanfang}

怪事，我耳机麦克风好像坏了

{Yuanfang}

鹿神，快来救我

{Yuanfang}

我整了快两个点，不会搞😿😿
::

我去了实验室，检查他虚拟机的 `/boot` 分区有 1 GiB，但编译出的 Initrd 文件太大，只得由挂载分区改为普通文件夹并放入原先内容，重新编译才解决问题。顺带一提，他向 Linux 内核提交的 [代码](https://lore.kernel.org/all/20240509044323.247606-1-yf768672249@gmail.com/) 成功合并进了主分支。

### 与此同时，Shawn 也找到了我

在我给 Yuanfang 修 `/boot` 分区的同时，Shawn 也找到了我。

作为一名力扣刷题选手，他对力扣网页的代码编辑器有着自己的需求：他平时常用 JetBrains 全家桶，不希望使用 Iosevka / 等宽更纱黑体 SC 之类的字体——这些字体的英文字符只占半个汉字宽，有些过于窄了。而力扣编辑器中没有相应的设置。他尝试将在 Chrome 设置中将等宽字体改为 JetBrains Mono，但是并没有用。

经过我的分析，网页编辑器中使用了这样的字体配置：

```css
.view-lines.monaco-mouse-cursor-text {
  font-family: "Droid Sans Mono", "monospace", monospace;
}
```

为什么会有两个 monospace？第一个 `"monospace"`{lang="js"} 是系统的 monospace 字体别名，而第二个才是浏览器的等宽字体设置，优先级最低，所以设置了看不到效果。

经过我和 Shawn 的探讨，打算安装 CSS 中优先级最高的 `Droid Sans Mono` 来满足需求。包管理器（Yay）里没有找到，我们就通过浏览器下载字体，再通过字体管理器安装了字体，问题就解决了。

## 装了又装，想想还是全局安装

😓**历经千辛万苦，终于在自己的实验室工位上坐定了。**

下午起床时受到 KazariEX 的启发，此时我就有了一个伟大的设想：使用一个跨平台、弱侵入性、配置少的方案，让 Stylelint 能在 Windows 和 Linux 上同时工作，并且能在没有 `.stylelintrc` 配置文件的环境下（老项目/零散文件）格式化 CSS 代码。

### 通义灵码，使我的代码和用户目录充满「灵」感

但话说起来，想在 Windows 和 Linux 上通过 VS Code 的设置同步保持近乎统一的体验的话，需要解决一些痛点，比如这件事中的配置文件让我迷惑：

前一段时间，通义灵码有推广活动，我就跟着安装了 VS Code 插件。整体的体验还是比较好的，尤其是代码自动补全功能十分实用。只是在写博客的过程中，通义灵码偶尔会写出一些充满「灵」感的文字，像幽灵无意识的呢喃，在博客 Markdown 中低语~~，无意识地呢喃，在 Markdown 中低语，无意识地呢喃，在 Markdown 中低语，无意识地呢喃，在 Markdown 中低语，无意识地呢喃，在 Markdown 中~~（不小心按了补全键，欸嘿）

更令人震惊的是，我 Linux 系统的主文件夹里出现了一个名为 `C:\\Users\\Zhilu\\.lingma` 的「灵」件夹（这和我 git clone 某人的仓库发现一个 D 盘路径名的文件夹一样炸裂）。再一看 VS Code 的配置文件，果然出现了一个被同步的配置项：

```json [settings.json]
{
  "Lingma.LocalStoragePath": "C:\\Users\\Zhilu\\.lingma",
}
```

只能先在同步配置中忽略这个配置项了。

```json [settings.json]
{
  "settingsSync.ignoredSettings": [
    "Lingma.LocalStoragePath",
  ],
}
```

现在，我发现这个逆天配置项就被新版本弃用了，也许开发人员也在 Linux 上看到那个奇妙文件夹了吧。

### Stylelint，你能找到 pnpm 全局包吗？

删除了配置文件里的无用配置项，我就着手全局安装 Stylelint 相关包了。

:copy{code="pnpm i -g stylelint stylelint-config-standard stylelint-order"}

我原本想在用户目录写 `~/stylelint.config.js` 或者 `~/.stylelintrc.js` 文件，就像 `~/.clang-format` 可以作为 `clangd` 的配置文件一样，但发现 VS Code 插件不读取用户目录的配置作为配置文件。

我又尝试指定 `stylelint.configFile` 配置，但发现它不解析 `~`（tilde expansion，波浪线展开）或 `%UserProfile%`（变量），而是将其作为普通相对路径解析。最后，我通过指定 `stylelint.config` 而不是 `stylelint.configFile`，避免跨系统访问路径的错误。

```json [settings.json]
{
  "stylelint.config": {
    "plugins": [
      "stylelint-order",
    ],
    "extends": "stylelint-config-standard",
  },
}
```

在 Windows 和 Linux 上安装相关包后，VS Code 插件在 Windows 输出的大意是找不到 Stylelint 包，而在 Linux 上直接找不到 npm 程序本体（我只有 pnpm）。后来通过这个配置项，让 VS Code 插件寻找 pnpm 相关包：

```json [settings.json]
{
  "stylelint.packageManager": "pnpm",
}
```

这样能找到 Stylelint 包，但插件的输出换了一种报错方式，大意是找不到 `stylelint-order` 包和 `stylelint-config-standard` 包，也许要指定 `stylelint.configBasedir` 了。但我认为这是预期外的现象，因为默认配置一般都能正常工作。

### 在 Windows 下很好表现，使我的代码飘红

我移除了 `stylelint.packageManager`{lang="js"} 配置项，并尝试使用 npm 全局安装这些包，之前的问题在 Windows 上都解决了。所以 pnpm 呀，你还是把全局包交给 npm 来管理吧。

上手体验了一下。我的 CSS 代码飘红一片。修吧修吧。😢

## SSH 连接 Localhost，然后探寻 $env:PATH 的秘密

另外，我还发现换用 npm 管理全局包后，先前 SSH 环境中无法使用 `hexo-cli` 包提供的 `hexo`{lang="sh"} 命令的问题消失了。

于是，我着手研究 pnpm 全局包在远程 SSH 环境中的问题。在一次远程执行 `pnpm add -g pnpm`{lang="sh"} 后，我从报错中发现了端倪：

```log
[ERROR] The configured global bin directory "C:\Users\Zhilu\AppData\Local\pnpm" is not in PATH
```

它不在 PATH，那谁在 PATH？

### PowerShell 糕手：SSH 就测一下，到底带不带 -t？

简而言之，如果是交互式命令，就带上 `-t` 参数。起初我未使用 `-t` 参数，结果 Powershell Profile 中的 `Set-PSReadLineOption`{lang="powershell"} 因为无法启用而报错了。

我使用这行命令试图查看 SSH 环境中的 PATH：

:copy{prompt="PS>" code="ssh localhost -t &quot;echo '$env:PATH'&quot;"}

但输出一切正常，`C:\Users\Zhilu\AppData\Local\pnpm` 完好地存在于 PATH 中。

### 我这 `%pnpm_HOME%`，如履薄冰。

后来，我通过 SSH 连接后执行 `$env:PATH`{lang="powershell"}，终于露出了它的本来面目：

> C:\WINDOWS\system32;……C:\Program Files\Git\cmd;C:\Program Files\nodejs\;……<mark>%PNPM_HOME%</mark>;……C:\Users\Zhilu\AppData\Roaming\npm;C:\Program Files\Neovim\bin;C:\Users\Zhilu\go\bin;C:\ProgramData\chocolatey\bin;

看起来在本地环境中，`%PNPM_HOME%` 在 `$env:PATH`{lang="powershell"} 会被正常解析为 `C:\Users\Zhilu\AppData\Local\pnpm`，而在远程 SSH 环境中，`PATH` 中的 `%PNPM_HOME%` 项不能被正常解析。我向 pnpm 提出了 [Issue #8110](https://github.com/pnpm/pnpm/issues/8110) 反馈这个问题，<blur>我并不清楚这个奇奇怪怪的问题应该向谁反馈，但 pnpm 应当做好这些情况的兼容</blur>。不过此时仓库有 1.5k 个未关闭的 Issue，也许我提出的问题得到回复的概率很渺茫。

### 聪明一修

修复办法很简单，把 PATH 中引用的 `%PNPM_HOME%` 替换为 PNPM_HOME 对应的值 `C:\Users\Zhilu\AppData\Local\pnpm` 即可。

但这并不能解决 Stylelint 在使用 pnpm 作为包管理的情况下找不到全局插件包的问题。难道真的要用 npm 管理全局包吗？

## npm，你不准管理全局包

之前提到，在换用 npm 管理全局包后，VS Code 的 `stylelint` 插件就能找到安装的全局包了，但这仅限于 Windows 系统。Linux 下的 `stylelint` VS Code 插件也找不到通过 npm 全局安装的 `stylelint-order` 插件和 `stylelint-config-standard` 扩展。

stylelint/vscode-stylelint 仓库的 Issue [#331](https://github.com/stylelint/vscode-stylelint/issues/331) 和 [#386](https://github.com/stylelint/vscode-stylelint/issues/386) 也反馈了各种找不到路径的问题。

### Linux 下 npm 全局包的安装和索引——

简而言之，Linux 下 `npm install -g <package>`{lang="sh"} 命令要么加 `sudo`{lang="sh"}，要么遇到 `EACCES` 错误。

见 npm 官方文档给出的解决办法：[Resolving EACCES permissions errors when installing packages globally](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)。

### NVM 初探：关于终端冒出“🏠System”这件事

经过官方推荐，我尝试使用 NVM 作为 Node.js 版本管理工具。

配置完毕后，我那使用 `zsh-powerlevel10k` 主题的终端，忽然在右侧的提示栏出现了紫色的“🏠System”字样。经过一番研究，这是因为我在使用系统的 Node.js 环境。

在安装了虚拟 Node.js 版本后，重启终端，“🏠System”字样就不见了。

### 一个 dirty fix 让我思考

全局安装的 Stylelint 包似乎找不到各种东西。在 stylelint/stylelint 的另一个 Issue [#7297](https://github.com/stylelint/stylelint/issues/7297) 中，提出者给出了一个“dirty fix”：

- 创建软链接 `/usr/node_modules` 指向 `/lib64/node_modules`。
  :copy{code="sudo ln -s /lib64/node_modules /usr/node_modules"}

#### 如果 npm 被升级的话，也许就结束了吧

方法看起来很好，但我的 NVM 环境如果有升级变动的话，软链接指向的 `node_modules` 路径大概也会发生变化，所以——

NVM，再见了。我要试试这个新方法。

### 两个 dirty fix 让我不假思索

我在必应 [搜索“npm 全局安装 sudo”](https://cn.bing.com/search?q=npm+%E5%85%A8%E5%B1%80%E5%AE%89%E8%A3%85+sudo) 时，不知是幸运还是不幸，恰好被推荐了 <a href="https://lunashu.org/sudo-npm/" rel="noopener noreferrer nofollow">~~npm i -g 全局安装 sudo 消除~~</a> 这篇博文。里面提到修改部分 `node_modules` 相关目录的权限可以免 sudo 安装 npm 全局包。

试试就试试吧。

## 噫，好了，我中招了

第二天，我在 Arch Linux 上使用 Yay 滚包时，遇到了一些问题。

### 成功未半而收起笑容

- SDDM 界面可以输入密码登录，用户锁屏界面输入密码后无法解锁。
- 执行 sudo 命令时报错“/usr/bin/sudo 必须属于用户 ID 0(的用户)并且设置 setuid 位”。
- 执行 su 命令时报错“su: 身份验证失败”。

再一执行 `ll /usr/bin/su*`{lang="sh"}，一看属于 `zhilu:zhilu` 而不是 `root:root`，立马感到**坏事了！**

为什么这些文件的权限会被更改？我立刻使用 `less $HISTFILE`{lang="sh"} 工具，按 Shift+G 跳转到文件末，从后向前查看终端中输入命令的历史记录。经过查找，发现这条命令十分可疑：

```sh [可疑命令]
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

再执行 `npm config get prefix`{lang="sh"} 一看：

::alert{type="error"}
#title
npm 配置的前缀竟然是 `/usr`！

#default
所有 `/usr/bin`，即 `/bin` 下的所有程序都被修改了权限。我被一个简简单单的 `$(npm config get prefix)`{lang="sh"} 表达式蒙蔽，忽略了其中的风险。
::

众所周知，`/bin` 下的程序各有各的权限设置，修改它们权限的愚蠢程度与 `chmod -R 777 /`{lang="sh"} 相当。（另一个我听说的愚蠢的错误是在 WSL 里执行 `rm -rf /`{lang="sh"}，它并不安全，因为 Windows 文件挂载在 `/mnt` 下。）

🥺还能怎么办，修呗。

- 按照 [Arch Linux 启动引导修复](/2024/archlinux-boot-repair) 一文中的方式挂载分区、进入系统。
- 尝试恢复被修改的权限
  :copy{prompt="#" code="chown -R root:root /usr/{lib/node_modules,bin,share}"}
- 尝试恢复部分关键程序的 setuid 位
  :copy{prompt="#" code="chmod u+s /usr/bin/sudo /usr/bin/su"}
- 建议切换到自己的用户上，实在切不了就算了
  :copy{prompt="#" code="su <你的用户名>"}
  - 如果忘了自己的用户名，可以执行这个命令：
  :copy{prompt="#" code="cat /etc/passwd | grep &quot;:1000&quot;"}
- 安装权限修复工具
  :copy{code="yay -S pacman-fix-permissons"}
- 修复权限
  :copy{code="sudo pacman-fix-permissions"}

```log [pacman-fix-permissions 的输出]
……
(854/860) zram-generator 1.1.2-1
(855/860) zsh 5.9-5
(856/860) zsh-autosuggestions 0.7.0-2
(857/860) zsh-completions 0.35.0-1
(858/860) zsh-syntax-highlighting 0.8.0-1
(859/860) zstd 1.5.5-1
(860/860) zxing-cpp 2.2.1-1
==> Scan completed. Broken permissions in your filesystem:
/usr/bin/mount.cifs: 0o755 => 0o6755
/root: 0o700 => 0o750
/usr/bin/fusermount3: 0o755 => 0o4755
/usr/share/kglobalaccel/org.kde.konsole.desktop: 0o744 => 0o644
/usr/bin/ksu: 0o755 => 0o4755
/usr/lib/utempter/utempter: 0o2755 => 0o2711
/usr/bin/unix_chkpwd: 0o755 => 0o6755
/usr/bin/pkexec: 0o755 => 0o4755
/usr/bin/chage: 0o755 => 0o4755
/usr/bin/expiry: 0o755 => 0o4755
/usr/bin/gpasswd: 0o755 => 0o4755
/usr/bin/passwd: 0o755 => 0o4755
/usr/bin/sg: 0o755 => 0o4755
/usr/bin/chfn: 0o755 => 0o4755
/usr/bin/chsh: 0o755 => 0o4755
/usr/bin/mount: 0o755 => 0o4755
/usr/bin/newgrp: 0o755 => 0o4755
/usr/bin/umount: 0o755 => 0o4755
/usr/bin/wall: 0o755 => 0o2755
/usr/bin/write: 0o755 => 0o2755
==> Apply? (yes/no)
yes
=> Done!
```

### 原因竟是……网络不好

我在用安装盘修复文件权限的过程中，用朋友的电脑重新看了一眼之前的 <a href="https://lunashu.org/sudo-npm/" rel="noopener noreferrer nofollow">~~npm i -g 全局安装 sudo 消除~~</a>，发现评论区有人在谴责：

> **Chen** 2019-11-16 23:24
>
> 请您了解一下您的这篇教程会带来的问题，不要再害人了
> [arch linux论坛相关问题](https://bbs.archlinux.org/viewtopic.php?id=235650)

::quote
#icon
😾🔪
#default
为什么我当时没看见这条评论？
::

我用自己的电脑打开评论区，发现 DISQUS 评论区居然由于**网络问题**没能加载出来。再看到博客作者在文中提到（sudo 方法）“**但之后会产生一系列其他的权限问题，简直是后患无穷**”，在文中末尾用大大大标题讲（自己给出的方法）“**Have Fun～**”“**精彩！**”，简直是一种莫大的讽刺。

## 重新思考最佳实践

如果你从文章开头跳转而来，可以选择 [返回开头重新阅读](#)。

::alert{type="warning" title="写这篇文章已耗费12小时"}
这是 Wakatime 插件统计的结果，AFK 并不会增加统计时间。
::

说实话，为了 Stylelint 官方文档中未提到的配置方法，整个配置过程耗费了大量时间，并且遇到了很多 Stylelint 本体之外的问题，甚至大多还是未解决的 Issue。我只得重新思考“最佳实践”。

对于 npm 包管理：

1. pnpm 可以作为全局包管理工具，只需要在 Windows 下修改 `PATH` 为 `PNPM_HOME` 对应的值即可。
2. 在项目中，使用 npm 管理包似乎没有什么优势。
3. 我目前没有切换 Node.js 版本的需求，所以暂时不使用 pnpm env 或者 NVM 来管理环境。

对于 CSS 声明排序：

1. 继续使用 `CSScomb` 作为排序插件，这样无法支持新的 CSS 语法。
2. 使用 pnpm 在项目中而不是全局安装 Stylelint 相关包，这样会让老项目多出 `package.json` 文件和手动安装 npm 依赖的麻烦。

## 写在最后：轻量化 CSS 排序需求的未来

在这一过程中，我通过多种方式检索 VS Code 的相关插件，最终找到了 [CSS Property Sorter](https://marketplace.visualstudio.com/items?itemName=EnzoMourany.css-property-sorter) 和 [Sort CSS](https://marketplace.visualstudio.com/items?itemName=piyushsarkar.sort-css-properties) 两款插件。

在使用 CSS Property Sorter 的过程中，我发现 CSS 的多层嵌套结构会被破坏，也找到了相关的 [Issue #11](https://github.com/enzo-mourany/css-property-sorter/issues/11)，于是换用了 Sort CSS，它支持在配置文件中修改排序策略。关于 CSS 排序工具的配置，最近一段时间也许就折腾到这儿了。既然 Stylelint 全局难以配置的话，就单独给未来的项目配置吧。

::blur
直到现在，我还没有在 Windows 上成功配置 clangd 环境。
::

## 后续

文章发布后，我受到朋友的帮助，解决了上面的问题，内容在下一篇博客中。
