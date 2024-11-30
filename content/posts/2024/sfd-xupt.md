---
title: Windows 上的开源软件入门
description: 软件自由日西邮站上的一场分享，从 CLI、GUI、开源协议、GitHub 讲起，推荐了一些开源软件。
date: 2024-09-17 17:51:12
updated: 2024-09-21 14:47:02
image: https://7.isyangs.cn/24/67211d656e0ac-24.webp
categories: [经验分享]
tags: [开源, 软件自由日, 大学, 分享]
---

::alert{type="tip"}
#title
西安邮电大学校内讲座的分享大纲
#default
这是我于2024年9月21日在第21届国际**软件自由日**西邮站上的分享，主要面向**大学新生**。

手机用户可以通过右下角的 :icon{name="ph:align-right-duotone"} 按钮展开目录。
::

## 从程序讲起

在开发者的世界中，软件分为命令行程序和图形界面程序，并且前者的使用频率非常高。

### 命令行程序（CLI）

#### 命令即程序

你也许在 Windows 上使用过 `ping`{lang="cmd"} 命令检测网络连通性。

::folding{title="示例：ping 命令的输出" nopadding}
```log
PS> ping baidu.com

正在 Ping baidu.com [110.242.68.66] 具有 32 字节的数据:
来自 110.242.68.66 的回复: 字节=32 时间=27ms TTL=48
来自 110.242.68.66 的回复: 字节=32 时间=28ms TTL=48
来自 110.242.68.66 的回复: 字节=32 时间=26ms TTL=48
来自 110.242.68.66 的回复: 字节=32 时间=29ms TTL=48

110.242.68.66 的 Ping 统计信息:
    数据包: 已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)，
往返行程的估计时间(以毫秒为单位):
    最短 = 26ms，最长 = 29ms，平均 = 27ms
```
::

实际上 `ping`{lang="cmd"} 是一个程序，位于 `C:\Windows\System32\PING.EXE`，你可以通过 `Get-Command ping`{lang="powershell"} 查看到它的路径。

::alert{type="question"}
#title
系统如何找到这条命令对应的程序？
::

#### 环境变量 PATH

在命令行输入 `ping`{lang="cmd"} 命令，系统会去 `PATH` 环境变量中寻找可执行文件，并执行。

::folding{title="示例：打印 PATH 环境变量" nopadding}
```log {2}
PS> $env:PATH.Split(';') | % { echo $_ }
C:\WINDOWS\system32
C:\WINDOWS
C:\WINDOWS\System32\Wbem
C:\WINDOWS\System32\WindowsPowerShell\v1.0\
C:\WINDOWS\System32\OpenSSH\
……
```
::

同时，环境变量 `PATHEXT` 规定了执行命令时可省略的后缀（其中包含 `.EXE`），Windows 又对大小写不敏感，因此我们可以通过 `ping`{lang="cmd"} 直接访问 `C:\Windows\System32\PING.EXE`。

#### 编写自己的命令行程序

有些同学想要使用 VS Code 编写 C 语言程序，这时就需要把下载到的 `x86_64-14.2.0-release-win32-seh-ucrt-rt_v12-rev0.7z` 解压后的 `bin` 目录加入到 `PATH` 中。这个目录中含有 `gcc.exe`，VS Code 识别到后就可以调用 `gcc`{lang="sh"} 编译 C 程序。

::alert{type="question"}
#title
清楚了 `ping`{lang="cmd"} 的由来，其后的参数 `baidu.com` 呢？
::

命令行程序的参数是命令行参数，通过 `main()`{lang="c"} 函数获取。

::folding{title="示例：编写参数读取程序" nopadding}
```c [print_argv.c]
#include <stdio.h>
int main(int argc, char *argv[]) {
    printf("argc = %d\n", argc);
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\n", i, argv[i]);
    }
    return 0;
}
```

```log [程序输出]
PS> gcc -o print_argv.exe print_argv.c
PS> ./print_argv.exe arg1 arg2
argc = 3
argv[0] = C:\Users\Zhilu\test\print_argv.exe
argv[1] = arg1
argv[2] = arg2
```
::

这样，我们就实现了命令参数的读取。

#### 其他种类的命令行程序

除了最基础的命令行程序之外，还有一部分交互式命令行程序使用了 :tip[TUI]{tip="终端用户界面（Terminal User Interface），也称为基于文本的用户界面（Text-based User Interface）"}，它在基本的命令行中实现了图形化交互，一个众所周知的例子是经典的 :tip[Windows 的启动管理器]{tip="不太像？试试把网站调为深色模式！"}。

```ansi
[7m                 Windows 启动管理器                 [0m

[97m选择要启动的操作系统，或按 Tab 选择工具：[0m
（使用箭头键突出显示你的选择，然后按 Enter）

     [7mWindows 10                                   [0m
     Windows 7

[97m若要为此选择指定高级选项，请按 F8。

工具：[0m

     Windows 内存诊断

[7m Enter=选择          Tab=菜单              Esc=取消 [0m
```

Vim、nano、top 也是经典的 TUI 程序，相比于命令行程序，它具有更好的交互体验。当然，随着计算机技术的进步，图形化用户界面（GUI）开始流行。

### 图形界面程序（GUI）

顾名思义，图形界面程序就是具有图形界面的程序。大家常用的桌面软件，如 Chrome、VS Code、QQ，都是图形界面程序。

::alert{title="你知道吗"}
Windows 终端、命令行（CMD）也是图形界面程序。（参见 [Windows 控制台和终端定义](https://learn.microsoft.com/zh-cn/windows/console/definitions)）
::

#### 图形界面程序也依赖环境变量和命令行参数

你也许会想，命令行程序看起来有很多条条框框，图形界面程序能否摆脱这些“麻烦”？

可惜，答案是“不能”。

比如方才提到的 VS Code 编写 C 语言程序，需要配置**环境变量**。

再比如有一种很低级又不易被察觉的浏览器主页劫持方式：修改快捷方式**参数**。它的表现是通过桌面图标打开的浏览器会直接访问某个链接，而通过任务栏和开始菜单打开的浏览器不会。

只需要右键桌面上的浏览器图标，选择“属性”，在“目标”的末尾添加 `https://baidu.com`，再保存。现在双击桌面图标，就会直接访问百度了。

#### “认识 GUI 的方式、重要性、价值”

我在网上看到不少调侃，说一部分书籍教程具有非常良好的“防自学”特性——没有人带领教学，似乎就变得难以理解了。在计算机领域，你无需这份担忧。许多内容是开放、自由的，而不是所谓的“防自学”教程。

有一幅图给我留下了十分深刻的印象：Owura Kwadwo 是非洲的一名教师，他在黑板上画出软件界面，给学生讲授计算机科学课程。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/pS2CDmRJXTgrzHLoK6htpl4ibGBMp7ctYz8A3ghRTuDSvcefKPD8CxEeKlcLGDO5W0ic8Ys5x1MMPdB5PzbdZaicA/640
mirror: true
caption: Owura Kwadwo 在黑板上画出 Microsoft Word 界面
---
::

引用此例是为了说明，学习操作计算机，关键的一点就是认识图形界面。如果不熟悉，就如同不熟悉智能手机的人面对满屏幕的图标和入口不知所措那般，操作程序必然遇到困难。

::link-card
---
icon: https://www.criwits.top/missing/favicon.png
title: 你缺失的那门计算机课 (电子书)
link: https://www.criwits.top/missing/
---
::

推荐这本电子书，对于初次接触计算机的人来说，这是一本好且实用的入门书籍。从拆开包装到软件使用，从文件管理到系统修理，你都能在其中找到答案。特别地，这是一本开源书籍，也使用了开放的 CC BY-NC-SA 4.0 创作许可协议。

## 软件分类

### 自由软件和专有软件

> “自由软件”尊重用户的自由，并且尊重整个社区。粗略来讲，一个软件如果是自由软件，这意味着**用户可以自由地运行，拷贝，分发，学习，修改并改进该软件**。因此，“自由软件”是关乎自由的问题，与价格无关。
>
> ——[什么是自由软件? - GNU 工程](https://www.gnu.org/philosophy/free-sw.html)

> 专有软件，也叫做非自由软件，意味着软件不尊重用户的自由和社区。专有软件将其开发者或所有者置于对用户的支配地位。这种权力本身就不公正。
>
> 专有软件开始的不公正通常会导致进一步的不公正——恶意功能。
>
> ——[专有软件 - GNU 工程](https://www.gnu.org/proprietary/proprietary.html)

::alert
#title
对于自由软件的哲学争辩比较激烈，此处仅引作定义。
::

由商业公司开发的软件，通常是**专有软件**。这些软件通常具有一些不受欢迎的功能，如广告、跟踪用户、收集数据等。例如，某款两字母聊天软件被多名开发者指出会[扫描电脑硬盘](https://www.zhihu.com/question/439768601)（尤其是浏览器历史记录），被火绒实锤；某款三字购物软件也被安全机构指出[利用安卓漏洞控制手机系统](https://mp.weixin.qq.com/s/P_EYQxOEupqdU0BJMRqWsw)，达到“莫名安装、泄漏隐私、无法卸载”的目的。这些事情在开发界并不稀奇。

### 开源软件

> 开源软件是通过开放协作开发和维护的软件，通常免费提供，可供任何人使用、检查、修改和重新分发。 这与专有或闭源软件应用程序（如 Microsoft Word、Adobe Illustrator）形成对比，这些应用程序由创建者或版权所有者出售给最终用户，除非版权所有者说明，否则不能对其进行编辑、增强或重新分发。
>
> “开源”一词还泛指一种基于社区的方法，通过开放协作、包容性、透明度和频繁的公开更新来创建任何知识产权（如软件）。
>
> ——[什么是开源软件？| IBM](https://www.ibm.com/cn-zh/topics/open-source)

开源软件就是大家一起开发、共享代码的程序。简单说，就是软件的代码公开，任何人都能免费使用、修改和分发。很多常用的工具，比如 Linux、Firefox、VS Code，都是开源的。开源软件不仅免费（可能有收费的技术支持），还能学到很多编程知识，甚至有机会参与大型项目，积累经验。

::quote
世界各地的开发者一同维护一个项目，实时地添加功能、修复 bug，你也能参与其中。这样真的很酷！
::

#### 常见的开源协议

开源不是乱开，而是讲武德地开，有章法地开。这是几个常见的开源协议：

- MIT：非常宽松，只要保留原作者的版权声明，就可以随意使用、修改和分发。
- GPL（通用公共许可证）：要求修改后的软件也必须开源，并且使用同样的GPL协议。这种协议注重软件的自由分享。
- Apache 2.0：允许自由使用、修改和分发，并且提供专利权保护。但必须保留原作者的版权和声明。

#### 西邮 Linux 兴趣小组拥抱开源

西邮 Linux 兴趣小组（ https://xiyoulinux.com ）秉承自由、开放、共享（Free Open Share）的理念，热爱开源事业并参与多个开源项目。

- 组织举办了多届软件自由日活动
- 向多个开源项目贡献代码，如 Linux、Apache、CNCF
- 积极参与 Google Summer of Code、 :tip[开源之夏]{tip="中国科学院软件研究所“开源软件供应链点亮计划”"}）等开源活动
- 小组 GitHub 组织也有多个开源项目，培养计划完全开源

## 在 Windows 上使用开源软件

::quote
在你探索开源世界之前，你已经在使用众多开源软件了。
::
<!-- 我是四场分享的最后一场，一般此时领导已离席。 -->

### 访问代码托管平台

全世界最大的代码托管平台的称号当属于 GitHub。它 :tip[UGC]{tip="用户生产内容"} 的特性一方面促进了各类项目的百花齐放，另一方面又使得我们访问这个平台会遇到一些困难——不过不用担心，还是有*相对 Free* 的方法来访问这个平台。

#### 瓦特工具箱 / Watt Tookit（Steam++）

> Watt Toolkit 是由江苏蒸汽凡星科技有限公司开发与维护的 (GNU) 自由开源软件，采用 GPL v3 开源协议同时发布于 Github 及 Gitee。

它是一款免费的游戏加速工具，也能用于访问 GitHub，可以在 Microsoft Store 中下载。

#### GitHub 增强 - 高速下载

> 高速下载 Git Clone/SSH、Release、Raw、Code(ZIP) 等文件 (公益加速)、项目列表单文件快捷下载、添加 `git clone`{lang="sh"} 命令。

项目开源于 [XIU2/UserScript](https://github.com/XIU2/UserScript)，采用 GPL v3 协议。使用前需要在浏览器安装 “篡改猴” 插件。

#### 使用其下载软件

::alert
#title
参阅官方文档：[在 GitHub 上寻找灵感](https://docs.github.com/zh/get-started/start-your-journey/finding-inspiration-on-github)
::

当访问一个项目的代码仓库时，首先阅读文件目录列表下方的 :tip[README]{tip="项目自述文档"}，它有助于你快速了解项目。当项目具有 :tip[二进制发行版]{tip="能直接安装使用的软件"} 时，可以在文件目录列表右侧的 **Releases** 中下载。

::alert{type="question"}
#title
如何选择适合自己系统的发行版？
#default
- 确定操作系统，如 Windows、Linux、MacOS（darwin）。
- 确定 CPU 架构，如 x86_64、arm64。
- 新手优先选择可执行文件，如 `.exe`、`.msi`、`.dmg`。
  - 若没有则选择编译后的打包。
  - 一般没有根据 `Source code` 编译的能力。
::

安装了刚刚的 GitHub 增强插件后，你应当能在下载时看到多个地区的镜像按钮。你可以用鼠标中键点击这些链接，保留一个速度快的下载任务。

这些开源软件的作者一般没有购买微软的数字签名证书，因此下载时会提醒“通常不会下载……请在打开前确保信任……”的警告。这时你需要点击 `…` - `保留` - `显示详细信息▼` - `仍然保留`。

#### HelloGitHub

> HelloGitHub 是一个发现和分享有趣、入门级开源项目的平台。希望大家能够在这里找到编程的快乐、 轻松搞定问题的技术方案、大呼过瘾的开源神器，顺其自然地开启开源之旅。

它能帮助你探索 GitHub。项目开源于 [521xueweihan/HelloGithub](https://github.com/521xueweihan/HelloGitHub)，采用 CC BY-NC-ND 4.0 协议。也有同名微信公众号可供关注。

::link-card
---
icon: https://hellogithub.com/favicon/favicon-96x96.png
title: HelloGithub
link: https://hellogithub.com/
---
::

### 使用包管理器安装软件

#### WinGet

WinGet 是微软官方的 Windows 程序包管理器，它提供了命令行程序，允许你安装、更新和卸载 Windows 上的应用程序。以 MIT 协议开源在 [microsoft/winget-cli](https://github.com/microsoft/winget-cli)。

::pic
---
src: https://raw.githubusercontent.com/microsoft/winget-cli/master/.github/images/WingetInstall.gif
mirror: true
caption: WinGet 官方演示
---
::

::folding{title="演示：使用 WinGet"}
```log
PS> winget search qq
名称         ID           版本          匹配          源
-------------------------------------------------------------
QQ桌面版     XPFP03DHSN0… Unknown                     msstore
QQ 游戏      XP8M1HKHMV5… Unknown                     msstore
QQ音乐       XP8BWXV3XV0… Unknown                     msstore
QQ音乐UWP    9WZDNCRFJ1Q1 Unknown                     msstore
QQ浏览器     XP8LZ1TLKPX… Unknown                     msstore
QQ           Tencent.QQ.… 9.9.15.28131  ProductCode:… winget
腾讯QQ       Tencent.QQ   9.7.22.29315  Tag: QQ       winget
TIM          Tencent.TIM  3.4.8.22121   Tag: QQ       winget
QQ小程序开…  Tencent.QQD… 0.71.2402220… Tag: qq       winget
QQ浏览器     Tencent.QQB… 11.1.5155.400               winget
QQ影像       Tencent.QQI… 3.0.890.400                 winget
QQ音乐       Tencent.QQM… 20.22                       winget
QQ拼音输入法 Tencent.QQP… 6.6                         winget
QQ影音       Tencent.QQP… 4.6.3.1104                  winget
QQ五笔输入法 Tencent.QQW… 2.4                         winget
腾讯视频     Tencent.Ten… 11.101.1537.0 Moniker: qql… winget
应用宝       Tencent.Yin… 5.8.3         Moniker: qqp… winget
lx-music-de… lyswhut.lx-… 2.9.0         Tag: QQ音乐   winget
Listen1      listen1.lis… 2.32.0        Tag: qq-music winget
Listen1 Flu… listen1.lis… 2.28.0        Tag: qq-music winget

PS> winget upgrade --all
名称         ID            版本          可用          源
-------------------------------------------------------------
腾讯会议     Tencent.Tenc… 3.28.21.410   3.29.3.498    winget
哔哩哔哩直…  Bilibili.Liv… 6.3.0.7419    6.5.0.7502    winget
Go Programm… GoLang.Go     1.23.0        1.23.1        winget
Node.js      OpenJS.NodeJS 22.8.0        22.9.0        winget
Oracle VM V… Oracle.Virtu… 7.0.20        7.1.0         winget
Tailscale    tailscale.ta… 1.72.0        1.74.0        winget
QQ           Tencent.QQ.NT 9.9.15.28060  9.9.15.28131  winget
Microsoft V… Microsoft.VC… 10.0.30319    10.0.40219    winget
PowerToys (… Microsoft.Po… 0.84.0        0.84.1        winget
Moonlight G… MoonlightGam… 6.0.1.0       6.1.0.0       winget
网易云音乐   NetEase.Clou… 3.0.16.203023 3.0.17.203079 winget
Escrcpy      viarotel.Esc… 1.22.4        1.24.2        winget
飞书         ByteDance.Fe… 7.25.4        7.26.6        winget
Python 3.13… Python.Pytho… 3.13.0a5      3.13.0rc2     winget
14 升级可用。

正在安装依赖项:
此包需要以下依赖项：
  - 程序包
      Microsoft.VCRedist.2015+.x86
(1/14) 已找到 腾讯会议 [Tencent.TencentMeeting] 版本 3.29.3.498
此应用程序由其所有者授权给你。
Microsoft 对第三方程序包概不负责，也不向第三方程序包授予任何许可证。
正在下载 https://updatecdn.meeting.qq.com/……3.29.3.498.publish.exe
  █▌                              10.0 MB /  188 MB
```
::

::alert{title="相关文档"}
- Microsoft Learn：[使用 WinGet 工具安装和管理应用程序](https://learn.microsoft.com/zh-cn/windows/package-manager/winget/)
- USTC Mirror：[使用中国科学技术大学的镜像源加速下载](https://mirrors.ustc.edu.cn/help/winget-source.html)
::

::quote
你也许会羡慕 Linux 用户的终端具有炫酷的界面和方便的功能，但 Windows 也能做到这些。
::

Oh My Posh 是一个用于 Windows 终端的命令行主题管理工具。根据 MIT 协议开源在 [JanDeDobbeleer/oh-my-posh](https://github.com/JanDeDobbeleer/oh-my-posh)。

::pic
---
src: https://ohmyposh.dev/img/hero.png
width: 720
caption: Oh My Posh
---
::

::link-banner
---
banner: https://7.isyangs.cn/24/6671b766a4312-24.jpg
title: Windows 终端体验优化指南
description: 一篇优化 Windows Terminal 体验的指南，涵盖 PowerShell 增强、Oh My Posh 主题配置、集成 Git Bash 以及终端美化等方面。
link: /2024/windows-terminal
---
::

#### Scoop

Scoop 是一个 Windows 的命令行包管理器。由于少数通过 WinGet 安装的 CLI 有相对目录访问问题，我一般使用 Scoop 来安装命令行程序。

::alert{title="场内活动"}
在这一环节，我会演示通过 Scoop 安装的 CLI。
::

::folding{title="演示：使用 Scoop"}
```log [我的 Scoop 包列表]
PS> scoop list
Installed apps:

Name          Version            Source Updated             Info
----          -------            ------ -------             ----
7zip          24.08              main   2024-08-13 12:07:50
adb           35.0.0             main   2024-06-08 11:05:12
bat           0.24.0             main   2024-06-28 17:16:08
Cascadia-Code 2404.23            apps   2024-09-04 23:34:43
cloc          2.02               main   2024-08-03 15:00:10
fastfetch     2.21.1             main   2024-08-13 12:07:54
frp           0.59.0             main   2024-07-17 11:04:46
gsudo         2.5.1              main   2024-06-28 17:17:30
iperf3        3.17               main   2024-05-20 15:49:47
less          661                main   2024-07-02 20:43:53
mingw         13.2.0-rt_v11-rev1 main   2024-07-17 11:15:26
nano          7.2-22.1           main   2024-06-08 11:24:12
neofetch      7.1.0              main   2024-06-08 11:24:13
neovim        0.10.1             main   2024-07-25 23:31:09
nexttrace     1.3.2              extras 2024-08-03 15:00:16
ntop          0.3.4              main   2024-06-28 17:18:40
oh-my-posh    23.6.2             main   2024-08-13 12:08:04
scrcpy        2.6.1              main   2024-08-03 15:00:26
tcping        0.39               main   2024-06-20 15:38:05
tokei         12.1.2             main   2024-06-26 00:15:58
trid          2.24-24.08.12      main   2024-08-13 12:08:09
unzip         6.00               main   2024-08-05 23:47:14
vim           9.1.0              main   2024-06-08 11:24:30
```

这些 CLI 几乎都是 Linux 下常见的命令行程序，我通过 Scoop 安装了 Windows 版本。

```log [使用 Scoop 升级软件]
PS> scoop update *
……
Scoop was updated successfully!
fastfetch: 2.21.1 -> 2.25.0
frp: 0.59.0 -> 0.60.0
mingw: 13.2.0-rt_v11-rev1 -> 14.2.0-rt_v12-rev0
nexttrace: 1.3.2 -> 1.3.4
ntop: 0.3.4 -> 0.3.19
oh-my-posh: 23.6.2 -> 23.14.1
scrcpy: 2.6.1 -> 2.7
trid: 2.24-24.08.12 -> 2.24-24.09.18
Updating 8 outdated apps:
Updating 'fastfetch' (2.21.1 -> 2.25.0)
Downloading new version
fastfetch-windows-amd64.7z (2.6 MB) [============================] 100%
Checking hash of fastfetch-windows-amd64.7z ... ok.
Uninstalling 'fastfetch' (2.21.1)
Removing shim 'fastfetch.shim'.
Removing shim 'fastfetch.exe'.
Removing shim 'flashfetch.shim'.
Removing shim 'flashfetch.exe'.
Unlinking ~\scoop\apps\fastfetch\current
Installing 'fastfetch' (2.25.0) [64bit] from 'main' bucket
Loading fastfetch-windows-amd64.7z from cache
Extracting fastfetch-windows-amd64.7z ... done.
Linking ~\scoop\apps\fastfetch\current => ~\scoop\apps\fastfetch\2.25.0
Creating shim for 'fastfetch'.
Creating shim for 'flashfetch'.
'fastfetch' (2.25.0) was installed successfully!
Updating 'frp' (0.59.0 -> 0.60.0)
……
```
::

## 推荐一些开源软件

### 虚拟机：Oracle VM VirtualBox

::quote
在搜索引擎输入“VMware”，跳出的联想词就有“激活密钥”相关字样。与其用破解版，为何不试试免费开源的 VirtualBox？
::

如果你对虚拟机没有特殊要求，VitualBox 是最适合新手的选择之一。

### 性能监控：Traffic Monitor

> Traffic Monitor是一款用于Windows平台的网速监控悬浮窗软件，可以显示当前网速、CPU及内存利用率，支持嵌入到任务栏显示，支持更换皮肤、历史流量统计等功能。

项目采用“反996协议”开源。这个开源协议很有趣，它允许免费使用、复制、修改和分发授权作品，前提是需保留版权声明和许可证，并遵守相关劳动法律，且不得剥夺员工的相关权利。

::pic
---
src: https://gitee.com/zhongyang219/TrafficMonitor/raw/master/Screenshots/taskbar.PNG
mirror: true
width: 323
caption: Traffic Monitor 悬浮窗
---
::

你可以干掉 Windows 左下角的小组件广告，以 Traffic Monitor 代之。

- 右键开始菜单图标，选择“终端”。（“PowerShell”也行，但说明该升系统了）
- 输入命令卸载“Windows Web 体验包”（小组件广告）
  :copy{prompt="PS>" code="winget uninstall &quot;windows web experience pack&quot;"}
- 右键 Traffic Monitor，勾选“显示任务栏窗口”，取消勾选“显示主窗口”
- 你可以在“选项”-“任务栏窗口设置”里继续调整

### 屏幕录制：OBS Studio

::quote
你也许试着寻找过免费无广告的录屏软件。
::

OBS Studio 是一款免费、开源、跨平台的屏幕、视频录制及直播串流软件。采用 GPL v2 开源协议。

当然，Windows 11 自带的截图工具升级后已经支持录屏，QQ、腾讯会议、NVIDIA GeForce Experience（现已升级为NVIDIA App）也有录屏功能。

### 文件传输：LocalSend

::quote
还在用QQ、微信在自己的设备间传输大文件、大量文件吗？
::

LocalSend 是一款免费、开源、跨平台的文件传输软件。采用 Apache v2.0 开源协议。

### 安卓控制：scrcpy

这是一款通过 ADB 远程操作安卓设备的命令行工具。有 Electron 实现的图形化版本 [Escrcpy](https://github.com/viarotel-org/escrcpy/blob/main/README-CN.md)。

::pic
---
src: https://raw.githubusercontent.com/viarotel-org/escrcpy/main/screenshots/zh-CN/overview.jpg
mirror: true
caption: Escrcpy 截图
---
::

### 串流好搭档：Sunshine 和 Moonlight

::quote
超低延迟操作电脑，还支持原生手柄连接。
::

> Sunshine 是一款自托管的游戏流媒体服务器，适用于 Moonlight。它提供了低延迟的云游戏服务器功能，支持 AMD、Intel 和 Nvidia GPU 硬件编码。同时也支持软件编码。你可以通过任何 Moonlight 客户端在多种设备上连接 Sunshine。Sunshine 提供了一个 Web UI，方便你在喜欢的浏览器中进行配置和客户端配对，支持本地服务器或移动设备进行配对。

::link-banner
---
banner: https://7.isyangs.cn/24/6664009b8f999-24.jpg
title: Moonlight 串流指南
description: 服务端Sunshine设置、客户端分辨率调整、隐私屏功能实现及触摸优化。
link: /2024/moonlight-streaming-guide
---
::

## 入门，但不止于 Windows！

### 镜像站

::alert{type="question" title="什么是镜像站"}
“镜像”指的是对原始网站或软件仓库的一个完全复制版本。“换源”是指将镜像站作为软件源，通过镜像站下载软件。

为了加快下载速度、提升下载成功率，许多高校建立了镜像站，用以提供开源软件镜像、Linux 镜像源、PyPl 镜像等。淘宝、腾讯云、阿里云也提供了 npm 镜像、pip 镜像等服务。
::

#### 校园网联合镜像站

MirrorZ 提供校园网镜像站的索引和跳转服务，由教育网提供支持，能够基于地理位置快速访问各镜像站点资源。项目以 MIT 协议开源于 [mirrorz-org/mirrorz](https://github.com/mirrorz-org/mirrorz)。

::link-card
---
icon: https://mirrors.cernet.edu.cn/mirrorz.785245b4.svg
title: MirrorZ - 校园网联合镜像站
link: https://mirrors.cernet.edu.cn/
---
::

### Android

#### F-Droid

F-Droid 是一个开源的 Android 应用商店，它提供了大量自由（免费）和开源的应用。

::link-card
---
icon: https://f-droid.org/assets/favicon_AfYQ36xPEzFjJiCTyBFVmfWkajkehilUd2geASywhxM=.png
title: F-Droid - 自由开源的安卓应用商店
link: https://f-droid.org/
---
::

::alert
#title
参阅文档：[通过清华大学开源软件镜像站使用 F-Droid 软件仓库](https://mirrors.tuna.tsinghua.edu.cn/help/fdroid/)
::

#### Termux

> Termux 是一个适用于 Android 的终端模拟器，其环境类似于 Linux 环境。无需 Root 或设置即可使用。Termux 会自动进行最小安装 - 使用 APT 包管理器即可获得其他软件包。

Termux 是一个 Android 终端应用程序和 Linux 环境。通过 GPL v3 协议开源在 [termux/termux-app](https://github.com/termux/termux-app) 上。你可以在上面使用 Linux 风格的命令并管理开放环境。

::link-banner
---
banner: https://7.isyangs.cn/24/6664009d45024-24.jpg
title: Termux 简单指南
description: Termux 安装、配置 SSH，切换国内源，安装 ZSH、X11 图形界面，探索更多可能性。
link: /2023/termux-guide
---
::

::alert{title="场内活动"}
在这一环节，我会通过 SSH 演示安卓平板上的 Termux 使用。
::

#### 安装软件

::quote
在 Windows 上卸载流氓软件，不仅检验一个人的电脑素养，还尤其考察他的语文功底。

在国产手机上安装“未知来源的软件”也是如此。
::

如果你在安装手机软件时遇到困难，一般自行上网搜索就能解决问题。

### 网站

以下网站都是完全开源的，你可以在 GitHub 上找到它们。

#### CO 导航

CO 导航是由我开发的网站，为西安邮电大学学生提供网址导航服务，于2023年2月7日开始运营，是“更适合西邮宝宝体质的网址导航”。

::link-card
---
icon: https://cooo.site/favicon.ico
title: CO 导航 - 西邮导航服务
link: https://cooo.site/
---
::

#### 西邮 Wiki

西安邮电大学非官方校园生活指南，于2024年6月30日 `g0ubu1i` 带领立项，持续更新中。智邮普创、西邮 Linux 兴趣小组、隔壁小O、计科卓越等组织团体的多名成员以个人名义参与编写。

::link-card
---
icon: https://wiki.cooo.site/logo.svg
title: 西邮 Wiki - 非官方校园生活指南
link: https://wiki.cooo.site/
---
::

#### CS 自学指南

CS 自学指南由北大信科 @PKUFlyingPig 编写，旨在帮助初学者通过优质开源资源在 2-3 年内全面掌握计算机科学核心知识和技能，涵盖多种编程语言及多个重要领域，提升科研和就业竞争力。

::link-card
---
icon: https://csdiy.wiki/images/favicon.ico
title: CS 自学指南
link: https://csdiy.wiki/
---
::

#### Linux 101

Linux 101 是一份由 USTC LUG（中国科学技术大学 Linux 用户组）编写的 Linux 的基础教程，目标是引导不了解 Linux 的读者掌握基础且实用的知识并领略社区开源文化的魅力。

::link-card
---
icon: https://github.com/ustclug.png
mirror: weserv
title: Linux 101
link: https://101.ustclug.org/
---
::

::quote
Linux 和开源的大门永远向你敞开。
::
