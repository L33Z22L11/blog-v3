---
title: 混入西工大，打 CTF 上大分！
description: 西工大第三届“探索·解密”趣味密码比赛-个人WriteUp。由西北工业大学信息安全协会负责的第三届“探索·解密”趣味密码比赛主要有Crypto、Misc方向的CTF题型，难度较易，适合入门。
date: 2022-09-06 21:02:00
updated: 2024-02-03 19:55:49
image: https://fly.webp.se/?url=https://mmbiz.qpic.cn/mmbiz_jpg/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxO0L3rLIJL5ND6KbbEBBonjHsEDXVNEW6iacNG6k39x74MAibRa9KM8Fw/0
categories: [安全]
tags: [CTF, WriteUp, 比赛复盘]
---

[查看原文](https://mp.weixin.qq.com/s/oGf660AaxTQS_10qUoUaow)

近日朋友们升入大学，纷纷购置笔记本电脑，我的消息列表就热闹了起来，但也无非安装软件、编程入门云云。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxhCN2mjo8oBibzT4ibhicJr13h1RBMVbSzpbWHpkibHhCq8je3A1AVyJrqw/640
mirror: true
caption: 小刘找到了我
densities: 1.5x
---
::

发现是西工大信安协会举办的密码学比赛，跟他简单解释了比赛要求后也没太多管。没想到，两天后他又来找我了。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxfyJqhYDHmO7cibo59vhTJSbfAyXp0xtfQfq47aS9VzvGUphEGMM7dFg/640
mirror: true
caption: 此时比赛刚刚开始
densities: 1.5x
---
::

于是我注册进入比赛系统，没想到还能混进排行榜。

下面是 WriteUp 环节。

## Section 1 签到 :badge[9.15 10:38:44]

> 欢迎来到第三届“探索解密”趣味密码比赛，请关注微信公众号：`网联三航安守四方`，发送`探索解密`来获取 flag 并填写至下方输入框内来得分！~~签完小M就不用倒立洗头啦( •̀ ω •́ )✧~~

按照操作，获得答案。

## Section 1 小猪别跑 :badge[9.15 10:40:11]

> 去年逃跑的小猪被抓到了，可怜的它被做成了：
> `BABBAAABAAABABBABBBABABABAABAAAAAABAAAAAAAABAABBBAABBAB`

根据特征搜索，判断是培根密码。使用 https://wtool.com.cn/baconian.html ，得出答案。

## Section 2 我是福瑞兽 :badge[9.15 10:45:49]

> 我是一只可爱的福瑞兽，听我说：
>`~呜嗷嗷嗷嗷呜啊嗷啊呜呜嗷呜呜~嗷嗷~啊嗷啊呜嗷嗷~嗷~嗷~呜呜嗷呜啊嗷嗷嗷呜啊呜~啊呜嗷呜呜啊啊啊~啊嗷啊呜~呜啊~~嗷~呜嗷~~啊嗷嗷嗷呜呜~啊嗷呜嗷呜呜啊~呜啊啊嗷啊呜~啊呜~~嗷~呜嗷呜嗷嗷嗷嗷嗷呜啊嗷~啊呜嗷呜呜啊呜啊啊啊嗷啊呜~~啊啊~嗷~呜嗷啊呜呜嗷嗷嗷呜啊呜啊嗷呜嗷呜呜~呜啊呜啊嗷啊呜嗷呜~呜~嗷~呜呜呜啊嗷嗷嗷嗷呜呜呜嗷啊呜嗷呜呜~呜呜嗷啊`

判断为兽语加密，使用 http://hi.pcmoe.net/roar.html ，得出答案。

## Section 1 百家姓 :badge[9.15 10:51:15]

> 你会读百家姓吗？
> `郑郑郑窦郑钱郑王王水吴王郑冯郑钱王周吴苏李钱王李吴苏王陈李赵王吴王孙吴苏郑云李周郑章郑吴李苏王章`

判断为百家姓暗号，使用 http://anhao.tlrkl.top/ ，解出以下文本：

`magnet:?xt=urn:btih:666C61677B576861745F31735F793075725F6E346D653F7D`

判断为磁力链接，打开下载工具下载，提示“Invalid info_hash”，因此不是磁力链接。尝试十六进制转换为ASCII字符串，使用 https://www.sojson.com/hexadecimal.html ，得出答案。

## Section 2 PAPER :badge[9.15 12:12:42]

> 咚咚咚，小可的门前出现了四块被撕碎的信纸和刚从泥土中连根拔起的花，看起来这朵花的根部从土壤中吸取了大的营养往上供给才开出了如此漂亮的花朵，但信纸和花有什么关系呢？
>
> 提示：通过解谜可获得一串字符S，FLAG为flag{md5(S)}。假设S为233，则FLAG为flag{e165421110ba03099a1c0393373c5b43}

下载文件，得到1.png、2.png如图。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxN3KMylXfVNZjT5ES2ZO8ThdanDuylELo1mjHZmrfV0sEXYebaQyVDg/640
mirror: true
densities: 1x
---
::

利用PS，将碎纸片拼好，发现花的根茎能与纸片上字母的位置对应。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxCZZo7LKyPTicdJpbCmbyeNOYALnyI8cbbEsuLkpviaA7xYOUy0Hk0jCg/640
mirror: true
height: 400
---
::

根据“营养往上供给”，判断字符串为“SIKMB”（但不应该是B先出土而排前面吗），使用 https://www.sojson.com/md5/ ，得出答案。

## Section 4 Notes :badge[9.15 12:15:05]

> Do You Know Music?
> `‖‖‖♬♩‖‖‖¶♯‖‖‖♬♭‖‖‖♬♫‖‖‖♫♪♯♭♪§♯♯♪♭♯♭§♪♫♬‖♩♪§∮‖§♪♬♪♬§♪♬♪♬♯‖§‖∮‖‖‖♫♫♪==`

根据特征搜索，判断为音符加密。使用 https://www.qqxiuzi.cn/bianma/wenbenjiami.php?s=yinyue ，得出答案。

## Section 1 BASE233 :badge[9.15 15:59:48]

> 聪明的小M魔改出了一种新的编码方式，你要不要来看看？

下载文件，得到base23.cpp、output.txt如下。

::folding{title="base23.cpp"}
```cpp
#include <iostream>
#include <string>

using namespace std;

static const string base233_chars = "0B7UDomA2ZtJaOFdje43G9zRX1HTnfkhwqElc{WuLPI}bsypCY5SKrQN8gMiVvx6";

string base233_encode(unsigned char const *bytes_to_encode, unsigned int in_len)
{
    string ret;
    int i = 0;
    int j = 0;
    unsigned char char_array_3[3];
    unsigned char char_array_4[4];

    while (in_len--)
    {
        char_array_3[i++] = *(bytes_to_encode++);
        if (i == 3)
        {
            char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
            char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
            char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
            char_array_4[3] = char_array_3[2] & 0x3f;

            for (i = 0; (i < 4); i++)
                ret += base233_chars[char_array_4[i]];
            i = 0;
        }
    }

    if (i)
    {
        for (j = i; j < 3; j++)
            char_array_3[j] = '\0';

        char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
        char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
        char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
        char_array_4[3] = char_array_3[2] & 0x3f;

        for (j = 0; (j < i + 1); j++)
            ret += base233_chars[char_array_4[j]];

        while ((i++ < 3))
            ret += '=';
    }

    return ret;
}

int main()
{
    const string s = "xxx";

    string encoded = base233_encode(reinterpret_cast<const unsigned char *>(s.c_str()), s.length());

    cout << encoded << endl;

    return 0;
}
```
::

``` [output.txt]
1WYq1Nb5aSOhTz9qTuOhTmvbhj==
```

虽然看不太懂，但原理应该和Base64相似，只不过编码后的文本使用的字符集是被打乱的。用我拙劣的前端水平把这些替换成正常的Base64字符集：

```js
badStr = '1WYq1Nb5aSOhTz9qTuOhTmvbhj=='
originChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
badChars = '0B7UDomA2ZtJaOFdje43G9zRX1HTnfkhwqElc{WuLPI}bsypCY5SKrQN8gMiVvx6='
originStr = ''
for (i in badStr)
    originStr += originChars[badChars.indexOf(badStr[i])]
console.log(originStr)
```

运行，得到正常的Base64字符串`ZmxhZ3syMzNfbWVhbnNfbG9sfQ==`，使用 https://www.sojson.com/base64.html ，得出答案。

## Section 2 你会求逆元吗？ :badge[9.15 16:50:10]

> 见附件。

下载文件，得到main.py如下。

```python [main.py] indent=3
flag = 'xxx'

charsets = 'abcdefghijklmnopqrstuvwxyz0123456789_{-},()/!@#$%^&*+=|<>?'

def encode(plain_text, a, b, m):
   cipher_text = ''
   for i in plain_text:
      if i in charsets:
         addr = charsets.find(i)
         cipher_text += charsets[(a*addr+b) % m]
      else:
         cipher_text += i
   print(cipher_text)

encode(flag,41,47,58)

# cipher_text = 'Auu+aspC+y!s%p+5ps$5@'
```

虽然这个也看不太懂，但应该也是对文本做了映射，先将源代码的flag设为charsets的内容，执行，得到如下字符串：

```
$4n|{ud!1k*8ra(yh%5o<-ve@2l+9sb)zi^6p>}wf#3m=_tc/0j&7q?,xg
```

搬出自己上一题刚刚写的工具，秒杀！

```js
badStr = 'Auu+aspC+y!s%p+5ps$5@'
originChars = 'abcdefghijklmnopqrstuvwxyz0123456789_{-},()/!@#$%^&*+=|<>?'
badChars = '$4n|{ud!1k*8ra(yh%5o<-ve@2l+9sb)zi^6p>}wf#3m=_tc/0j&7q?,xg'
originStr = ''
for (i in badStr)
    originStr += originChars[badChars.indexOf(badStr[i])]
console.log(originStr)
```

大写字母似乎未经过映射，照搬下来，得到答案。

## Section 2 协会招新 :badge[9.15 17:02:08]

> 西工大信安协会发出了一份招新宣传，你要不要来看看？

下载文件，得到`招新宣传.pdf`如下。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJx0iaRk8j1fd8A8CG465FTXchVPSZx6FoKZfOLugmwfc0bbVl7npuATWg/640
mirror: true
---
::

全选，复制粘贴到记事本，发现flag藏在几段文本的末尾。

```
西北工业大学信息安全协会招新宣传
协会简介
西北工业大学信息安全协会（NPUSEC）是于 2014 年成立的技术型学生社团，
致力于在学生群体中普及和交流信息安全技术，成员为不同学院不同专业的信息
安全爱好者。成立八年来，已成长为一个初具规模的学生组织，并且与信息中心
合作，共同维护校内网络安全。flag{
协会组织开展技术分享会，涉及对基础知识的培训以及对 web 渗透测试和逆
向工程等信息安全技术的交流。协会成员组建多支 CTF 团队，积极参加国内各类
CTF 比赛和各类安全方向的项目开发。W3lc0me_
信息安全协会是网络空间安全学院唯一一个下属社团，学院坚持“厚基础、
强系统、重实战、拓交叉”的培养模式，大力支持学生广泛参加具有影响力的网
络安全竞赛与实战演练活动中，在诸多国家级网安竞赛中取得了突破性佳绩，从
实战演练中锻炼和提升了学生的动手能力，着力培养实战型网安专业人才。
在信安协会，你可以
- 与志同道合的师傅一起学习、一起玩耍 T0_NP
- 与协会成员组队参与国内外各类 CTF 比赛，斩获大奖
- 了解前沿的信息安全技术，学习各类最新 0Day 与渗透姿势
- 参与各类网络安全演练活动，提升实战能力，获得丰厚奖励
- 安全大厂实习机会、行业顶尖专家讲座分享 USEC}
- 和洪师傅下棋
QQ 群
307775629
```

拼凑起来，得到答案。

## Section 3 图书馆的水下 :badge[9.15 17:13:30]

> 西工大长安校区图书馆从“航"字汲取设计灵感，力图创造出一种昂扬向上，鹰击长空的建筑形态。其四面环湖，但是你知道湖下有什么吗？

下载文件，得到`1.png`如下。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJx8OK7t3MhFkFcb3PvREa1XrjBA0TN17FoDqBGbOd0anD2RtIoG6eaTw/640
mirror: true
---
::

提示湖下有东西，并且照片一般不用png格式。经搜索，猜测png尺寸被修改。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxcs7ZZeN0UutO5hNyCqrA5J1MN7Dn4sYryHiaarXQGVKdD3SicMUt6mOQ/640
mirror: true
---
::

使用 https://hexed.it/ ，将图片的高度(0x14~0x17)从0000 08C8修改为0000 0FC8，得到被隐藏的答案。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxgVAmCT6JfmaQNQVnJaHiaDzl3WVlTwjKRO8f3ibHzLDYkSia5TpBVL7Pg/640
mirror: true
---
::

## Section 3 隐约雷鸣 :badge[9.15 17:42:03]

> 小M在看完《言叶之庭》之后久久不能忘怀，他把心里埋藏已久的秘密藏在剧中最喜欢的诗句中。
>
> 提示：请使用 WinRAR 解压压缩包。

压缩包格式选择了RAR (与其他题目不同)，并且提示需要使用WinRAR打开 (可能是考虑到电脑不自带RAR解压软件)。下载文件，由于我电脑装的是7-Zip软件，于是秒杀了。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxuVqzicCKo5G0011Vjy3XJLjlscibm3CTrrLFfjwxn7S7TzOtibBtNWj9Q/640
mirror: true
densities: 1.5x
---
::

交替数据流~~检测阳性~~，就是使用NTFS文件系统中的Alternate Data Streams技术，把一个文件当成另一个文件的影子塞进去，表面只有一个文件，实际上还有隐藏的文件，需要使用“start 原文件名:隐藏文件名”打开。使用7-Zip直接打开flag.txt:hide.txt (WinRAR不会显示，并且会把正常文件连带隐藏文件一同解压出去)，得到答案。

## Section 2 隐藏在主播背后的秘密 :badge[9.15 19:24:55]

> 小 M 发现自己每天看的主播竟然是一名大歌手，于是他专门为主播制作了一个网站并且放上了最喜欢的主播的歌。你要不要也去听一听？网址：`https://maze.qwq.cc/`
>
> 提示：
> 1. 实在不想听可以挂机3分钟。
> 2. 仅首页有题目相关信息，请勿扫描爆破，这是解谜不是web，所攻击行为均会造成甲封禁。

打开网页，等够时长，显示如下文本。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxGtFj5zxwSBqqqI6Ynz3yTSeysRcJmXloblTjVICxShaCTWibrnndOkA/640
mirror: true
densities: 1.5x
---
::

打开开发工具，发现“B站”两个字中塞入了大量零宽字符。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxEQ2rh0AgOLXBcFdD7L1lMTVOLMQYHyia45r6wibu3RlsweoBPzdElc6w/640
mirror: true
densities: 1.5x
---
::

```
Flag?：B﻿‎‌﻿‏﻿‌﻿‎﻿﻿‌﻿‏‏﻿‏﻿﻿‎‎﻿‎‎‏﻿﻿﻿‎﻿‎﻿﻿‏﻿‎‎‌﻿‏‎﻿﻿﻿‌‏‎‎‎站关注"快乐滋崩在这里"啊喵( •̀ ω •́ )✧！
```

经过搜索，查到这种加密方式 https://zhuanlan.zhihu.com/p/87919817 。使用 https://yuanfux.github.io/zero-width-web/ ，对这些不可见的零宽字符解密，得到答案。

## Section 4 黑客小子 :badge[9.15 19:31:09]

> 小M最近刚看了一篇发表于USENIX Security 2021的论文，论文发现苹果AirDrop隔空投送功能可以向陌生人泄露AirDrop发起者或接收者的电话号码和电子邮箱。小A经过一番努力，获得了隔壁室友手机在AirDrop时传输的手机号哈希值，你能帮帮他继续获得室友的手机号吗？小M只知道隔壁室友的手机卡是首批大王卡号段。
>
> Hash：d64935ee63aac7d30a734395699093b954ab1487ea4e28fa16cf7c82d44513dc
>
> flag格式：flag{13位电话号码（纯数字，含国家代码）}

国家代码为86，经搜索，首批大王卡号段为176，所以写脚本暴力枚举8617600000000~8617699999999的哈希值来匹配。

为方便查看进度和结果，选择同时输出目前号码和正确号码。

```python
import hashlib
correct=""
for data in range(8617600000001,8617700000000):
    data_sha = hashlib.sha256(str(data).encode('utf-8')).hexdigest()
    if data_sha=="d64935ee63aac7d30a734395699093b954ab1487ea4e28fa16cf7c82d44513dc":
        correct=data
    print(correct)
    print(data)
print(correct)
```

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJx8oDVicpWhxX0ticyCwiajDbuGw7wFy4l5TgbNY6ic3Nx3Xqib5eaM92umcw/640
mirror: true
caption: 显然，我没有设置中止循环的条件，有可能是因为我懒。
---
::

跑了五分钟，显示已得到答案。

## Section 3 键盘中的爱讯号 :badge[9.15 19:33:59]

> 小明与女朋友吵架了，女朋友给小明了一张小纸条，说只要小明能读懂这句话的意思就和小明和好，你能帮帮小明吗？附件：
>
> 提示：
> 1. 纸条中的内容像是某种编码方式。
> 2. 再看看标题！

下载，得到小美的纸条.txt。

``` [小美的纸条.txt]
. . . .    .－.   －. .    . . .－
－   . .－.   . . .－   －. . .   . . . .   －.－－
.－.   . .－.   . . .－   －－.   －.－－
－. . . .   －   . .－.    . .－   . . . .   －. . .
－.－－   －－.   －.   －－.
```

判断为摩斯密码，使用 https://www.lddgo.net/encrypt/morse ，逐行解密得到文本如下。

```
HRDV
TFVBHY
RFVGY
6TFUHB
YGNG
```

正当我百思不得其解时，我又来了个神操作，问朋友进了比赛官方群，群里一份文件赫然醒目。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxnJNDHn6BBqWOcicJoc9b3LrJFXzOggXsPH5rJu3Mv3jmMciaP7GqTbSA/640
mirror: true
densities: 1.5x
---
::

题目怎么解我是看不来，但是答案知道了。

```
. . . .    .－.   －. .    . . .－
－   . .－.   . . .－   －. . .   . . . .   －.－－
.－.   . .－.   . . .－   －－.   －.－－
－. . . .   －   . .－.    . .－   . . . .   －. . .
－.－－   －－.   －.   －－.

改后：
. . . . .（5）   .－.(R)   －. .(D)    . . .－(V)                                                     组成l     （第一个字符5  把. . . .改为 . . . . .）
－（T）   . .－.（F）  . . .－（V）   －. . .（B）   . . . .（H）   －.－－（Y） 组成o
.－.(R)   . .－.(F)   . . .－(V)   －－.(G)   －.－－(Y)                                        组成v
－. . . . （6）  －(T)   . .－.(F)    . .－(U)   . . . .(H)   －. . .(B)                         组成e
－.－－(Y)   －－.(G)   －.(N)   .－－－(G)                                                   组成u      （最后一个字符J把- - . 改为.－－－）
```

火速提交loveu，下一关[/doge]。

## Section 4 白鸟过河滩 :badge[9.15 20:02:03]

> 风把我不想知道的事情告诉我🎶河把我不想忘记的故事也带走🎶
> [点击播放完整曲目](https://www.bilibili.com/video/BV19Z4y1b7qe)

下载文件，得到歌词.txt如下。

::folding{title="歌词.txt"}
```
55m96bif6L+H5rKz5rupDW==
5rSb5aSp5L6dL2lsZW0N
6aOO5oqK5oiR5LiN5oOz55+l6YGT55qE5LqL5oOF5ZGK6K+J5oiRDW==
5rKz5oqK5oiR5LiN5oOz5b+Y6K6w55qE5pWF5LqL5Lmf5bim6LWwDW==
5oiR5pGY5LiL5oiR55qE57+F6IaADc==
5a6D5Y+Y5oiQ55m96bifDW==
55m96bif5oiR55qE55m96bifDR==
6YCG552A6aOO5Y675ZCnDW==
6aOe6L+H5rKz5rupDX==
5oyl5LiA5oyl5LiA5Y675LiN5Zue6L+YDX==
5LiA5Y675LiN5Zue6L+YDb==
6aOO6LW35rC06LW36Zq+6Z2g5bK4DV==
55m96bif55m96bifIOS4jeimgeWbnuWktOacmw1=
5L2g6KaB5pu/5oiR6aOe5Y676YKj5Zyw5pa5DV==
5LiA5Y676YKj5Zyw5pa5DX==
6YKj5piv5L2g5oiR5YWx5ZCM5pWF5LmhDd==
5oqT5L2P5ZKM5oqT5LiN5L2P55qE54Wn54mHDS==
5ZOq5byg5pu0576ODd==
5Y676L+H5ZKM5rKh5Y676L+H55qE5Zyw5pa5Db==
5ZOq6YeM5pu06L+cDY==
55m96bifIOaIkeeahOeZvem4nw3=
5L2g6KaB6aOe5b6X5pu06auYIOS4jeimgeWbnuadpQ0=
6Iul6L+Y5oOz5LiO5oiR55u46KeBDR==
5bCx5p2l5oiR55qE5qKm6YeM6L65Dd==
55m96bif6L+H5rKz5rupDd==
5oyl5LiA5oyl5LiA5Y675LiN5Zue6L+YDX==
5LiA5Y675LiN5Zue6L+YDd==
6aOO6LW35rC06LW36Zq+6Z2g5bK4Da==
55m96bif55m96bifIOS4jeimgeWbnuWktOacmw1=
5L2g6KaB5pu/5oiR6aOe5Y676YKj5Zyw5pa5DW==
5LiA5Y676YKj5Zyw5pa5Dc==
6YKj5piv5L2g5oiR5YWx5ZCM5pWF5LmhDT==
5Yir5Zue5p2lDT==
5oiR5bCG57uI56m26aG65rWB5YWl5aSn5rW3DW==
6aG65rWB5YWl5aSn5rW3Dd==
5rW35LiN6Zeu5oiR5LuO5L2V5aSE5p2lDT==
6ZW/6aOO6ZW/6aOO6aOY5Zyo5bGx5rW36Ze0Df==
55m96bif55m96bif5bGV57+F5YWl6IuN5aSpDX==
5LiA5Y675YWl6IuN5aSpDd==
6IuN5aSp6L+c5Zyo5rW36IOM6Z2iDQ==
5LiA5Y675YWl6IuN5aSpDQ==
6IuN5aSp6L+c5q+U5rW35pu06L+c
```
::

判断为Base64编码，使用 https://c.runoob.com/front-end/693/ 可以整段解码。根据Base64编码原理，Base64中间不会出现等号占位符，所以等号附近可能有隐藏信息。
使用 https://blog.csdn.net/qq_51550750/article/details/122813934 提供的程序，很快拿到了隐藏的答案。

## Section 1 DICE :badge[9.15 21:32:49]

> 最近小可身边的怪事一件接一件，而今天小可收到了九个奇怪的骰子，但是它们看起来不是用来玩的。。。
>
> 提示：通过解谜可获得一串字符S，FLAG为flag{md5(S)}。假设S为233，则FLAG为flag{e165421110ba03099a1c0393373c5b43}

下载，得到 `1.png`、`2.png` 如下。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxsK3ceFN4bpVr2zxdyibkBzMM01YiaLuWFRK0MQeJyLcibHtIkDPic1cm4A/640
mirror: true
densities: 1x
---
::

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxMPuCt6aJk2olkZt6JVQpqueUzwDMgPFicia2WzsuPfHG5DenFrxSmI6w/640
mirror: true
densities: 1x
---
::

在PS中拼好。吐槽一句：太难拼了，有许多次线条可以完美对上，但是整体会错位。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxamDHEibTSOUVQ2t8cZr4icDGUYlkmTM0yZ7CZgm8R4qoFM8F4qQlibh7A/640
mirror: true
densities: 1x
---
::

## Section 1 与魔对谈 :badge[9.16 12:59:48]

> 彼岸两生花，佛魔一念间。佛曰：善，魔曰：恶。那么，
>
> 魔曰：波罰無梵者沙曳缽阿怯諦心諳穆奢般藝數諳是侄不諳除皤度缽漫冥不諳參曳至俱特世皤顛呐無礙亦羯梵怛哆提殿皤是密冥除俱亦哆勝呐竟娑缽尼諳咒怯尼冥勝梵亦數竟梵漫除闍奢
>
> 是什么意思呢？

“佛曰：善，魔曰：恶。”佛魔语言相反，因此将魔说的内容倒序。

> 佛曰：奢闍除漫梵竟數亦梵勝冥尼怯咒諳尼缽娑竟呐勝哆亦俱除冥密是皤殿提哆怛梵羯亦礙無呐顛皤世特俱至曳參諳不冥漫缽度皤除諳不侄是諳數藝般奢穆諳心諦怯阿缽曳沙者梵無罰波

使用 https://ctf.bugku.com/tool/todousharp ，解出答案。

## Section 3 校歌 :badge[9.16 18:40:04]

> 你还记得校歌怎么唱么？来试试：
>
> 翔巍北辈生先厚炼重飞-盛勇万岳巡天飞方-泽 国 梁
>
> Hint：-代表休止哦~

下载附件，得到校歌图片。

::pic
---
src: https://pic.baike.soso.com/ugc/baikepic2/0/20230422171906-1719590246_bmp_706_750_1590054.jpg/
caption: 校歌.jpg(点击放大)
---
::

```
翔巍北辈生先厚炼重飞－盛勇－万岳巡天飞方－泽国梁
２５６６２４６１１４０７３０６３２３４５０１２５
```
将提示中的文本与简谱上的数字对应，休止符换成简谱写法的0，得到以上八进制字符串。

```python
hex(0o256624611407306323450125)
#'0x5765313076334e5055'
```

使用 Python 转换为十六进制，再使用 https://www.sojson.com/hexadecimal.html 将十六进制转换为字符串，得到答案。

## 写在最后

至此，整个西北工业大学信息安全协会负责的第三届“探索解密”趣味密码比赛已经圆满结束。协会的学长学姐十分热情，即使我不是指定的参赛选手，也能得到他们的欢迎和耐心解答。感谢这位打工人学长和韩学姐，也感谢各位为了比赛默默付出的同好。Respect~

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fZKkd6byLH93QsQDWyGNaJxkHe6xGhJeRReACvRQ9nFSX0kyoq4ONgZegNBibl06Vc9TzSUEzXlJYA/640
mirror: true
densities: 1.5x
---
::
