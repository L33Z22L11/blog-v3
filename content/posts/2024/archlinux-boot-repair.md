---
title: Arch Linux 启动引导修复
description: 可以修复绝大多数 Arch Linux 无法启动的问题。
date: 2024-04-01 23:14:39
updated: 2025-03-04 22:30:59
image: https://7.isyangs.cn/24/66640097e0cbb-24.jpg
categories: [经验分享]
tags: [教程, 系统, archlinux]

references:
  - title: systemd-boot - Arch Linux 中文维基
    link: https://wiki.archlinuxcn.org/wiki/Systemd-boot
---

## 制作启动盘、进入并联网

参见 [使用 ArchInstall 安装 Arch Linux](/2023/archinstall-guide) 的“安装前准备”一节。

## 挂载分区、进入系统

- 如果不了解你的硬盘分区，可以执行以下命令：
  :copy{prompt="#" code="lsblk -f"}
- 先挂载根目录所在的分区：
  - 非 BtrFS 分区
    :copy{prompt="#" code="mount /dev/[根分区] /mnt"}
  - 如果根分区使用 BtrFS，需要知道子卷名，如果没有子卷可以跳过此步
    - 可以通过先挂载 BtrFS，然后通过以下命令之一查看子卷名
      :copy{prompt="#" code="ls /mnt"}
      :copy{prompt="#" code="btrfs subvolume list /[挂载点]"}
    - 随后解除 /mnt 的挂载并重新挂载对应的子卷
      :copy{prompt="#" code="umount /mnt"}
      :copy{prompt="#" code="mount /dev/[根分区] -t btrfs -o subvol=[子卷名] /mnt"}
- 随后挂载其他分区：
  - 挂载启动分区
    :copy{prompt="#" code="mount /dev/[启动分区] /mnt/boot"}
  - 查看先前的挂载方式，有助于你的回忆
    :copy{prompt="#" code="cat /mnt/etc/fstab"}
  - 如果回忆起有其他分区，请继续挂载
- 可以将此时的挂载方式写入原系统：
  :copy{prompt="#" code="genfstab -U /mnt > /mnt/etc/fstab"}
- 随后就可以进入原系统了
  :copy{prompt="#" code="arch-chroot /mnt"}

## 修复一些可能导致无法进入的问题

- 如果忘记 `root` 用户密码，可以执行以下命令：
  :copy{prompt="#" code="passwd"}
- 同时，还可以更新一下系统的软件包，**说不定有用呢**：
  :copy{prompt="#" code="pacman -Syyuu"}
  - 如果更新缓慢，可以换源
  :copy{prompt="#" code="pacman -S reflector"}
  :copy{prompt="#" code="reflector --verbose --country China --sort rate --save /etc/pacman.d/mirrorlist"}
  - 如果提醒无法锁定数据库，可以删除锁文件
  :copy{prompt="#" code="rm /var/lib/pacman/db.lck"}
  - 如果提醒某文件已存在，可以强制覆盖
  :copy{prompt="#" code="pacman -Syu --overwrite &quot;*&quot;"}

## 修复引导

- 安装 Linux 包可以触发 mkinitcpio
  :copy{prompt="#" code="pacman -S linux"}
- 如果使用 systemd-boot，请执行以下命令
  :copy{prompt="#" code="bootctl install"}
  - 使用此命令检测 EFI 引导项和 Boot Loader 配置
  :copy{prompt="#" code="bootctl list"}
    - 如果屏幕显示不全，可以使用交互模式，按 q 退出
    :copy{prompt="#" code="bootctl"}
- 如果使用 grub，请执行以下命令
  :copy{prompt="#" code="grub-install"}
  - 备用命令，也可以自行在网上搜索
  :copy{prompt="#" code="grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=grub"}

## 为 systemd-boot 添加引导项

如果 `bootctl list` 显示没有 Arch Linux，那么需要写入以下文件：

```sh [/boot/loader/entries/arch.conf]
title   Arch Linux (linux)
linux   /vmlinuz-linux
initrd  /intel-ucode.img
initrd  /initramfs-linux.img
options root=PARTUUID=692afe0d-e1d7-4e0f-970f-1ed04e0c07e9 zswap.enabled=0 rootflags=subvol=@ rw rootfstype=btrfs
```

请注意：

1. PARTUUID 和 UUID 不同，`lsblk -f`{lang="sh"} 命令显示的是 UUID，你可以通过 `lsblk -o+UUID,PARTUUID`{lang="sh"} 发现两者的区别。
   - 查看 PARTUUID 并追加到文件中
     :copy{prompt="#" code="blkid -s PARTUUID -o value /dev/[根分区] >> /boot/loader/entries/arch.conf"}
   - 查看 UUID 并追加到文件中，需要 `option`{lang="sh"} 中使用 `root=UUID=`{lang="sh"}
     :copy{prompt="#" code="blkid -s UUID -o value /dev/[根分区] >> /boot/loader/entries/arch.conf"}
2. `initrd`{lang="sh"} 中需要添加对应 CPU 的微码，没有的话可以跳过。
3. `options`{lang="sh"} 中设置合适的 `rootfstype`{lang="sh"} 和 `rootflags`{lang="sh"}，有子卷时需要设置 `rootflags=subvol=[子卷名]`{lang="sh"}。

## 重启

按 Ctrl+Alt+Delete 直接重启。

更规范的方式是输入 `exit`{lang="sh"} 或按 Ctrl+D 退出 chroot 环境，然后执行 `reboot`{lang="sh"} 命令重启。
