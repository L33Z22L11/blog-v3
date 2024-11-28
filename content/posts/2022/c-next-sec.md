---
title: C语言字符串时间获取下一秒的思考
description: “回字有四样写法”，在 C 语言中，我为「获取下一秒」找了四种写法。
date: 2022-12-18 19:53:37
updated: 2023-03-18 22:09:08
categories: [代码]
tags: [Lab, C语言]
---

## 题目

输入一个24小时制时间 `HH:MM:SS`，输出它的下一秒。

### 时间结构体定义

```c
typedef struct
{
    int h;
    int m;
    int s;
} time;
```

## 函数

### 输入时间到变量

```c
void getT(time *t)
{
    scanf("%d:%d:%d", &t->h, &t->m, &t->s);
}
```

### 输出时间

```c
void printT(time t)
{
    printf("%02d:%02d:%02d", t.h, t.m, t.s);
}
```

### 计算下一秒

#### 写法一

```c
time nextSec(time t)
{
    if (t.s < 59)
        t.s++;
    else if (t.m < 59)
        t.m++, t.s = 0;
    else if (t.h < 23)
        t.h++, t.m = t.s = 0;
    else
        t.h = t.m = t.s = 0;
    return t;
}
```

#### 写法二

```c
time nextSec2(time t)
{
    if (t.s < 59)
        t.s++;
    else
    {
        t.s = 0;
        if (t.m < 59)
            t.m++;
        else
        {
            t.m = 0;
            if (t.h < 23)
                t.h++;
            else
                t.h = 0;
        }
    }
    return t;
}
```

#### 写法三

```c
time nextSec3(time t)
{
    if (t.s == 59)
        if (t.m == 59)
            if (t.h == 23)
                t.h = t.m = t.s = 0;
            else
                t.h++, t.m = t.s = 0;
        else
            t.m++, t.s = 0;
    else
        t.s++;
    return t;
}
```

#### 写法四

```c
time nextSec4(time t)
{
    if (t.s == 59)
    {
        t.s = 0;
        if (t.m == 59)
        {
            t.m = 0;
            if (t.h == 23)
                t.h = 0;
            else
                t.h++;
        }
        else
            t.m++;
    }
    else
        t.s++;
    return t;
}
```

### 主函数

```c
int main()
{
    time t;
    getT(&t);
    printT(nextSec(t));
}
```

## 思考

从功能和实现的角度来看，所有四种写法都可以正确地将输入的时间t增加1秒，并返回增加1秒后的时间结果。因此，从这个角度来说，四种写法都是正确的。但是，从可读性和可维护性的角度来看，有一些差异。

第一种写法使用了多个 `else if`{lang="c"} 语句，每一个分支都需要检查当前秒数t.s、当前分钟数t.m和当前小时数t.h是否满足条件并进行相应的修改。这使得代码变得冗长且难以阅读。如果后续需要修改时间增加的规则，就需要修改多个分支，容易出现错误。

第二种写法使用了嵌套的 `if`{lang="c"} 语句来实现相同的功能。这样做可以消除 `else if`{lang="c"} 的嵌套，从而使得代码看起来更加清爽。但是，这种写法也有相应的问题：嵌套的if会使代码的缩进层数增加，从而增加了阅读复杂性；此外，嵌套的 `if`{lang="c"} 语句也可能降低代码的可读性。

第三种写法使用了嵌套的 `if`{lang="c"} 语句和多个嵌套的 `if`{lang="c"} 语句的组合来实现时间增加功能。此外，使用多个嵌套的 `if`{lang="c"} 语句可以减少代码的缩进层数并且规避使用 `else`{lang="c"} 语句的问题。尽管这种写法有更多的if嵌套，但其清晰度和可读性优于前两种写法。

第四种写法也使用了嵌套的 `if`{lang="c"} 语句，但是这里只使用了一个 `else`{lang="c"} 语句来代替多个 `else if`{lang="c"} 语句，从而减少代码的数量和难度。此外，减少缩进引起的嵌套和深度也有助于提高代码的可读性和可维护性。因此，这种写法比前三种写法更好。

总体而言，第四种写法最为简洁、易读、易懂，并且最便于维护和修改。
