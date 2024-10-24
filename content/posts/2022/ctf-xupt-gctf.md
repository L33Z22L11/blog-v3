---
title: 西邮GCTF2022-个人WriteUp
description: 西邮GCTF2022新生赛参与记录。领到了奖品，感觉不错。
date: 2022-09-28 19:40:10
updated: 2022-11-13 16:11:55
image: https://image.baidu.com/search/down?url=https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWTVjL3YA0cJOwfvEHD7TlUuc6hKE0QZqwka3qpbZdJ403WNjNDuuktw/640
zoom: true
categories: [代码]
tags: [大学, CTF]
---

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWwsjQ9HSjSpJtePhe0Vkb1JNuUWeNcotGVXj5JYWPFdxr0oGZ3ibKnAw/640
mirror: true
width: 360px
zoom: true
---
::

## Web

### 3 Sign in

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWSFfmZFCVQwH0e8iah91iapKxyxw3qNFcurGNIibibqY7Q2rrMkO7NQuCnA/640
mirror: true
caption: Sign in题目
---
::
根据 `解压测试` 判断，源码被打包到了 `/www.zip`，遂下载，解压后发现网站目录里有另一份文件，访问此路径得到 flag。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWTDJE3aYygOF6VeyBjTTvq3zvHusMIOl8elMhUDuy2eXtNlzsTAjOcw/640
mirror: true
caption: 你猜猜直接打开会得到什么？
---
::

### 4 md5

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW6hFaKWVxct4la1vMPwXrL4X8UwoeU3hmF5KMocg00Ao1HH8DA5nsOg/640
mirror: true
caption: md5题目
---
::
本题使用的是 PHP 语言 MD5 的相等判断漏洞。我所使用的 Edge 开发人员工具网络控制台不能得到预期中的结果，故使用 `curl` 来 post 参数，得到 flag。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWTVjL3YA0cJOwfvEHD7TlUuc6hKE0QZqwka3qpbZdJ403WNjNDuuktw/640
mirror: true
caption: curl命令
---
::
### 6 Method
::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWtIicxHG2ZuyRrv1qYdIjhCjdhTibFsnoFVOR3icMQqy6xyedAZLXhMfyg/640
mirror: true
caption: Method题目
---
::
在控制台使用JavaScript发送`GCTF`请求，得到的body只是把图中的`GET`改成了`GCTF`。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWPOAzZCP3ln6Qsm9yPoOoQIGJC5vXG85ca89fmEaHWfAicJTLBz6Rs7g/640
mirror: true
caption: 控制台
---
::
在网络控制台查看请求，响应头中包含了 flag。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWDrox9jCFSUicbUJ23Pvy8LAOgRictdqgA8UfIG8hQDCMzTtY3cMIaKGw/640
mirror: true
caption: 网络控制台
---
::
另外，也可使用 curl，但需要附上 `-v` 参数。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWWiaMqe4KOADrnPPQvicpMaKHRUFOjvEz1Lxata4ibeY0u1bARccUKtvxQ/640
mirror: true
caption: curl命令
---
::
### 7 Secret

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW9Sc4LicD0guR0CHEGvRibianjWFp66NmvSOm7j0CRk8NxCot8c07YFtQw/640
mirror: true
caption: Secret题目
---
::
使用Edge开发人员工具的网络条件工具伪造UA还不够，还需要伪造请求IP。

### 8 BackupFile

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWGBGxS8cZJMDDqXOicdRymRpV3KA9AF88R9DBicQVMQ9d2icQtSfDCWqGA/640
mirror: true
zoom: true
---
::

根据提示，下载 `/index.php.bak`。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWAEm8RRE27JChicUEbleGD19ExF8CWdCicawAGpSon6lhxHDpedJ4Cg8w/640
mirror: true
zoom: true
---
::

PHP 中数字与字符串判断是否不完全相等时，会将字符串转换为数字再比较，即传入的参数 `$key` 与 `$str` 的前几位数字 `2333` 比较。因此传入参数 `key=2333`，获得 flag。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW1SZZDgPJzWdkgmQaG0g2WzGDRqqUBVgvFfRumsPdQgp5Gnic2ZojotQ/640
mirror: true
caption: 传入参数key=2333
---
::
### 11 一波三折

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWYtMQIM86VYRTGrNribOOYE3AOZRwU01W5YyasXp4Gx3Nz8HY4tqHmNg/640
mirror: true
caption: 一波三折题目
---
::
根据提示查看 Cookie，访问 `flag.html` 却被重定向到百度。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWr3nJzsS3HShlbdSb89RGcmx4tbZkSIDM0gDOYF7HCExMssWwGEBUAQ/640
mirror: true
caption: 怎么被重定向了
---
::
使用 curl 可避免重定向。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWEibLfZ8V7mTyzPC02icrSPIBvdp0pApMGRy7N4Njb7GJpSqwy5T11c3Q/640
mirror: true
caption: curl命令
---
::
使用 Base64 解码工具，得到 `flag{cc9383e8-120e-11ed-9c5d-902e16798283}`。

### 50 Pocman

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWY9ZgIASZc9jtFPiahUI6KBA988od6EJDwN4lO25kFk2Q1rm7vUW1icNw/640
mirror: true
zoom: true
---
::

题目是吃豆人游戏，但我选择查看源代码，拿到 flag。

## Crypto

### 14 皈依

下载 `flag.txt`，打开得到 `flag{keyishere}`。

### 15 三山半落青山外

下载 `msg.txt`，打开得到 `bWh7YXpoZnZsbWh9c25wcGx6YW5hc24=`，使用Base64解码得到 `mh{azhfvlmh}snpplzanasn`，根据花括号位置判断使用了栅栏密码，由栏数为2解密得到 `mshn{papzlhzfavnlamshn}@`，根据凯撒密码规则反向偏移7位得到 `flag{itiseasytogetflag}`。

### 19 ezaf

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW8WJSZTYDz1m2h0D2TicKsf7vQLCDb5dB3icHccDbOUFEHvDUHxrbiaybg/640
mirror: true
caption: ezaf题目
---
::
让加密工具直接加密字符集 `a~z`，得到加密后的字符集。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW3gXib7JUgKANUEBiciawIW5KcKkCd1pMeTPBBOboPrjVwLHsUicuCZhbzg/640
mirror: true
zoom: true
---
::

使用自己编写的 HTML 字符串映射工具，还原得到 `flag{it_is_easy_right?}`。

## Reverse

### 22 sign in

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWHyFhsOVKEAIfXibibicI1buUxeQrRnSdtQWlTfVabn5AUxd1s8qsMibzaQ/640
mirror: true
zoom: true
---
::

使用十六进制浏览，碰巧翻到这里，删去无效字符后得到 `flag{hello_w0rld}`。

### 23 ezre

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW5qlfjgspRljbFM6nDMCI8gajgrldjGOXcQDrmLtKZTgYBF0rW3tIWw/640
mirror: true
zoom: true
---
::

使用DIE的字符串浏览，得到 `flag{Wow!You_find_me!}`。

## PWN

### 30 nc一下

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW1jMicEUkwohzUAa6qXBAHzzEme1p3hNg26NIibZfLbyJLyEuia9HDUoyA/640
mirror: true
caption: 好耶，是netcat
zoom: true
---
::

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW2ibxpKCpnR7a1d6iapbbR7E2Fa7DUZSgiaxCK6Ht4v87ORolzGkQ9hsiag/640
mirror: true
caption: 我信你个鬼
width: 360px
---
::

## Misc

### 38 Welcome

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWJZF8vzzaplk2nFoZSF2JRSuELGOHyiaibPZDc2D9ibYeOibfIMGQLLE0xQ/640
mirror: true
caption: Welcome题目
---
::
### 39 海绵宝宝的秘密

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWp7tzyWVicdlX9IH6mhSOwZ48HAq3gbOMJQJFE2AylGa4r9o96Ppax4Q/640
mirror: true
caption: 海绵宝宝的秘密
---
::
使用十六进制编辑器打开，发现 flag 藏在 png 文件的末尾。

### 40 开心派大星

使用提供的密码字典“密码.txt”暴力破解压缩包“开心的派大星.zip”密码。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWycUKqOhmfxsjVLzQ9O8W2wUUibRdqZL341yA0zAJAZl0pb8GP8JB9fw/640
mirror: true
caption: 暴力破解密码
---
::
解压后得到“开心的派大星.png”，使用十六进制编辑器修改png高度，得到派大星下方隐藏的文字。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWeFSKCRI6clY0O0sdjj9kib0LJWUKd36h7AiaZ84foBpM0ic0ynTMDaVFw/640
mirror: true
caption: 开心派大星
---
::
Base58 解码得 `flag{have_a_G00D_t1me!!}`。

### 41 滴滴滴

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWuVWHymSfcvHhtULzDCRlUzsOibkapMeGODs78Pk7t3MwgbutCQe2IbA/640
mirror: true
caption: dididi.wav
---
::
使用 Audacity，根据波形写出摩斯密码。（这一步也可以直接播放，边听边写。）

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWPFpr2V1Q1ybkw06yP5bGlCvTzUYSNyvf6YBZsyGXoFdiay71m3D2GuA/640
mirror: true
caption: 摩斯密码
---
::
### 42 无字天书

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWJqAbaQBljfsMqKOiasRic0wQiaEiaQ0ekGIn8BibJGldNfCG3bYhd5XgZYA/640
mirror: true
caption: 无字天书题目
---
::
使用记事本打开，发现大量零宽字符。使用零宽字符隐写工具，还原后得到flag。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWuoB9EGDVDIBO5VZWYSOwrOiaMowIgdItKZI3BsWe0QyNoic6Tvv3Allw/640
mirror: true
caption: 零宽字符隐写工具
---
::
### 43 Excel

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWWic7QpOrJFchcwMICfwa0cWyX6q76sVqw60dtV5AdpXAlt30YdxXCDg/640
mirror: true
caption: Excel
---
::
从 A2 单元格开始，向右、向下间断分布有数值 `1`，使用公式引用后可以显示，发现数值 `1` 所在的单元格组成了二维码。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWWS1XicDZr1NTNyndMGMubDzOB6L3iaGuADZZKELyS5S5ia4I6Ybu4Gt2w/640
mirror: true
zoom: true
---
::

打算使用条件格式将 `1` 显示为黑色，发现条件格式里已经给出了 Hint，将其修改到正确的区域。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWKsLAeFQQ9bnzT68Aoqvib9rG09ibObTian0RN0BK5icFGialUZVtRsPFXKg/640
mirror: true
caption: 显示二维码
---
::
修改列宽，使单元格变成方形。扫码得到 `flag{36982547439sdsd343}`。

### 44 No Password

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibW2PT77yZIuHAxVRiamicHQicxdSvNa62YKtice4CKlq3ESJh2LOMribBzwZA/640
mirror: true
caption: No Password
---
::
知识点：Zip 伪加密

预期外的解法：使用 7-Zip 打开文件，直接得到答案。

### 49 easy-game

进入游戏存档1后生成 `save1` 文件，多次存档后使用十六进制编辑器对比文件，发现 `0x00`\~`0x02` 为关卡 id，`0x03`\~`0x06` 为人物坐标 x（十进制），`0x07`\~`0x09` 为人物坐标 y（十进制）。进入新的关卡后将人物坐标修改（tp）至下一关入口。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWnjCEvF1ZDRkjKNj91jKjtqXyuMkrTxfraboVaAbvWjr0SW4NR95xqg/640
mirror: true
caption: 欸嘿我进墙了
---
::

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWMCuDvk1GdrLtjCR3o2n3FGQ4xjNnFjpiaLIULnjXRWib6ywZsHEB9Lhw/640
mirror: true
caption: 闯过第三关后得到flag
---
::

之前尝试当作 Reverse 题目，用十六进制编辑器找大图片，整了半天提取到的却是编辑器工具栏的 sprite（精灵图/雪碧图），气死我啦气死我啦气死我啦！！！最后看来，这个 flag 也是 sprite，就算提取出来也是未切分的。

### 47 可爱捏

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWm0EaRxe1y3nDqyhGxCFiaMR8RIVYlMLUqVf7WO9iaMkzibUbdY3d6Vq6g/640
mirror: true
caption: 可爱捏
---
::
使用AAEncode解密工具，得到十六进制字符串。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWTPeIkOWR8eUKp3IZga4zxib3bNLWdLvE9A8uX6C56nEc7liagBu4Fic3g/640
mirror: true
caption: 转文本
---
::
当作 ASCII 编码转换为文本，发现应该是 png 文件的十六进制编码。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWqHXQPsjPzJAkkElibvoh8oSOPUSkoMvHJp5swwyIaibxibBicsbYVBmROQ/640
mirror: true
caption: 写文件
---
::
使用十六进制编辑器将编码存入文件，得到二维码图片。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWTYYbnHibvaRVhxwibF5mK2aiaGJjgYIurlpB6U8sclILnFt9knRqtcN2w/640
mirror: true
caption: 生成图
---
::
扫码得到 `flag{cutECutecute!}`。

### 48 解方程

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWQK4kb3ib9PHv8Uy9T8ib1dCE0s7v2GFC8l2R93S5icDk5fLiaTrTiaa65uA/640
mirror: true
caption: "@代打出题人 你还接单吗？"
---
::

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fbR2djcvEqTjtOJavT3z9ibWCpXkaNK4B15EGe3rZ5OdibGjFrAsPk2OjfNvjLtVK7icBL1gIDh4Nw6g/640
mirror: true
caption: 解方程工具
---
::
使用解方程工具，得到 flag 为 `[103, 111, 111, 100, 87, 111, 114, 107, 33, 33]`，转换为十六进制，拼接得到 `676f6f64576f726b2121`，再作为ASCII码变成文本得到flag为 `goodWork!!`。

::quote
领到奖品了，是一张大鼠标垫和一本书，好耶！
::
