---
title: 考试时钟的升级打怪攻略
description: 为应对考试场景而开发并不断优化升级“考试时钟”网页应用的过程，从最初为解决学生看不清挂钟问题而创建，经历多次功能迭代，如增加科目倒计时、支持不同年级文理科切换、临时添加考试科目等功能。最终，这款“考试时钟”在多个年级得到广泛应用，并持续在线升级服务考试需求。
date: 2021-10-01 21:30:00
updated: 2021-11-07 14:08:00
image: https://image.baidu.com/search/down?url=https://mmbiz.qpic.cn/mmbiz_jpg/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26M22aKhJHOahC7fkdKpHsgTpQQgtia5uN4ROYAgd2bOzPD5Yzb0LOibgA/640
type: story
categories: [代码]
tags: [高中, 电教, 校园]
---

[查看原文](https://mp.weixin.qq.com/s/5yjgVwLOTYRhmXWOmBalOA)

::alert{title="野生技协TECHYES群公告"}
考试时钟是宝中各年级相互借鉴学习的产物。2021年3月19日，为照顾看不清挂钟的学生，2020级要求在考试时在班级一体机上展示时间。2021年3月23日。2019级年级张主任询问我是否可以为考试制作科目倒计时。历经几天时间，考试时钟在2019级的大型考试上与大家见面了，随后它又经过了几次升级、界面变化，如2021年4月26日使用了卡片排版。2021年6月25日，考试时钟受到2020级几名电教管理员的推荐，开始在2020级大型考试上使用。2021年8月1日，考试时钟被外部机构“借用”一次。2021年9月18日，考试时钟支持手动添加一场科目。在这期间，我学到了许多知识，也十分感谢各位的支持。
::

我没有JS基础，但我上路了。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_jpg/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26M22aKhJHOahC7fkdKpHsgTpQQgtia5uN4ROYAgd2bOzPD5Yzb0LOibgA/640
mirror: true
---
::

## 01 “沉着冷静 诚信考试”

曾经有学生使用开发者工具修改了这行字。

当我得知这个消息时，很难说清楚是什么滋味。考试时钟剩下的主体部分都是自动更新的，使用一般的方法修改过也能自动恢复。

后来，我禁用了右键和键盘，勉强不让学生调出开发者工具。

```js
oncontextmenu = onkeydown = onselectstart = function () {
    return false;
}
```

## 02 “高一”

文理分科，同时考试，但是生物的考试时间减到了90分钟。原本我是使用两个网页的，但我还想把它们整合在一起。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26uwQXSrqAB3cGgxiaribEOlqNmwNeMo4ricYwQ46RNAOhDdwdTrfXAj8Ug/640
mirror: true
---
::

对于我一个技术小白来说，需要一定的时间，后来索性高二高三文科理科全部都上了，反正功能写好，添加其他年级类型都是一行代码的事，造好轮子就能好好玩了。

```js
function change(totype) {
    // 切换类型时需要重新初始化的内容
    now = new Date();
    end = 0, progress = 0, order = 0;
    today = fixDigit(now.getMonth() + 1) + "-" + fixDigit(now.getDate());

    type = totype;
    // console.log(type);
    output("type", type);

    // 切换类型的对焦动画
    eleMain.style.filter = "blur(.5em)";
    setTimeout(function () {
        eleMain.style.filter = "blur(0)";
        updateTime();
    }, 500);
}
```

当高一入学时，我去了一趟高一年级部，向他们推荐了这个作品。

他们的反应不很正常。先是问我是不是学生会的，又问我属于哪个社团，最后还问考试时钟的控制中心在哪。

从属？是那只有百来人的学校技术交流群，还是2019级年级直属？都和考试时钟不太相属。

在哪？是我那装有系统的移动硬盘里，或是大洋之外GitHub的机房里？听起来都很不合理。

高一年级主任来了，他问：“考试时为什么要用这个？”

我如实回答：“这是年级之间相互借鉴学习的产物，2020级最先安排考试时屏幕上展示时间，随后……”

说明白了，不就是内卷嘛。
切换到“高一”时，考试时钟上还是那行字，“高一暂未启用考试时钟”。

## 03 “+ 临时”

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26pIgKjBOzFEukWd4qeG0FJ0zMLDGib2FPSB2Sx4GZyVQ6HYj0riadF3LA/640
mirror: true
---
::

这个功能的出现，来源于8月份的一个需求。

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26YnrWGnH4B8Yd2HIhucGsVOFjicV7GBLicUZJRyCRsuNxqp2YvDz7UQVA/640
mirror: true
width: 360px
---
::

调试的路已经被堵得差不多了，不好操作，当然我得亲自在后台添加科目了。

9月份，考试时钟终于支持添加临时科目了。这当然只是在尝试与学习技术而已。

```js wrap
function setTemp(sh, sm, eh, em) {
    sh = prompt("考试开始时间所在的小时", 17);
    sm = prompt("考试开始时间所在的分钟", 0);
    eh = prompt("考试结束时间所在的小时", 18);
    em = prompt("考试结束时间所在的分钟", 0);
    $(prompt("考试科目名称", "临时"),
        today + "T" + fixDigit(sh) + ":" + fixDigit(sm),
        today + "T" + fixDigit(eh) + ":" + fixDigit(em));
    alert("考试科目：" + subject + "\n起止时间：" + getClock(start) + "~" + getClock(end));
}
```

## 04 “设置”

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26LPcetHfqN3WBXnTJFlxRhniazM2Z252ZPuL83XjTg33rmwCRqYfvCIw/640
mirror: true
---
::

出于美观，时钟没有采用等宽字体，曾经出现过晚上“20:00”卡片膨胀到两行的情况；考试时有人觉得字体白色过于亮眼，有人喊反光看不清时间。最后也是为尝试与学习技术，做出了这个功能。

```html
<div><i class="bi bi-aspect-ratio-fill"></i>缩放
    <div class="selectbar">
        <a onclick="relStyle('fontSize',-0.05,'em',0.75,1.25)">－</a>
        <span id="fontSize">1</span>
        <a onclick="relStyle('fontSize',+0.05,'em',0.75,1.25)">＋</a>
    </div>
</div>
<p class="dim">非必要情况请勿修改缩放</p>
<div><i class="bi bi-circle-half"></i>对比度
    <div class="selectbar">
        <a onclick="relStyle('opacity',-0.05,'',0.5,1)">－</a>
        <span id="opacity">0.75</span>
        <a onclick="relStyle('opacity',+0.05,'',0.5,1)">＋</a>
    </div>
</div>
<p class="dim">减少光干扰，视环境光设置</p>
```
你没有看错，一个function可以同时改变两种样式。

```js
function relStyle(prop, delta, unit, minVal, maxVal) {
    propVal = Number(eleMain.style[prop].replace(unit, "")) + delta;
    propVal = Math.max(propVal, minVal);
    propVal = Math.min(propVal, maxVal);
    eleMain.style[prop] = propVal + unit;
    // 保留两位小数
    output(prop, Math.round(propVal * 1e2) / 1e2);
}
```

## 05 “调试”

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26mehLq3lf3sTzQHWvpeRyKUmeGicw21jwLXRKDw1Xlh7ZLTatzCbOgvw/640
mirror: true
---
::

只是为了测试考试时间轮换是否正常而写出来的功能。

```js wrap
if (String(location).indexOf("debug") == -1) {
    updateTime = function () {
        now = new Date();
        // 铃声校准
        // now.setMinutes(now.getMinutes() + 1);
        output("clock", getClock(now));
        updateExam();
    }
    setInterval(updateTime, 2000);
}
else {
    alert("已进入调试模式，关闭本页面可返回正常模式。")
    // 调试模式初始时间
    now = new Date("2021-09-18T15:00+08:00");
    updateTime = function () {
        // 最晚结束时间
        now > new Date("2021-09-20T19:00+08:00") ? change(type) : null;
        // 调试模式跳过夜晚
        if (now.getHours() == 19) {
            now.setHours(31);
            today = fixDigit(now.getMonth() + 1) + "-" + fixDigit(now.getDate());
        }
        // 调试模式速度设置
        // now.setMinutes(now.getMinutes() + 1);
        now.setSeconds(now.getSeconds() + 30);
        output("clock", getClock(now));
        updateExam();
    }
    setInterval(updateTime, 20);
}
updateTime();
```

## 06 “屏保预警已关闭”

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26bLneTF0W7MxS2gTbMX1TJvkZBKAtg9XPhZCPQ5xLeNxKPsY523q2wA/640
mirror: true
---
::
::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf263KJKOzpOq72iaCBuPkSuQyf15NTC4BqG95QHh9C07OUZY98YLRr9bow/640
mirror: true
---
::

屏保嘛，这种东西在考试时蹦出来让人很不舒服。

```js
onload = function () {
    // 希沃屏保剩余时间
    SCREENSAVER_TIME = 45;
    String(location).indexOf("noscreensaver") == -1
        ? setInterval(updateSST, 60000)
        : null;
}

onmousemove = onmousedown = onkeydown
    = function () { SCREENSAVER_TIME = 45; }

// 希沃屏保预警，2021-09屏保已经更换内容且被信息中心关闭
function updateSST() {
    eleSST = document.getElementById("SSTBubble");
    SCREENSAVER_TIME -= 1;
    if (SCREENSAVER_TIME < 0) {
        eleSST.style.backgroundColor = "rgba(255,255,255,.2)";
        output("SST", "已经");
    }
    else if (SCREENSAVER_TIME < 10) {
        eleSST.style.display = "flex";
        eleSST.style.backgroundColor = "#f52";
        output("SST", "在" + SCREENSAVER_TIME + "分钟后");
    }
    else {
        eleSST.style.display = "";
    }
}
```

## 07 “帮助”

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26EhE9Y48oB1xb9sqiaRufQgEqOhmokE3q9msx3Tdx93h79u3UDSAmZRg/640?
mirror: true
---
::

如图，遇到的一些意想不到的事情。

## 08 鸣谢

::pic
---
src: https://mmbiz.qpic.cn/mmbiz_png/9sIibiadwv3fakRBg1y4yOeSUKNE2Sdf26ld5srkslvdqrcYGwh9oqaIL1Nslk3fxaXDX8gfuTzgPuynt4GyiahpA/640
mirror: true
---
::

在接下任务，学习技术的过程中，我也认识了很多朋友，与许多社团建立了沟通与联系，这大约是我高中十分宝贵的经历。

当然了，点击“阅读原文”，你也可以访问到它如今的模样。也许就在一个小时后，某个角落还有一场考试呢。

::link-card
---
icon: https://exam.thisis.host/favicon.ico
title: 考试时钟
link: https://exam.thisis.host
---
::
