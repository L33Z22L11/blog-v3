---
title: Windows 安装指南
description: 使用 Ventoy、微 PE、Dism++ 安装系统，绕过账户限制并激活 Office 与 Windows，合理分区布局使数据安全有序。
date: 2023-09-24 12:00:00
updated: 2025-03-30 15:02:31
image: https://7.isyangs.cn/24/65b66289c9a2e-24.jpg
categories: [经验分享]
tags: [教程, 系统, Windows]
recommend: true
---

::alert{title="提示"}
内容使用AI辅助生成，但经过修改和验证以保证可用性。
::

> 🤖请你使用Markdown语法写一篇关于Windows安装的博客，内容大致如下:
> 1. 用Ventoy给U盘制作引导盘。
> 2. 下载微PE和Windows安装镜像。
> 3. 将重要文件备份到非C盘分区。
> 4. 使用VentoyU盘引导启动微PE。
> 5. 使用DiskGenius工具给硬盘规划EFI系统分区和Windows系统分区，分区大小设置合理。
> 6. 使用Dism++释放专业版Windows安装映像。
> 7. 使用bypass许可绕过线上激活限制。
> 8. 设置非中文用户名和空密码。
> 9. 设置Windows密码和Hello功能。
> 10. 使用Office Tool Plus安装并激活Office。
> 11. 使用HEU KMS Activator激活Windows。
> 11. 初步配置winget。
> 12. 安装驱动。
> 13. 存储分区规划:程序默认安装在C盘，个人文件独立一盘，数据如游戏、虚拟机等独立一盘。

## 给U盘安装ventoy

首先，你需要一个空的或者可以格式化的U盘，容量至少8GB。给你的U盘安装ventoy后，就可以在U盘上放置多个ISO文件，并且可以从中启动。安装ventoy的步骤如下：

- 从[这里](https://www.ventoy.net/)下载ventoy的安装程序
- 运行ventoy的安装程序，选择你的U盘，然后点击“安装”按钮
- 等待安装完成，然后点击“确定”按钮

## 下载微PE和Windows安装镜像

### 微PE镜像

- 访问[微PE工具箱下载](https://www.wepe.com.cn/download.html)下载页面。
- 下载“微PE工具箱V2.3 64位版本”，你也可以点击[山东大学镜像](https://mirrors.sdu.edu.cn/wepe/WePE_64_V2.3.exe)和[兰州大学镜像](https://mirrors.lzu.edu.cn/verify?originurl=%2Fwepe%2FWePE_64_V2.3.exe)直接下载。
- 打开安装程序，**点击右下角光盘图标**，直接生成可启动ISO文件。
- 选择输出位置到U盘，点击“立即生成ISO”按钮。

### Windows 镜像

::alert{type="warning"}
品牌笔记本一般有官方的恢复镜像，请优先使用OEM提供的镜像重装系统。
::

- 访问[Windows 11 下载页面](https://www.microsoft.com/zh-cn/software-download/windows11)。
- 在“下载 Windows 11 磁盘映像 (ISO)”一栏中选择下载“Windows 11 (multi-edition ISO)”，点击“下载”按钮。
- 在“选择产品语言”中找到“简体中文”，点击“确认”按钮。
- 点击“64-bit Download”按钮，将ISO文件下载到U盘。

## 备份文件到非C盘

在安装Windows之前，你需要备份你的重要文件到非C盘，以免在格式化C盘的时候丢失数据。你可以直接复制粘贴到其他分区，或者使用其他软件来进行备份。

## 启动 Ventoy U盘的微PE

接下来，你需要从你的ventoy U盘启动微PE，这样你就可以在没有安装Windows的情况下进行一些操作。启动微PE的步骤如下：

- 重启你的电脑，按下F12或者其他键进入启动菜单，选择你的ventoy U盘
- 在ventoy的界面上，选择你放置在U盘上的微PE的ISO镜像文件，然后按两下回车键
- 等待微PE加载完成，然后进入桌面

## 划分EFI分区和系统分区到合适大小(可选)

::alert{type="warning"}
这是一个可选步骤，如果你不熟悉硬盘分区，请不要尝试。
::

你可以使用DiskGenius重新划分EFI分区和系统分区，以便于安装Windows。EFI分区用于存放启动文件，系统分区用于存放Windows系统。划分分区的步骤如下：

- 在微PE的桌面上，运行DiskGenius，选择你要安装Windows的磁盘，比如`HD0`
- 如果你的磁盘已经有分区，你需要先删除一些分区，然后点击“保存”按钮
- 然后，你需要在磁盘的空白区域右键，选择“新建分区”，输入以下参数，然后点击“确定”按钮：
  - 分区类型：主分区
  - 文件系统：FAT32
  - 分区大小：260~520MB
  - 卷标：BOOT
- 接着，你需要在磁盘的剩余空白区域右键，选择“新建分区”，输入以下参数，然后点击“确定”按钮：
  - 分区类型：主分区
  - 文件系统：NTFS
  - 分区大小：60GB~200GB
  - 卷标：Win11
- 最后，你需要点击“保存”按钮，然后点击“确定”按钮，等待分区完成

## 使用Dism++释放Windows专业版映像

在分区完成后，你需要使用Dism++来释放Windows的映像文件到你刚刚划分的系统分区。释放映像的步骤如下：

- 在微PE的桌面上，运行Dism++，选择“文件”菜单，然后点击“释放镜像”按钮
- 点击“镜像文件路径”右边的“浏览”按钮
- 选择你放置在U盘上的Windows的ISO镜像文件，然后点击“打开”按钮
- “目标映像”选择“Windows 11 Pro”
- “安装路径”选择`C:\`
- 勾选“格式化”“添加引导”，然后点击“确定”按钮
- 等待释放完成，然后重启电脑

## 使用bypassnro绕过联网

::alert
在Windows的安装界面中，你需要使用bypassnro这个工具来绕过联网的要求，这样你就可以自己指定用户文件夹名称，而不是微软账号（+86手机号或者QQ邮箱）前5位，还可以设置非中文用户名和空密码。
::

使用bypassnro的步骤如下：

- **断开电脑所有的网络连接**
- 在Windows的安装界面中，按下`Shift + F10`键，打开命令提示符
- 输入`oobe\BypassNRO.cmd`{lang="cmd"}并按下回车，电脑会重启
- 在联网界面中，点击“我没有Internet连接”和“继续执行受限设置”

> 微软似乎已禁用BypassNRO，需要通过注册表设置键值绕过联网
>
> :copy{prompt code="reg add &quot;HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\OOBE&quot; /v bypassnro /t REG_DWORD /d 1 /f"}

## 设置非中文用户名和空密码

在使用bypassnro绕过联网后，你就可以设置非中文用户名和空密码了。设置用户名和密码的步骤如下：

- 在Windows的安装界面中，当你看到“谁将使用此电脑”这一步时，输入你想要的用户名，比如`Zhilu`，然后点击“下一步”按钮
- 在弹出的窗口中，不要输入任何密码，而是直接点击“下一步”按钮
- 在弹出的窗口中，不要选择任何安全问题，而是直接点击“跳过”按钮
- 等待Windows完成设置，然后进入桌面，**联网**

## 非全局登录微软账户

在进入Windows桌面后，你可以在Edge浏览器中登录你的微软账户，而不是在Windows的账户设置中登录。这样你就可以**避免本地账户的密码被变更为微软账户的密码**。随后，你可以设置你的Windows的密码和Windows hello，以增加你的电脑的安全性。Windows hello是一种可以让你使用面部识别，指纹识别，或者PIN码来解锁你的电脑的功能。设置密码和Windows hello的步骤如下：

- 在Windows桌面上，点击“开始”按钮，然后选择“设置”菜单，然后选择“账户”选项
- 在弹出的窗口中，选择“登录选项”菜单，然后点击“添加”按钮，输入你想要的密码，然后点击“下一步”按钮
- 在弹出的窗口中，再次输入你的密码，然后点击“完成”按钮
- 在弹出的窗口中，选择你想要使用的Windows hello的方式，比如“面部识别”或者“指纹识别”或者“PIN码”，然后按照提示进行设置
- 等待Windows hello设置完成，然后关闭窗口

## 使用Office Tool Plus安装Office

你可以使用Office Tool Plus安装Office，这是一款可以让你自定义安装Office的工具，可以让你选择你想要的Office版本，语言，组件，等等。安装Office的步骤如下：

- 访问[下载 Office Tool Plus](https://otp.landian.vip/zh-cn/download.html)页面，下载程序
- 解压并运行程序，如果缺少运行环境，可以直接运行
- 进入“部署”界面
  - “体系结构”选择“64位”
  - 打开“下载后再部署”开关
  - 点击“添加产品”按钮，选择合适的产品版本和应用程序
  - 点击“添加语言”按钮，选择合适的语言
- 点击页面顶部的“开始部署”
- 等待Office安装完成
- 按下Ctrl+Shift+P，输入下列命令之一，或者也可以去[激活入门教程](https://www.coolhub.top/archives/14#:~:text=%E8%87%AA%E5%8A%A8%E6%BF%80%E6%B4%BB%20Office)中查看：
  :copy{prompt code="ospp /inslicid MondoVolume /sethst:kms.loli.beer /setprt:1688 /act"}
  :copy{prompt code="ospp /inslicid MondoVolume /sethst:kms.03k.org /setprt:1688 /act"}
- 等待Office激活成功

## 使用HEU KMS Activator激活Windows

HEU KMS Activator是一款用于激活Windows的工具。

- 访问[HEU KMS Activator 发布页面](https://github.com/zbezj/HEU_KMS_Activator/releases)
  - 如果无法访问，你可以在微信公众号`HEU168`或者备用公众号`heu168yyds`中下载
  - 也可以看看[这篇文章](https://bbs.pcbeta.com/viewthread-1991001-1-1.html)，但不保证安全性
- **忽略安全风险，点击“更多信息”，选择“仍要运行”**
  - 打开Windows安全中心，点击“病毒和威胁防护”
  - 找到“病毒和威胁防护设置”，点击“管理设置”
  - 关闭“实时防护”
- 点击“开始”按钮，等待激活成功

## 使用winget安装常用软件并更换为USTC源(可选)

::alert
这是一个可选步骤，如果你喜欢命令行风格的程序安装/升级/卸载操作，值得一试。
::

你可以使用winget这个工具来安装一些常用的软件，这是一款可以让你从命令行安装软件的工具，可以让你快速地安装和更新软件。为了提高下载速度，你可以把winget的源更换为USTC源，这是一个由中国科学技术大学提供的镜像源。按照[USTC WinGet 源使用帮助](https://mirrors.ustc.edu.cn/help/winget-source.html)中的方法进行换源操作。

换源结束后，你可以尝试运行以下命令，学习winget的使用：

```bat
winget install 7zip
winget install vscode
winget search qq
winget upgrade --all
winget remove 7zip
```

## 安装驱动

🤔你可能已经注意到，在刚刚的操作过程中，电脑出现了一些异常反应。这是由于Windows联网后在自动安装驱动。现在，你可以补齐剩下的驱动了。

## 合理的分区使用方式

在安装软件后，你可以按照你的喜好和需求来使用你的磁盘分区。但是，我建议你遵循以下原则，以提高磁盘的性能和管理：

::link-banner
---
banner: https://7.isyangs.cn/24/669776aed29f4-24.jpg
title: Windows 空间管理/清理指南
description: “软件装D盘”是且仅是旧日的经验之谈，如果想让电脑用起来更顺手，“无为而治”或许是个好选择。
link: /2024/windows-storage
---
::

🩷最后，祝你有一个愉快的Windows使用体验，我的朋友。
