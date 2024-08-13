---
title: Linux 下通过 Samba 共享文件夹
description:
date: 2024-08-04 21:11:03
updated: 2024-08-11
image:
cover:
banner:
categories: [经验分享]
tags: [教程, archlinux, samba, smb]
references:
  - "[smbpasswd - Samba man page](https://www.samba.org/samba/docs/current/man-html/smbpasswd.8.html)"
  - "[Samba - Arch Linux 中文维基](https://wiki.archlinuxcn.org/wiki/Samba)"
---

SMB (Server Message Block) 是一种网络文件共享协议；Samba 是在 Linux 上实现 SMB/CIFS 的自由软件服务。

## 简单传输文件

如果只是单次传输文件，可以考虑使用 `scp` 或 `rsync`。

```bash
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

```sh
sudo smbpasswd -a user
```

### 配置 Samba

编辑 Samba 配置文件：

```sh
sudo vim /etc/samba/smb.conf
```

添加以下内容：

```ini
[global]
workgroup = WORKGROUP
server string = Arch Linux Server
netbios name = Arch
security = user
map to guest = bad user
guest ok = yes
guest only = yes

[share_folder_display_name] # 文件夹显示名称
path = /path/to/share
valid users = username_in_system # 允许访问的用户
browseable = yes
read only = no
writable = yes
guest ok = no
```

## 作为客户端

::link-card
---
icon: https://coda.world/favicon.ico
title: Linux 下访问 Samba 共享的几种姿势
link: https://coda.world/linux-and-samba-share/
---
::
