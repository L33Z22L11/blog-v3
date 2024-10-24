---
title: 西邮网安技能赛WriteUp
description: 主办方组织能力、办事水平有待提升。自此之后，作者再未参与过 CTF 赛事。
date: 2022-11-05 23:13:52
updated: 2022-12-04 22:18:50
image: https://image.baidu.com/search/down?url=https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWSpuCJ6wj9ejjZz9Dp9l0NoRjRqXjZIibsKORpAk3WFEE4k5r02cdtXQ/640
categories: [代码]
tags: [大学, CTF]
---

> 前面废话比较多，[点此跳过](#writeup)。

## 遇到的问题

### 0. 比赛报名组队：两个队长干瞪眼

比赛为三人一队，报名时可选择创建队伍或者加入他人队伍。创建队伍后，队长可以删除队员，但队长不能解散队伍并加入他人队伍。导致本人在找到“二缺一”的队伍时无法加入，最后草草“孤军奋战”了事。

### 1. 比赛事项告知：只有网安院新生群有真正参与方式

本次比赛属于校级比赛，在比赛事项告知一事上，仍有可提升的方面：**登记学分、领取奖品**的事项需要加入“比赛QQ群”，但比赛宣传海报、公众号报名指引文章、第二课堂（学校学分、活动系统）、正式比赛平台（题目、公告）上**找不到任何有关“比赛QQ群”的信息**，导致本人**无法跟进后续环节**。

### 2. 比赛复盘：要收费

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWlN2DuWkx4QegGN2iaWMibbt3G6xXDRwIHGgBww0ic9OV3hQH2tKlqWiakQ/640
mirror: true
caption: 复盘题目需要付费
---
::
举办比赛本身需要耗费大量的人力物力财力，比赛依托第三方平台，赛后一个月复盘时收费属于正常现象。**本人在答题时只留存了WriteUp，但为了撰写此文章，题目内容均作了回忆，若有偏差，敬请谅解！**

### 本人的反思

由于本人缺乏参加比赛的经验，遇到很多意料之外的情况，最后在比赛开始三个小时后不再答题。大学中的CTF竞赛一般都有对应的QQ群，后面有如果还有机会参加此类比赛，一定会尽力联系相关人员问清比赛事项。

## 解题情况

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWogpgJDsZbfjY6fNmGejeGxUHniawPLkSDFGaLnHVgD39yQnrFvAOhcw/640
mirror: true
caption: 排名
---
::
赛事设置一等奖1组、二等奖2组、三等奖3组、优秀奖5组，最后一个获奖队伍的排名为34，但由于种种原因，没有参加评奖环节。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWxGHgLN7PvGS0LXvVaQcWJ0Me8HS1qRxqhHv2nodTKLAnlOqga1aAiag/640
mirror: true
caption: 答题
---
::
比赛每队三人，但由于本人能力有限，在周围没能找到未组队的选手，最后独自一队参加比赛。

## WriteUp

### 上不了网了

题目给出了一个流量包和文本文档：

> 网络被黑客攻击了，有很多异常流量，并且发现了一串文本：
>
> \_SEWTRL\_T1S@N
>
> flag被打乱了，顺序藏在流量中

使用Wireshark打开下载的流量文件，根据提示，乱序flag的顺序就藏在流量中，筛选出ping命令，发现TTL值与1~13一一对应。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWxlySyBmXib5VYThQWiaLFT1VPqIOvasfeut9hTicBLfyaxXZjLTC1wHqw/640
mirror: true
zoom: true
---
::

按照1~13的顺序将flag连接。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW4L5wiaDtV9XTrnb5T4H8cUT0O6UJoMwP0dLqBrSPicETKBmcrxdX96Yg/640
mirror: true
width: 280px
---
::

### broken_mp4

题目给出了一段正常的MP4，和一段损坏并藏有flag的MP4。

使用十六进制编辑器对比两段视频，损坏视频的文件头有很多元数据都异常。

> 注：手动识别正常文件头部的元数据，并把对应参数填入损坏的视频的相应位置是标准的解题方式，为了节省时间，这里使用了小工具。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW4iaHIAwicF2or5nqyoSsPKtQk7OFiaqtDrvQyK7TibCge5AfvMiamvfPsmw/640
mirror: true
caption: DVR工具
---
::
使用Digital Video Repair工具，将能正常播放的视频作为样本，修复损坏的视频，得出答案。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWMOicz6JP7UibBgBLB9MLxGiakwficAjgFiaFojRaqDqVnN1vTjTHu0YoS2g/640
mirror: true
zoom: true
---
::

### 双重凯撒

题目给出了加密脚本和加密后的文本，以及提示 `key为你所在的位置`。

根据提示“key为所在的位置”，尝试将西安邮电大学的英文缩写 `XUPT` 作为 `key`，使用程序加密字符串 `flag`，发现与 `output` 前四位相同，故 `key` 正确。

> 由于此题两层凯撒加密的算法有漏洞，加密后再加密即为解密，故完成本题时没有编写反向计算脚本。

根据加密原理，加密后的字符串再次加密可以得到原文，故将 `output` 放入程序中再次加密，得到flag。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW6GNrWuOQruKuu8dYldMSrhnG8Ox830RqJibEljz43rIDFptbBetY6Vg/640
mirror: true
caption: flag
---
::
### Signin

题目给出了一个 Win32 二进制程序。

使用 IDA 打开程序，反编译为类 C 代码，得到 flag。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWVHSED0ic7zNcOqkyQPvzcUffZxibIKYhplrVVe05gcUn96qDL8hL6vVw/640
mirror: true
zoom: true
---
::

## 总结

由于本人水平有限，许多题目都走了捷径，并且由于各种原因，其他题目也没能解答，这场比赛给我的教训多于成就，在我参加的比赛中属于别具特色的类型。今后的学习中，不止要注重理论技术的学习，还要注意与人的沟通、办事的技巧，这样才能得到真正的成长。
