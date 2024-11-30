---
title: 系统引导配置分享
description: 指哪里就启动哪里——在 Windows 和 Linux 系统下实现重启至特定 EFI 引导项。
date: 2024-03-01 14:06:19
updated: 2024-03-01 15:17:30
image: https://7.isyangs.cn/24/6664009916cea-24.jpg
categories: [经验分享]
tags: [教程, 系统, archlinux, Windows]
---

## 前置知识

一般来说，系统引导方式有 Legacy 引导和 UEFI 引导。其中 Legacy 引导方式较为古老，不在本篇文章的讨论范围内。

UEFI 引导中，可以有多个启动项，比如 Windows Boot Manager、Linux Boot Manager、Grub、网络启动、USB设备启动等。

而在诸如 Windows Boot Manager、Linux Boot Manager、Grub 这些启动项管理器中，也可以设置多个启动项。如果安装了多个 Windows 系统，Windows Boot Manager 中会显示多个 Windows 启动项；如果安装了 Linux 系统， Grub 中会显示 Linux 系统、Linux 系统(高级启动)，以及可能会有 Windows Boot Manager 的启动项。

## Windows 下使用脚本重启到其他系统

### 列出 EFI 启动项

:copy{prompt="PS(管理员)>" code="bcdedit /enum ALL"}

执行此命令，你会看到类似以下内容：

```
固件启动管理器
---------------------
标识符                  {fwbootmgr}
displayorder            {bootmgr}
                        {77a0d197-59c5-11ee-b0be-c8cb9e630a73}
                        {9dda157b-7ef3-11ee-b143-806e6f6e6963}
                        {f0506e71-9c73-11ed-adf2-806e6f6e6963}

Windows 启动管理器
--------------------
标识符                  {bootmgr}
device                  partition=\Device\HarddiskVolume1
path                    \EFI\Microsoft\Boot\bootmgfw.efi
description             Windows Boot Manager

固件应用程序(101fffff)
-------------------------------
标识符                  {77a0d197-59c5-11ee-b0be-c8cb9e630a73}
device                  partition=\Device\HarddiskVolume1
path                    \EFI\systemd\systemd-bootx64.efi
description             Linux Boot Manager

固件应用程序(101fffff)
-------------------------------
标识符                  {9dda157b-7ef3-11ee-b143-806e6f6e6963}
device                  partition=\Device\HarddiskVolume6
path                    \EFI\Microsoft\Boot\bootmgfw.efi
description             Windows Boot Manager

固件应用程序(101fffff)
-------------------------------
标识符                  {f0506e71-9c73-11ed-adf2-806e6f6e6963}
description             EFI USB Device

Windows 启动加载器
-------------------
标识符                  {current}
device                  partition=C:
path                    \WINDOWS\system32\winload.efi
description             Windows 11

……
```

记住你需要重启到的、形如 `{77a0d197-59c5-11ee-b0be-c8cb9e630a73}` 的 UUID，就可以编写脚本了。

### 重启到指定 EFI 启动项

```bat [reboot-to-some-entry.bat]
rem 使用管理员权限运行此脚本
%1 mshta vbscript:CreateObject("Shell.Application").ShellExecute("cmd","/c %~s0 ::","","runas",1)(window.close) && exit
rem 将 Linux Boot Manager 设置为下次启动项
bcdedit /set "{fwbootmgr}" bootsequence "{77a0d197-59c5-11ee-b0be-c8cb9e630a73}" /addfirst
rem 重启
shutdown -r -t 0
```

推荐将脚本放在用户文件夹下，因为这是终端启动、SSH连接时的默认目录，输入文件名即可运行。

## 在 Linux 下重启到其他系统

### 列出启动项

:copy{code="efibootmgr"}

执行此命令后，会得到如下所示的 EFI 启动项列表：

```
BootCurrent: 0005
BootOrder: 0001,0005,0004,2001
Boot0001* Windows Boot Manager  HD(1,GPT,04f43acd-5a75-4946-b8eb-8c2b4aa000c3,0x800,0x100000)/\EFI\Microsoft\Boot\bootmgfw.efi
Boot0004* Windows Boot Manager  HD(1,GPT,3f296803-1e98-4d7f-b76b-263785c2dcef,0x28,0x100000)/\EFI\Microsoft\Boot\bootmgfw.efi
Boot0005* Linux Boot Manager    HD(1,GPT,04f43acd-5a75-4946-b8eb-8c2b4aa000c3,0x800,0x100000)/\EFI\systemd\systemd-bootx64.efi
Boot2001* EFI USB Device        RC
```

### 重启到指定 EFI 启动项

:copy{code="sudo efibootmgr -n 四位数序号"}

### 修改 Linux Boot Manager 的下一次启动项/默认启动项

> 仅适用于使用 `systemd-boot` 启动的系统，如果你在使用 Grub，请参阅其他教程。

:copy{code="bootctl list"}

执行此命令后，可以列出如下所示的启动项列表：

```
         type: Boot Loader Specification Type #1 (.conf)
        title: Arch Linux (default) (selected)
           id: 10-arch.conf
       source: /boot//loader/entries/10-arch.conf
        linux: /boot//vmlinuz-linux
       initrd: /boot//amd-ucode.img
               /boot//initramfs-linux.img
      options: root=PARTUUID=7227604a-aca1-034d-9bd3-e17d53548a62 rw rootfstype=btrfs

         type: Automatic
        title: Windows Boot Manager
           id: auto-windows
       source: /sys/firmware/efi/efivars/LoaderEntries-4a67b082-0a4c-41cf-b6c7-440b29bb8c4f

         type: Automatic
        title: Reboot Into Firmware Interface
           id: auto-reboot-to-firmware-setup
       source: /sys/firmware/efi/efivars/LoaderEntries-4a67b082-0a4c-41cf-b6c7-440b29bb8c4f
```

使用此命令可以修改 Linux Boot Manager 的下一次启动项，若想修改默认启动项，请使用 `set-dafault` 选项。

:copy{code="sudo bootctl set-oneshot [ID]"}
