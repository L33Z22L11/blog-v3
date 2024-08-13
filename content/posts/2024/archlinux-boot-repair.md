---
title: Arch Linux 启动引导修复
description: 可以修复绝大多数 Arch Linux 无法启动的问题。
date: 2024-04-01 23:14:39
updated: 2024-05-29 00:27:53
cover: https://7.isyangs.cn/24/66640097e0cbb-24.jpg
categories: [经验分享]
tags: [教程, 系统, archlinux]
---

## 制作启动盘、进入并联网

参见 {% post_link 2023/archinstall-guide %} 的“安装前准备”一节。

## 挂载分区、进入系统

- 如果不了解你的硬盘分区，可以执行以下命令：
  :copy{prefix="#" code="lsblk -o+LABEL,FSTYPE"}
- 先挂载根目录所在的分区：
  - 非 BtrFS 分区
    :copy{prefix="#" code="mount /dev/[根分区] /mnt"}
  - 如果根分区使用 BtrFS，需要知道子卷名，如果没有子卷可以跳过此步
    - 可以通过先挂载 BtrFS，然后通过以下命令之一查看子卷名
      :copy{prefix="#" code="ls /mnt"}
      :copy{prefix="#" code="btrfs subvolume list /[挂载点]"}
    - 随后解除 /mnt 的挂载并重新挂载对应的子卷
      :copy{prefix="#" code="umount /mnt"}
      :copy{prefix="#" code="mount /dev/[根分区] -t btrfs -o subvol=[子卷名] /mnt"}
- 随后挂载其他分区：
  - 挂载启动分区
    :copy{prefix="#" code="mount /dev/[启动分区] /mnt/boot"}
  - 查看先前的挂载方式，有助于你的回忆
    :copy{prefix="#" code="cat /mnt/etc/fstab"}
  - 如果回忆起有其他分区，请继续挂载
- 可以将此时的挂载方式写入原系统：
  :copy{prefix="#" code="genfstab -U /mnt > /mnt/etc/fstab"}
- 随后就可以进入原系统了
  :copy{prefix="#" code="arch-chroot /mnt"}

## 修复一些可能导致无法进入的问题

- 如果忘记 `root` 用户密码，可以执行以下命令：
  :copy{prefix="#" code="passwd"}
- 同时，还可以更新一下系统的软件包，**说不定有用呢**：
  :copy{prefix="#" code="pacman -Syyuu"}
  - 如果更新缓慢，可以换源
  :copy{prefix="#" code="pacman -S reflector"}
  :copy{prefix="#" code="reflector --verbose --country China --sort rate --save /etc/pacman.d/mirrorlist"}
  - 如果提醒无法锁定数据库，可以删除锁文件
  :copy{prefix="#" code="rm /var/lib/pacman/db.lck"}
  - 如果提醒某文件已存在，可以强制覆盖
  :copy{prefix="#" code='pacman -Syu --overwrite "*"'}

## 修复引导

- 安装 Linux 包可以触发 mkinitcpio
  :copy{prefix="#" code="pacman -S linux"}
- 如果使用 systemd-boot，请执行以下命令
  :copy{prefix="#" code="bootctl install"}
  - 使用此命令检测 EFI 引导项和 Boot Loader 配置
  :copy{prefix="#" code="bootctl list"}
    - 如果屏幕显示不全，可以使用交互模式，按 q 退出
    :copy{prefix="#" code="bootctl"}
- 如果使用 grub，请执行以下命令
  :copy{prefix="#" code="grub-install"}
  - 备用命令，也可以自行在网上搜索
  :copy{prefix="#" code="grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=grub"}

## 重启

按 Ctrl-Alt-Delete 键。

更规范的方式是输入 `exit` 或按 Ctrl-D 键退出 chroot 环境，然后执行 `reboot` 命令重启。
