---
title: 电脑是你修坏的吗
description: 教室一体机性能孱弱，19班教室电脑被其他班的学生换了系统，视频展台程序打开就卡死，于是被喊来帮忙的纸鹿正好与前来维修的高中的IT凤师傅撞见……
date: 2021-04-06
updated: 2024-02-16 15:30:34
type: story
categories: [生活]
tags: [高中, 电教, 校园]
---

> [查看原文](https://mp.weixin.qq.com/s/-xGsB2wLOCO5m6hzUeQOfQ)
>
> 此文章讲述的是高中学校信息中心凤师傅**不修电脑反修展台本体**一事，有另一篇文章讲了凤师傅 [不修展台反修电脑](/2021/classroom-pc-2) 一事，供君参阅。
>
> 简介：教室一体机使用机械硬盘，性能孱弱，安装的是希沃定制的Win7。19班教室电脑被其他班的学生安装了Win10，感觉卡顿后又被另一个班的学生安装了Win8.1。此时视频展台程序打开就卡死，于是**被喊来帮忙**的纸鹿正好与前来维修的凤师傅撞见……

## 01 你在检查

老师：(对着19班电教) 开始菜单在哪？我要的是开始菜单。
> Win8.1的开始菜单变成了全屏磁贴样式，凤师傅应该是想找到“所有程序”界面。

纸鹿：(进，准备重装系统) 老师，发生什么事了？
> 这个班电脑安装的Win8.1严重卡顿，就算修复了展台程序卡死问题也会影响日常使用，所以纸鹿打算重装系统。

老师：(对着纸鹿) 开始菜单呢，怎么调不出来？

(纸鹿手势操作打开“所有程序”)

老师：希沃工具，希沃工具。电脑上怎么装了这么多东西？

纸鹿：您说的是希沃服务吗？

老师：对对对，就是希沃服务。

纸鹿：这个电脑上好像没装。

老师：对了，你是来干嘛的？

纸鹿：我是来修电脑的。

老师：你作为这个班的电教……

纸鹿：我不是这个班的电教。

老师：那你是来干嘛的？

纸鹿：我是来给这个班修电脑的。

老师：你不在你们班上自习，怎么可以乱跑呢？

纸鹿：我给班主任申请过了。

老师：那电脑就是你弄坏的？

纸鹿：不，这个系统不是我装的。

老师：你知道为什么Win 8没有大范围推广吗？就是因为它不是一个成熟的系统。算了，我检查一下教学视频展台，这个展台画面卡啊，可能是摄像头的问题，我检查调试一下。
> 系统为Win8.1，Win8连开始菜单按钮都没有。同时，实际问题为展台程序卡顿。

纸鹿：不用检查了，是程序问题，展台硬件完好。

老师：(检查展台) 这个膨胀螺栓有点松啊，好像掉了一个。(望着19班电教) 你，去我那里把电钻取来。

## 02 你想重装

纸鹿：这真的是疑难杂症，重装软件、安装高版本.NET都试过了，没什么用，重装系统吧。

老师：(再几番确定后) 好吧，那就重装系统。你还在操作什么？

纸鹿：我检查一下自带的镜像文件是否完整。
> 一体机D盘中有出厂系统镜像的备份。

老师：不用检查，直接重装就行了。

纸鹿：(继续检查) 文件大小18.5G，正常，可以重装系统。用PE盘吧，我这刚好带来了。

老师：(进入安卓设置的“关于”界面，尝试通过三击项目启动系统还原) 不用，不用PE盘。这系统自己就能还原。(继续三击各个项目，但未能启动系统还原) 嘶……怎么回事，我打电话问一下。
> 希沃一体机是安卓系统的显示器，可以操作其中插入的PC模块。
> 他点错菜单里的项目了。

(纸鹿在界面上三击某个项目，还原确认框弹出)

(老师点击确认，等待一番时间)

纸鹿：要不切到PC画面看看情况？

老师：不用，它自己就切到PC画面了，等一等就好了。

(机器没有反应，纸鹿再次三击打开系统还原确认框，展示给老师)

纸鹿：切到PC画面看看情况吧，主板蜂鸣器好像响了，应该已经重启了。

老师：画面应该会自动切换啊……怎么还没有？

纸鹿：(打开信号切换菜单) 您还是看一下吧，已经很久了。

老师：(单击切回PC画面，显示无法加载文件) 这，这是怎么回事？
> 由于电脑的硬盘分区被改动过，一体机找不到“BACKUP_OS”分区的文件了,所以纸鹿一开始就没打算使用这种方式重装系统。

## 03 你是医生

纸鹿：没事，我有PE盘。(插上PE盘，重新启动)

老师：按F7按F7按F7，唉，怎么没按上，是不是键盘有问题？

纸鹿：没事，这种情况按ESC可以直接重启。

(纸鹿进入PE系统，启动Ghost还原程序，选择GHO镜像)

老师：你点慢点，点慢点，程序都没反应了。

纸鹿：没问题的，它这是正在搜索镜像。欸，好了。(转问19班电教) 确定要重装吗？

电教：嗯。我存在感好低啊，还是下去吧。

纸鹿：(一把拉住) 不，你在讲台上看着就好。(点击确定)

老师：这进度条怎么没有动，是不是程序卡住了？
> 正式还原前程序在做准备工作。

纸鹿：正常现象，我经常修，过一会一会进度就变快了。

(老师卸下展台，准备重新安装膨胀螺栓)

老师：经常？**其他班的电脑也是你整坏的？**
> 强词夺理？岂有此理！

纸鹿：不，只有坏了我才来修。

老师：你是医生，**你能把电脑修好，也就能把电脑修坏……**

纸鹿：(打断) 您来了也是一样的操作。
> 这位老师给纸鹿留下了深刻的印象。

老师：……那这系统是你装的？

纸鹿：不是啊，我只可能拿原版的Win7装，这Win8.1是高一一个学生装的。

老师：高一？高一怎么能来这里？

纸鹿：不知道。

## 04 你是电教

纸鹿：(对19班电教) 你啊你，还真是容易被忽悠。这机子被1班电教装了Win 10，又被高一学弟装了Win 8.1，可太惨了。

电教：(捂脸) 别说了别说了。

纸鹿：不过你没有11班电教惨。据说他都好久没碰过他们班电脑了，课间都是他们班同学占着……他把某娱乐大师卸载了三次，最后还是被他们班同学装上了，拦都拦不住，唉。

电教：唉。

## 05 你在查询

(系统装毕，重新启动)

老师：你知道这台电脑的IP地址吗？

纸鹿：我算一下。
> 作为一名电教委员，纸鹿帮助其他班电教装完系统后，还会讲一些使用的注意事项，并且也能解决由于他人操作不当而产生的问题，所以给其他班电教一种装的系统“很好很稳定”的感觉。在这期间，纸鹿积累了许多安装使用系统、解决疑难杂症的经验。

(老师安装完膨胀螺栓，准备安装展台)

老师：啧，还算一下。我直接用手机查。

纸鹿：35加19等于……等于54。(设置静态IP地址，网络连接成功)

老师：诶，表格在哪？(望向纸鹿) 别乱填IP地址，会把网络搞瘫痪的。

纸鹿：我把这栋楼电脑的IP公式都推出来了。

老师：(忙着查IP地址) 是xxx.xx.xx.54……(听到这话，猛地抬头，警惕地看着纸鹿) 我们学校可没有什么IP地址公式。

纸鹿：您可以试着验证下。公式是：

```
目标字节 = 班级 - 年级 * 22 + 79
```

```bat [兼程楼教室IP获取.bat]
@echo off
title 兼程楼教室IP获取
color 0a
echo Teaching Building II IP Fetcher
echo.
set /p "grade=Input Grade: "
set /p "class=Input Class: "
set /a suffix=%class%-%grade%*22+79
echo.
echo =========================================
echo.
echo Class %class% Grade %grade% in Teaching Building II
echo.
echo             IP: 172 .  21 .  12 .  %suffix%
echo    Subnet Mask: 255 . 255 .   0 .   0
echo           CIDR:  16
echo        Gateway: 172 .  21 .   0 .   1
echo   DNS Server 1:  61 . 134 .   1 .   4
echo   DNS Server 2: 218 .  30 .  19 .  40
echo.
echo =========================================
echo.
echo Gerenated by Zhilu ^& 2305dkr
echo QQ Group:89 4656 456
echo.
pause
```
<center><small>后来纸鹿写出了IP计算脚本</small></center>

老师：(推算了几个班级的IP) 嗯，对……嗯，这个也符合……哎，这个班的IP就出问题了，算出来不对啊。

纸鹿：几班？

老师：高xx班。

纸鹿：(一番推算) 是xxx.xx.xx.xx吗？

老师：确实应该是这个，为什么我刚刚算出来不对？

纸鹿：可能是你算错了。

(班里充满了快活的空气)

老师：(不甘示弱) 还有，这个公式到底是怎么推出来的？

纸鹿：这栋楼第一个教室是高二一班，IP最后一字节是36，到高二二十二班总共占用了22个IP地址，而更高楼层的高一一班到高一二十八班占用了随后28个IP地址。我们很容易得到：
```
目标字节 = 35 + ( 2 - 年级 ) * 22 + 班级
         = 班级 - 年级 * 22 + 79
```
其中“2-年级”这里巧妙地利用了为22乘以0或1实现了高一或高二的条件判断。

老师：唉，行吧行吧。没想到你还能发现这规律，其实教室的IP就是按顺序排的。

纸鹿：那前35个IP是？

老师：隔壁教学楼教室的一体机。

纸鹿：懂了。

## 06 你谢谢我

(电脑安装完毕，班主任向老师道谢)

老师：谢什么，是这孩子给重装的系统。(离开)

纸鹿：走了，海哥。老师再见。

(电教拍了拍纸鹿的肩，班主任向纸鹿点头致意)
