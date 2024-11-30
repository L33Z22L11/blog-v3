---
title: xv6 lab环境配置
description: 配置 MIT 6.S081 操作系统课程中的 xv6 实验环境，包括 RISC-V 和 QEMU 安装，调整 Makefile 编译选项，以及 VSCode 和 clangd 相关设置。
date: 2023-11-20 17:09:28
updated: 2023-11-20 17:09:28
categories: [经验分享]
tags: [实验室, Lab]
---

::alert
此文章尚未完成。
::

## 课程介绍

[MIT 6.S081: Operating System Engineering - CS自学指南](https://csdiy.wiki/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/MIT6.S081/)

## 环境配置

- 安装依赖：
  :copy{code="sudo pacman -S risc-v qemu-system-riscv"}

如果克隆的是2021版的仓库，需要修改Makefile：

```makefile [Makefile]
# CFLAGS = -Wall -Werror -O -fno-omit-frame-pointer -ggdb
CFLAGS = -Wall -O -fno-omit-frame-pointer -ggdb
```

如果使用clangd作为VSCode的语法前端，需要在设置中向`clangd.fallbackFlags`{lang="js"}添加一项：`-I${workspaceFolder}`{lang="js"}。
