---
title: Linux 下通过 Samba 共享文件夹
description: Linux 作为 SMB 协议服务器，向其他设备提供共享文件夹服务。
date: 2024-08-04 21:11:03
updated: 2024-09-05 02:04:43
# image:
categories: [经验分享]
tags: [教程, archlinux, samba, smb]
references:
  - title: smbpasswd - Samba man page
    link: https://www.samba.org/samba/docs/current/man-html/smbpasswd.8.html
  - title: Samba - Arch Linux 中文维基
    link: https://wiki.archlinuxcn.org/wiki/Samba
---

SMB (Server Message Block) 是一种网络文件共享协议；Samba 是在 Linux 上实现 SMB/CIFS 的自由软件服务。

如果要在 Windows 上使用 SMB 共享文件夹，请参阅 [Tailscale 不完全使用指南 # Windows 文件共享](/2023/tailscale-incomplete-guide)。

## 简单传输文件

如果只是单次传输文件，可以考虑使用 `scp`{lang="sh"} 或 `rsync`{lang="sh"}。

```sh
scp -P 22 /path/to/file user@host:/path/to/destination
rsync -avzP /path/to/file user@host:/path/to/destination
```

## 作为服务器

### 安装和启动 Samba 服务

```sh
sudo pacman -S samba
sudo systemctl enable --now smb.service
```

### 添加 Samba 用户

- 设置本用户的 SMB 密码：
  ```sh
  sudo smbpasswd -a my_username
  ```
- 如果你需要使用其他账户访问 SMB，请添加对应用户名：
  ```sh
  # 添加用户并阻止此用户登录 shell
  sudo useradd a_smb_guest_name -s /bin/nologin
  sudo smbpasswd -a a_smb_guest_name
  ```

### 配置 Samba

::alert
请参阅 SMB 默认配置文件 [`smb.conf` 的官方示例](https://git.samba.org/samba.git/?p=samba.git;a=blob_plain;f=examples/smb.conf.default;hb=HEAD)。
::

编辑 Samba 配置文件：

```sh
sudo vim /etc/samba/smb.conf
```

在配置文件中添加以下内容：

```ini
[global]
   # 主机名配置
   netbios name = Arch  # 设置主机名

   # 用户访问配置
   map to guest = bad user  # 将无效用户映射为 guest
   guest ok = yes  # 允许 guest 访问

   # 以下是可选项，使用默认值即可：
   ; workgroup = WORKGROUP  # 默认工作组名称
   ; server string = Samba Server  # 服务器描述字符串，默认是 "Samba %v"
   ; guest only = no  # 是否只允许 guest 访问，默认是 no

[share_folder_display_name]  # 文件夹共享设置
   path = /path/to/share  # 指定共享路径
   valid users = username1 username2  # 允许访问的用户列表

   # 以下是可选项，使用默认值即可：
   ; comment = Guest Share  # 文件夹的描述，默认是空字符串
   ; public = yes  # 允许公开访问，通常与 guest ok 配合使用，默认是 no
   ; browseable = yes  # 共享是否在网络中可见，默认是 yes
   ; read only = no  # 共享是否只读，默认是 no
   ; writable = yes  # 共享是否可写，默认与 read only 相反
   ; guest ok = no  # 是否允许 guest 访问，默认是 no

```

## 作为客户端

::link-card
---
icon: https://coda.world/favicon.ico
title: Linux 下访问 Samba 共享的几种姿势
link: https://coda.world/linux-and-samba-share/
---
::
