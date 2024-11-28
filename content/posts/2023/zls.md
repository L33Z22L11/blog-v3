---
title: Linux 下简单 ls 命令的实现
description: 这个程序是一个基于C语言的命令行工具，用于在终端中展示指定目录下的文件信息。它的名字是“zls”。
date: 2023-03-18 22:20:20
updated: 2023-11-30 22:39:04
categories: [代码]
tags: [Lab, C语言]
---

## 功能

该程序的功能包括：

- 列出指定目录下的所有文件和子目录
- 对列表进行排序，支持按照时间、名称等进行排序
- 支持展示文件的名称、大小、权限、修改时间等元信息
- 支持展示文件inode号和文件占用块数量（单位为4KB）
- 该程序还支持的参数有：
  - `-a`{lang="js"}：列出所有文件和子目录，包括隐藏文件和文件夹
  - `-l`{lang="js"}：展示详细的文件元信息，包括文件权限、大小、修改时间、占用块数量、链接数等
  - `-R`{lang="js"}：递归展示子目录下的文件信息
  - `-t`{lang="js"}：按照时间进行排序
  - `-r`{lang="js"}：逆序排序
  - `-i`{lang="js"}：展示文件的inode号
  - `-s`{lang="js"}：展示文件的占用块数量（单位为512字节）

使用该程序，只需要在终端中输入 `./zls`{lang="sh"} 命令即可，默认情况下，它会展示当前所在目录下的所有文件和目录。如果想要指定一个目录进行展示，可以在命令中输入要展示的目录名。

## 函数

### list 函数

`list()`{lang="c"} 是最核心的函数，负责展示指定目录下的文件列表信息。该函数主要的实现逻辑包括：

- 首先打开指定目录，并读取目录下的所有文件和子目录
- 对读取到的文件和子目录进行排序
- 针对每一个文件和目录，展示它们的信息
- 在实现过程中，需要注意：如果该目录无法打开，说明该目录可能不存在或者无权访问，此时需要检查该路径是否为一个文件，如果是，则展示该文件的信息。

此外，如果参数中包含 `-R`{lang="c"} 参数，则需要递归展示子目录下的文件列表。具体实现时，可以在每次读取到一个子目录时，调用 list 函数进行递归展示。

### listfile 函数

`listfile()`{lang="c"} 是 `list()`{lang="c"} 中最核心的输出函数。该函数用于展示文件的信息，包括名称、大小、权限、修改时间等。使用 ANSI 控制字符可以实现对输出文本颜色的改变。

在实现过程中，需要注意：如果参数中包含 `-l`{lang="js"} 参数，则需要展示详细的文件元信息。此时，需要通过调用 `mod2str()`{lang="c"} 函数将文件权限码转化为字符串，并通过 `uname()`{lang="c"} 和 `gname()`{lang="c"} 将用户id和组id转化为用户名和组名。

### parseParam 函数

`parseParam()`{lang="c"} 函数负责解析命令行参数，并设置对应的展示 flag，以便在展示文件列表时能够根据 flag 进行展示。其核心实现逻辑为：针对每一个传入参数，检查其首字符是否为 `-`，如果是则解析其中包含的flag。

在实现过程中，这里使用了一个宏定义，用于简化代码。不同的参数对应不同的 flag，因此这里使用了二进制位运算，每个 flag 对应一个二进制位，当设置 flag 后把对应二进制位置为 `1`{lang="c"}。使用位运算可以将多个 flag 组合在一起传入。

### mod2str 函数

`mod2str()`{lang="c"} 用于将文件权限码转化为字符串。权限编码由三个八进制数字组成，每个数字对应一个权限，分别为所有者、同组用户、其他用户。具体实现时，可以通过判断文件类型和各个权限位来将它们转化为字符串。返回的字符串长度为 `10`。

### num2str 函数

`num2str()`{lang="c"} 函数用于将数字转化为字符串。该函数中使用了 `sprintf()`{lang="c"} 对数字进行了格式化处理，可将其转化为对应的字符串。返回的字符串长度不定，根据传入的数字而定。

### uname 函数和 gname 函数

`uname()`{lang="c"} 和 `gname()`{lang="c"} 分别用于将用户id和组id转化为用户名和组名。这里使用了 `getpwuid()`{lang="c"} 和 `getgrgid()` 获取对应的用户信息和组信息，如果获取不到则返回该 id 的字符串形式。

`ls` 的功能基本实现，并支持了一些扩展性比较好的参数，可以通过该程序快速方便地展示文件列表信息。

```c
#include <dirent.h>
#include <grp.h>
#include <linux/limits.h>
#include <pwd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <time.h>

void list(char dir[]);
void listfile(struct stat* einfo, char fname[]);
void parseParam(char arg[]);
char* mod2str(int mod);
char* num2str(unsigned int num);
char* uname(gid_t uid);
char* gname(gid_t gid);

static unsigned param = 0;
#define P_a 0b1
#define P_l 0b10
#define P_R 0b100
#define P_t 0b1000
#define P_r 0b10000
#define P_i 0b100000
#define P_s 0b1000000

int main(int argc, char* argv[]) {
    int havePath = 0;
    for (int i = 1; i < argc; i++)
        if (*argv[i] == '-')
            parseParam(argv[i]);
        else
            havePath++;
    while (--argc)
        if (**++argv != '-')
            list(*argv);
    if (!havePath)
        list(".");
    return 0;
}

void list(char dir[]) {
    // 打开目录
    DIR* dirp = opendir(dir);
    if (!dirp) {
        closedir(dirp);
        struct stat einfo;
        if (stat(dir, &einfo) == -1)
            fprintf(stderr, "zls: 无法访问 '%s': 没有那个文件或目录。\n", dir);
        else if (!(param & P_R)) {
            listfile(&einfo, dir);
            printf("\n");
        }
        return;
    }
    printf("%s:\n", dir);
    // 生成列表
    int entc, enti[PATH_MAX];
    struct entbrief {
        char name[NAME_MAX];
        time_t mtime;
    };
    struct entbrief* entv = malloc(sizeof(struct entbrief[PATH_MAX]));
    struct dirent* entp;
    for (entc = 0; (entp = readdir(dirp)) != NULL;) {
        if (!(param & P_a) && *entp->d_name == '.')
            continue;
        struct stat einfo;
        strcpy(entv[entc].name, entp->d_name);
        if (param & P_t) {
            char path[PATH_MAX];
            sprintf(path, "%s/%s", dir, entp->d_name);
            if (stat(path, &einfo) == -1)
                continue;
            entv[entc].mtime = einfo.st_mtim.tv_sec;
        }
        enti[entc] = entc;
        entc++;
    }
    // 排序
    for (int i = 1, j, temp; i < entc; i++) {
        temp = enti[i];
        for (j = i;
             // 排序的condition比较长，所以称之为“悲伤的猪大排”
             j > 0 &&
             !!(param & P_r) ^
                 (param & P_t
                      ? entv[enti[j - 1]].mtime > entv[temp].mtime
                      : strcmp(entv[enti[j - 1]].name, entv[temp].name) > 0);
             j--)
            enti[j] = enti[j - 1];
        enti[j] = temp;
    }
    // 输出
    for (int i = 0; i < entc; i++) {
        struct stat einfo;
        char path[PATH_MAX];
        sprintf(path, "%s/%s", dir, entv[enti[i]].name);
        if (stat(path, &einfo) == -1)
            continue;
        listfile(&einfo, entv[enti[i]].name);
        printf(param & P_l || i % 5 == 4 ? "\n" : "  \t");
    }
    printf(param & P_l ? "\n" : "\n\n");
    closedir(dirp);
    // 递归
    for (int i = 0; i < entc && param & P_R; i++) {
        if (!strcmp(entv[i].name, ".") || !strcmp(entv[i].name, ".."))
            continue;
        char path[PATH_MAX];
        sprintf(path, "%s/%s", dir, entv[i].name);
        list(path);
    }
    free(entv);
}

void listfile(struct stat* einfo, char fname[]) {
    if (param & P_i)
        printf("%8lu  ", einfo->st_ino);
    if (param & P_s)
        // Zhilu 纠正：应该是4KB向上取整
        printf("%4ld  ",
               (einfo->st_size / 4096 * 4) + (einfo->st_size % 4096 ? 4 : 0));
    if (param & P_l) {
        printf("%s  ", mod2str(einfo->st_mode));
        printf("%4d  ", (int)einfo->st_nlink);
        printf("%-8s  ", uname(einfo->st_uid));
        printf("%-8s  ", gname(einfo->st_gid));
        printf("%8ld  ", einfo->st_size);
        printf("%.12s  ", 4 + ctime((const time_t*)&einfo->st_mtim));
    }
    printf(S_ISDIR(einfo->st_mode) ? "\033[1;34m%-10s\033[0m" : "%-10s", fname);
}

void parseParam(char arg[]) {
#define CheckParam(ch)   \
    if (*arg == *#ch) {  \
        param |= P_##ch; \
        continue;        \
    }
    while (*++arg) {
        CheckParam(a);
        CheckParam(l);
        CheckParam(R);
        CheckParam(t);
        CheckParam(r);
        CheckParam(i);
        CheckParam(s);
        fprintf(stderr, "zls: 未知参数 '-%c'。\n", *arg);
    }
#undef CheckParam
}

char* mod2str(int mod) {
    static char str[] = "----------";
    str[0] = S_ISDIR(mod) ? 'd' : S_ISLNK(mod) ? 'l' : '-';
    str[1] = mod & S_IRUSR ? 'r' : '-';
    str[2] = mod & S_IWUSR ? 'w' : '-';
    str[3] = mod & S_IXUSR ? 'x' : '-';
    str[4] = mod & S_IRGRP ? 'r' : '-';
    str[5] = mod & S_IWGRP ? 'w' : '-';
    str[6] = mod & S_IXGRP ? 'x' : '-';
    str[7] = mod & S_IROTH ? 'r' : '-';
    str[8] = mod & S_IWOTH ? 'w' : '-';
    str[9] = mod & S_IXOTH ? 'x' : '-';
    return str;
}

char* num2str(unsigned int num) {
    static char str[NAME_MAX];
    sprintf(str, "%d", num);
    return str;
}

char* uname(gid_t uid) {
    struct passwd* pwp = getpwuid(uid);
    return pwp ? pwp->pw_name : num2str(uid);
}

char* gname(gid_t gid) {
    struct group* grp = getgrgid(gid);
    return grp ? grp->gr_name : num2str(gid);
}
```
