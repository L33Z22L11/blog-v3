---
title: 配置并差点运行不了 Java Applet
description: 为了完成大学《Java 语言程序设计》课程的实验报告，尝试配置旧版 Java 环境并成功运行 Java Applet，最终认为实际应用价值有限。
date: 2024-09-26 09:12:42
updated: 2024-09-27 00:34:28
image: https://7.isyangs.cn/24/680072e950ccf-24.webp
categories: [经验分享]
tags: [大学, Java, 问题, 兼容]
references:
  - title: Java / OpenJDK 国内镜像站指路 & 发行版简介
    link: https://magma.ink/posts/java/
---

## PPT：勾起疑惑

我向来不惮以最宽容的过时预期揣测大学教材和课件。包括但不限于——

- 2022 年秋《高级语言程序设计 (C)》
  - 使用1998年发布的微软 VC 6.0 开发环境
  - 学校编写的教材使用了大量的非标准写法 `void main()`{lang="c"}，此写法在 2000 年代初逐渐废弃
- 2024 年春《面向对象与 C++ 程序设计》
  - 课程使用谭浩强的《C++ 程序设计（第4版）》
<!-- - 上机实验时老师曾疑惑学生编写的函数中为何使用 `&` 引用传递字符串参数 -->
- 2024 年秋《Java 语言程序设计》
  - 课件中讲述配置2004年发布的 Java 5 SDK 1.5.0 环境
  - 课件介绍2000年代中期被逐渐取代的 Java Applet

::tab
---
tabs: [Java 环境配置, Java 程序分类, ]
center: true
---
#tab1
> 3、Java开发环境
>
> 设置环境变量：
>
> - PATH=`C:\Program Files\Java\j2sdk1.5.0\bin`（与JDK的安装目录有关）
> - CLASSPATH=`C:\Program Files\Java\j2sdk1.5.0\lib;.`（与JDK的安装目录有关，`.`代表当前目录）
> - 环境变量设置途径：Windows NT/2000/XP：控制面板→系统→高级→环境变量

#tab2
> 4、Java程序
>
> - Java应用程序（Java Application）
> - Java小程序（Java Applet）
>
> 如何区分？
> - 前者有`main()`{lang="java"}方法，后者没有`main()`{lang="java"}方法
::

听到别人讲述这些事情时，我只感到幸灾乐祸，但当这一切发生在自己身上时，我便无话可说、无言以对也无可奈何了。

## 第一次 Java 上机实验

2024 年秋《Java 语言程序设计》的第一次上机实验，需要以代码块填空的方式完成 `HelloWorld`、简单 Java Applet 和联合编译任务。

我的电脑中有微软的 OpenJDK 17 和 21，只需要在 VS Code 中安装 `Language Support for Java(TM) by Red Hat` 扩展即可满足简单的代码编写需求。

OpenJDK 17 默认使用 ANSI 编码（GB2312/GBK/GB18030），在我的 PATH 环境变量中，其优先级高于默认使用 UTF-8 编码的 OpenJDK 21。

为正常输出结果，有以下方法：

- 将文件编码设置为 ANSI（GB2312/GBK/GB18030）
- 提升 PATH 环境变量中的 Java 21 的优先级
- 在编译时通过 `javac -encoding UTF-8`{lang="sh"} 手动指定字符编码

说干就干，我很快完成了 `HelloWorld` 任务，但是我在 Java Applet 代码瞥见弃用提示，又在网上查到它需要**在 IE 内运行**，便瞬间不淡定了。

虽然我按照要求写好了代码，并使用一定手段启动了 IE，但并没有达到预期结果。

后来许多同学向老师反映，才**取消了 Java Applet 实验任务**。

::quote
#icon
🤔
#default
竟然还要用 IE 浏览器？我倒要看看这环境到底有多难配！
::

## 大战 Java Applet 环境

::alert{type="error" title="禁止用于教学"}
Java Applet 在20世纪90年代兴起，2000年代中期被其他技术取代，自2017年 Java 9 发布后已不再支持。

严禁将本部分内容用于**课程教学**目的，学生应当学习现代计算机知识。
::

### 安装旧版 JDK

#### 官网下载（没成功）

如果只是运行 Java Applet，可以下载 [Java 8 运行环境 `jre-8uxxx`](https://www.java.com/zh-CN/download/)。

从甲骨文官网的存档 [下载 Java SE 8 (`JDK 8u211` 之后的版本)](https://www.oracle.com/cn/java/technologies/javase/javase8-archive-downloads.html) 时，必须注册 Oracle 账号并提供多项个人信息（包括电子邮件地址、国家/地区、姓名、英文姓名、职位、办公电话、公司名称、地址、城市、省/自治区/直辖市、邮政编码，均为必填项），以防止新的开发人员使用这种过时的 JDK 进行开发。

#### 通过镜像站下载社区构建版

当然，你可以通过清华大学开源软件镜像站下载 Adoptium OpenJDK 8。安装、下载都十分方便。

::link-card
---
icon: https://mirrors.tuna.tsinghua.edu.cn/static/img/favicon.png
title: Adoptium OpenJDK 8 - 清华大学开源软件镜像站
link: https://mirrors.tuna.tsinghua.edu.cn/Adoptium/8/jdk/x64/windows/
---
::

安装后，它会自动配置自身到系统 PATH 环境变量的最高优先级。

### 编译 Java Applet

- 编写 Java Applet 代码
```java [FirstApplet.java]
import java.applet.*;
import java.awt.*;

public class FirstApplet extends Applet {
    public void paint(Graphics g) {
        g.setColor(Color.blue);
        // 【代码1】在 Java Applet 中绘制一行文字：“这是一个 Java Applet 程序”
        g.drawString("这是一个 Java Applet 程序", 50, 50);
        g.setColor(Color.red);
        g.setFont(new Font("宋体", Font.BOLD, 36));
        // 【代码2】在 Java Applet 中绘制一行文字：“我改变了字体”
        g.drawString("我改变了字体", 50, 100);
    }
}
```
- 确认编译环境为 Java 8（`1.8.0_xxx`）
:copy{prompt="PS>" code="javac -version"}
- 编译为 `.class` 文件
:copy{prompt="PS>" code="javac -encoding UTF-8 FirstApplet.java"}
- 编写 HTML 代码
```html [fitst-applet.html]
<applet code="FirstApplet.class" width="300" height="300"></applet>
```

### 运行

#### 通过 IE 运行（没成功）

可以把这个脚本放在用户目录下，方便从“运行”或终端启动 IE 浏览器。

```vb [openie.vbs]
CreateObject("InternetExplorer.Application").Visible=true
```

通过 IE 浏览器打开网页，提醒“您正在查看的页使用 Java”。根据 Java 官网的 [IE 支持](https://www.java.com/zh-CN/download/help/ie_tips.html)，出现此提示是因为未注册 Java 插件。

即使安装了 Oracle JRE 8，控制面板里出现了相关项，也无法在 IE 中查看 Applet；我也按照官网的 [在浏览器中启用 Java](https://www.java.com/zh-CN/download/help/enable_browser.html) 检查了本地设置，最后放弃了。

#### 通过 Applet 查看器

正当我打算放弃的时候，我忽然发现了 Applet 查看器（`appletviewer`{lang="sh"}）。上文提到的 Adoptium OpenJDK 8 带有这个工具。于是，很容易地：

:copy{prompt="PS>" code="appletviewer fitst-applet.html"}

> :tip[这是一个 Java Applet程序]{tip="当然，这里是前端和 MDC 语法的实现" style="color: #37f"}
>
> [我改变了字体]{.text-story style="color: #f35; font-size: 2em; font-weight: bold"}

## 写在最后

::quote
#icon
😡
#default
谁真照着做我笑谁。成功了算你厉害。
::

开始写文章时，我看了一眼 PPT 的属性。文件创建于 `2001-09-06 12:05`，“公司”为`北京大学计算机系`。

写完文章时，我看了一眼实验报告 Word 的属性。文件最后一次打印于 `2006-10-31 23:40`，“标题”是 `中 药 药 理 实 验 指 导`。

确实需要一剂猛药。
