---
title: 简单实现C语言字符串缓冲区
description: 设计一个C语言的动态扩容缓冲区，是西邮 Linux 兴趣小组的 Lab 报告。
date: 2023-01-01 23:58:33
updated: 2023-07-30 11:45:33
image: https://7.isyangs.cn/24/6664009a7190a-24.jpg
categories: [代码]
tags: [实验室, Lab, C语言]
references:
  - link: https://plan.xiyoulinux.com/project/strbuf/
    title: 设计一个 C 语言的动态扩容缓冲区
---

## 设计一个 C 语言的动态扩容缓冲区

> **知识要点**：字符串、面向对象的 C 语言设计、动态内存分配、Linux File API、getline。
>
> **缓冲区类的定义**
>
> ```c
> struct strbuf {
>     int len;     //当前缓冲区（字符串）长度
>     int alloc;   //当前缓冲区（字符串）容量
>     char *buf;   //缓冲区（字符串）
> };
> ```
>
> **HINT**
>
> - `strbuf`{lang="c"}的成员`len`{lang="c"}代表的是`buf`{lang="c"}缓冲区的长度，每次我们将字符串追加入`strbuf`{lang="c"}中，我们都应该使用 `strbuf_setlen()`{lang="c"}去更新`strbuf`{lang="c"}的长度`len`{lang="c"}，注意`123\0456`{lang="c"}的长度不是 3，而是 7。
> - `strbuf`{lang="c"}的成员`alloc`{lang="c"}代表的是`buf`{lang="c"}缓冲区的容量，也就是我们每次动态分配的数组大小，每当我们需要向`sb`{lang="c"}内追加一个字符串，我们需要计算当前的字符串长度加上追加的字符串长度，如果超过了当前的容量，我们就需要把容量扩大一倍，然后将字符串添加进去。

### Part 2A

> 实现字符串缓冲区类`strbuf`{lang="c"}简单的初始化，填充，释放，交换，比较，清空等操作。

#### `strbuf_init()`{lang="c"}

> 初始化`sb`{lang="c"}结构体，容量为`alloc`{lang="c"}。

初始化时要为缓冲区写入容量大小，在内存中申请空间，写入长度大小，并将缓冲区设置为空字符串。

```c
void strbuf_init(struct strbuf *sb, size_t alloc) {
    sb->alloc = alloc;
    sb->buf = (char *) malloc(alloc);
    sb->buf[sb->len = 0] = '\0';
}
```

#### `strbuf_attach()`{lang="c"}

> 将字符串填充到`sb`{lang="c"}中，长度为`len`{lang="c"}, 容量为`alloc`{lang="c"}。

`字符串`{lang="c"}已经有其对应的长度、容量、内容信息，直接将其对应填入缓冲区即可。

```c
void strbuf_attach(struct strbuf *sb, void *str, size_t len, size_t alloc) {
    sb->len = len;
    sb->alloc = alloc;
    sb->buf = (char *) str;
}
```

#### `strbuf_release()`{lang="c"}

> 释放`sb`{lang="c"}结构体的内存。

释放缓冲区内存，将容量大小、长度信息归零，并为缓冲区赋予空指针，防止重复释放内存时报错。

```c
void strbuf_release(struct strbuf *sb) {
    free(sb->buf);
    strbuf_attach(sb, NULL, 0, 0);
}
```

#### `strbuf_swap()`{lang="c"}
> 交换两个`strbuf`{lang="c"}。

交换时，可以利用结构体浅拷贝特性，通过增加一个临时的缓冲区变量，实现两个缓冲区的交换。

```c
void strbuf_swap(struct strbuf *a, struct strbuf *b) {
    struct strbuf tmp = *a;
    *a = *b;
    *b = tmp;
}
```

#### `strbuf_detach()`{lang="c"}

> 将`sb`{lang="c"}中的原始内存取出，并将`sz`{lang="c"}设置为其`alloc`{lang="c"}大小。

将缓冲区的容量信息赋给`sz`{lang="c"}，并返回缓冲区的指针。

```c
char *strbuf_detach(struct strbuf *sb, size_t *sz) {
    *sz = sb->alloc;
    return sb->buf;
}
```

#### `strbuf_cmp()`{lang="c"}

> 比较两个`strbuf`{lang="c"}的内存是否相同。

缓冲区中可能有`'\0'`{lang="c"}存在，所以需要比较长度范围内的所有信息，不能使用`strcmp()`{lang="c"}。
可以先比较长度，如果长度不同则返回长度的差，如果长度相同则使用`memcmp()`{lang="c"}比较长度内的信息。

```c
int strbuf_cmp(const struct strbuf *first, const struct strbuf *second) {
    return first->len - second->len || memcmp(first->buf, second->buf, first->len);
}
```

#### `strbuf_reset()`{lang="c"}

> 清空`sb`{lang="c"}。

清空缓冲区，则需要将长度归零，并将空字符串填入缓冲区。

```c
void strbuf_reset(struct strbuf *sb) {
    sb->buf[sb->len = 0] = '\0';
}
```

### Part 2B

> 实现字符串缓冲区类`strbuf`{lang="c"}扩容，(追加|插入)字符，字符串等操作。

#### `strbuf_grow()`{lang="c"}

> 确保在`len`{lang="c"}之后`strbuf`{lang="c"}中至少有`extra`{lang="c"}个字节的空闲空间可用。

先计算可用空间，如果可用空间不足，则重新申请内存，将内存指针赋给缓冲区，并更新容量信息。

```c
void strbuf_grow(struct strbuf *sb, size_t extra) {
    if (sb->alloc - sb->len < extra)
        sb->buf = (char *) realloc(sb->buf, sb->alloc += extra);
}
```

#### `strbuf_add()`{lang="c"}

> 向`sb`{lang="c"}追加长度为`len`{lang="c"}的数据`data`{lang="c"}。

追加数据前，先保证容量足够，然后将追加内容拷贝进缓冲区，并更新长度、**字符串结束标志**。

```c
void strbuf_add(struct strbuf *sb, const void *data, size_t len) {
    strbuf_grow(sb, len + 1);
    memcpy(sb->buf + sb->len, data, len);
    sb->buf[sb->len += len] = '\0';
}
```

#### `strbuf_addch()`{lang="c"}

> 向`sb`{lang="c"}追加一个字符`c`{lang="c"}。

使用追加函数向缓冲区追加字符，长度为1。

```c
void strbuf_addch(struct strbuf *sb, int c) {
    strbuf_add(sb, &c, 1);
}
```

#### `strbuf_addstr()`{lang="c"}

> 向`sb`{lang="c"}追加一个字符串`s`{lang="c"}。

使用追加函数向缓冲区追加字符串，长度为`strlen(s)`{lang="c"}。

```c
void strbuf_addstr(struct strbuf *sb, const char *s) {
    strbuf_add(sb, s, strlen(s));
}
```

#### `strbuf_addbuf()`{lang="c"}

> 向一个`sb`{lang="c"}追加另一个`strbuf`{lang="c"}的数据。

使用追加字符串函数向缓冲区追加另一个缓冲区的内容。

这种做法并不规范！标准做法是使用追加函数向缓冲区追加另一个缓冲区的内容，长度为缓冲区的长度。

```c
void strbuf_addbuf(struct strbuf *sb, const struct strbuf *sb2) {
    strbuf_addstr(sb, sb2->buf);
}
```

#### `strbuf_setlen()`{lang="c"}

> 设置`sb`{lang="c"}的长度`len`{lang="c"}。

如果设置的长度大于缓冲区容量，则先增加缓冲区容量。设置长度，并在对应位置增加字符串结束标志`'\0'`{lang="c"}。

这种做法并不规范！函数默认：设置的长度一定小于容量。所以不需要判断长度或者增加容量，遇到问题应该直接抛出错误。

```c
void strbuf_setlen(struct strbuf *sb, size_t len) {
    if (len > sb->alloc) strbuf_grow(sb, len - sb->len + 1);
    sb->buf[sb->len = len] = '\0';
}
```

#### `strbuf_avail()`{lang="c"}

> 计算`sb`{lang="c"}目前仍可以向后追加的字符串长度。

返回缓冲区容量减去字符串长度再减一的值。

```c
size_t strbuf_avail(const struct strbuf *sb) {
    return sb->alloc - sb->len - 1;
}
```

#### `strbuf_insert()`{lang="c"}

> 向`sb`{lang="c"}内存坐标为`pos`{lang="c"}位置插入长度为`len`{lang="c"}的数据`data`{lang="c"}。

设置缓冲区长度为插入后的长度，将插入字符串处的缓冲区内容移动到插入内容结束的位置，并使用`memcpy()`{lang="c"}拷贝长度为`len`{lang="c"}的内容到插入的位置。

```c
void strbuf_insert(struct strbuf *sb, size_t pos, const void *data, size_t len) {
    strbuf_setlen(sb, sb->len + len);
    memmove(sb->buf + pos + len, sb->buf + pos, sb->len - pos);
    memcpy(sb->buf + pos, data, len);
}
```

### Part 2C

#### `strbuf_rtrim()`{lang="c"}

> 去除`sb`{lang="c"}缓冲区右端的所有空格和 `'\t'`{lang="c"}。

如果读到结尾处时空格或者制表符，则填充字符串结束标志`'\0'`{lang="c"}，并减少长度，直到结尾处不是空格或者制表符。

```c
void strbuf_rtrim(struct strbuf *sb) {
    while (sb->buf[sb->len - 1] == ' ' || sb->buf[sb->len - 1] == '\t')
        sb->buf[--sb->len] = '\0';
}
```

#### `strbuf_ltrim()`{lang="c"}

> 去除`sb`{lang="c"}缓冲区左端的所有空格和 `'\t'`{lang="c"}。

声明一个修剪位置变量为缓冲区内容开头的相对位置，如果读到修剪位置处时空格或者制表符，则增加修剪位置，直到修剪位置处不是空格或者制表符。

将修剪位置处开始，长度为缓冲区长度减去修剪位置+1的缓冲区内容移动到缓冲区内容开头，并将缓冲区长度减去修剪位置，就完成了缓冲区左端的修剪操作。

```c
void strbuf_ltrim(struct strbuf *sb) {
    int trimpos = 0;
    while (sb->buf[trimpos] == ' ' || sb->buf[trimpos] == '\t') trimpos++;
    memmove(sb->buf, sb->buf + trimpos, (sb->len -= trimpos) + 1);
}
```

#### `strbuf_remove()`{lang="c"}

>  删除 `sb`{lang="c"} 缓冲区从 `pos`{lang="c"} 坐标长度为 `len`{lang="c"} 的内容。

将删除坐标加删除长度处，长度为缓冲区长度减删除长度减相对删除位置+1的内容，移动到绝对删除位置处，并将缓冲区长度减去删除长度，便完成了删除缓冲区指定位置处指定长度内容的操作。

```c
void strbuf_remove(struct strbuf *sb, size_t pos, size_t len) {
    memmove(sb->buf + pos, sb->buf + pos + len, (sb->len -= len) - pos + 1);
}
```

### Part 2D

#### `strbuf_read()`{lang="c"}

> `sb`{lang="c"}增长`hint ? hint : 8192`{lang="c"}大小，然后将文件描述符为`fd`{lang="c"}的所有文件内容追加到`sb`{lang="c"}中。

先使用`strbuf_grow()`{lang="c"}增长内存空间，再使用`fdopen()`{lang="c"}读取文件到文件指针`*fp`{lang="c"}。使用`fgetc()`{lang="c"}逐字符读取，并使用`strbuf_addch()`{lang="c"}将字符加入缓冲区，直到读到文件末尾结束，返回读取的文件长度。

```c
ssize_t strbuf_read(struct strbuf *sb, int fd, size_t hint) {
    strbuf_grow(sb, hint ? hint : 8192);
    FILE *fp = fdopen(fd, "r");
    for (char ch; (ch = fgetc(fp)) != EOF;) strbuf_addch(sb, ch);
    return sb->len;
}
```

#### `strbuf_getline()`{lang="c"}

> 将文件句柄为`fp`{lang="c"}的一行内容（抛弃换行符）读取到`sb`{lang="c"}。

使用`fgetc()`{lang="c"}逐字符读取文件指针`*fp`{lang="c"}，并使用`strbuf_addch()`{lang="c"}将字符加入缓冲区，直到读到换行符或者文件末尾结束，返回读取的文件长度。

```c
int strbuf_getline(struct strbuf *sb, FILE *fp) {
    for (char ch; (ch = fgetc(fp)) != '\n' && ch != EOF;) strbuf_addch(sb, ch);
    return sb->len;
}
```

### CHALLENGE

> 1.实现字符串切割（C 系字符串函数的一个痛点）。

#### `strbuf_split_buf()`{lang="c"}

> 将长度为`len`{lang="c"}的字符串`str`{lang="c"}根据切割字符`terminator`{lang="c"}切成多个 strbuf,并从结果返回，max 可以用来限定最大切割数量。返回`struct strbuf`{lang="c"}的指针数组，数组的最后元素为`NULL`{lang="c"}。

刚开始，我尝试使用`strtok()`{lang="c"}实现，但是由于缓冲区内容含有`'\0'`{lang="c"}，此后的内容被舍弃了，所以并没有达成目标。

```c
struct strbuf **strbuf_split_buf(const char *str, size_t len, int terminator, int max) {
    struct strbuf **ret = (struct strbuf **) malloc(sizeof(struct strbuf *) * (max + 1));
    char s[len + 1], delim[2] = {(char) terminator};
    memcpy(s, str, len + 1);
    char *token = strtok(s, delim);
    for (int i = 0; token && i < max; ret[++i] = NULL) {
        ret[i] = (struct strbuf *) malloc(sizeof(struct strbuf));
        strbuf_init(ret[i], 0);
        strbuf_addstr(ret[i], token);
        token = strtok(NULL, delim);
    }
    return ret;
}
```

后来，则标记字串的起始位置和结束位置，通过循环来逐字符判断，满足条件则切割，循环完毕即输出。

```c
struct strbuf **strbuf_split_buf(const char *str, size_t len, int terminator, int max) {
    struct strbuf **ret = (struct strbuf **) malloc(sizeof(struct strbuf *) * (max + 1));
    for (int pos = 0, flag = 0, n = 0; pos <= len && n < max; pos++) {
        while (str[flag] == terminator) pos = flag++ + 2;
        if (pos == len || pos > flag && str[pos] == terminator) {
            ret[n] = (struct strbuf *) malloc(sizeof(struct strbuf));
            strbuf_init(ret[n], 0);
            strbuf_add(ret[n], str + flag, pos - flag);
            // printf("[%d]: %s (%d~%d, %d)\n", n, ret[n]->buf, flag, pos, pos - flag);
            while (str[pos] == terminator) flag = pos++;
            ret[++n] = NULL;
        }
    }
    return ret;
}
```

> 2.实现判断一个strbuf是否以指定字符串开头的功能（C系字符串函数的另一个痛点）。

#### `strbuf_begin_judge()`{lang="c"}

> target_str：目标字符串，str：前缀字符串，strlen：target_str长度，前缀相同返回true失败返回false

前缀字符串为空则返回`true`{lang="c"}，否则使用`strncmp()`{lang="c"}对比目标字符串的前`strlen`{lang="c"}字节是否与前缀字符串相同，如果相同结果为0返回`true`{lang="c"}，否则返回`false`{lang="c"}。

```c
bool strbuf_begin_judge(char *target_str, const char *str, int strnlen) {
    return str == NULL || !strncmp(target_str, str, strlen(str));
}
```

> 3.获取字符串从坐标`[begin, end)`{lang="c"}的所有内容（可以分成引用和拷贝两个模式）。

#### `strbuf_get_mid_buf()`{lang="c"}

> target_str：目标字符串，begin：开始下标，end：结束下标，len：target_buf的长度。参数不合法返回NULL。下标从0开始，[begin, end)区间。

如果参数不合法（起始大于结束、结束大于长度）返回`NULL`{lang="c"}。

否则为字符串申请结束下标减开始下标+1的空间，将指定位置指定长度的字符串填入，并在末尾加上字符串结束标志`'\0'`{lang="c"}，返回字符串。

```c
char *strbuf_get_mid_buf(char *target_buf, int begin, int end, int len) {
    if (begin > end || end >= len) return NULL;
    char *str = (char *) malloc(end - begin + 1);
    memcpy(str, target_buf + begin, end - begin);
    str[end - begin] = '\0';
    return str;
}
```
