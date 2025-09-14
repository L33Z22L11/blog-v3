---
title: 西邮Linux兴趣小组2021纳新面试题题解
description: ''
date: 2022-11-20 12:52:52
updated: 2023-07-30 11:45:33
image: https://7.isyangs.cn/24/65a8dcfb647c2-24.jpg
categories: [代码]
tags: [实验室, Lab, C语言]
---

> 注：
> - 本题目仅作 `西邮Linux兴趣小组` 2021 纳新面试题的有限参考。
> - 为节省版面本试题的程序源码中省略了 `#include`{lang="c"} 指令。
> - 本试题中的程序源码仅用于考察C语言基础，不应当作为C语言代码风格的范例。
> - 题目难度与序号无关。
> - 所有题目均假设编译并运行 `x86_64 GNU/Linux` 环境。
>
> Copyright © 2021 西邮Linux兴趣小组, All Rights Reserved.\
> 本试题使用采用 [知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议](http://creativecommons.org/licenses/by-nc-sa/4.0/) 进行许可。

## 1. 大小和长度竟然不是一个意思

> `sizeof()`{lang="c"} 和 `strlen()`{lang="c"} 有什么异同之处？
>
> 他们对于不同参数的结果有什么不同？请试举例子说明。
>
> ```c
> int main(void) {
>     char s[] = "I love Linux\0\0\0";
>     int a = sizeof(s);
>     int b = strlen(s);
>     printf("%d %d\n", a, b);
> }
> ```

`a`{lang="c"} 为 `sizeof(s)`{lang="c"}，即字符数组 `['I', ' ', 'l', 'o', 'v', 'e', ' ', 'L', 'i', 'n', 'u', 'x', '\0', '\0', '\0']`{lang="c"} 的大小；`b`{lang="c"} 为 `strlen(s)`{lang="c"}，即字符数组 `"I love Linux"`{lang="c"} 的长度。

另外，如果声明 `char s[20] = "I love Linux\0\0\0";`{lang="c"}，则 `a = sizeof(s);`{lang="c"} 的值变为`20`{lang="c"}。

## 2. 箱子的大小和装入物品的顺序有关

> `test1`{lang="c"} 和 `test2`{lang="c"} 都含有：1个 `short`{lang="c"}、1个 `int`{lang="c"}、1个 `double`{lang="c"}，那么 `sizeof(t1)`{lang="c"} 和 `sizeof(t2)`{lang="c"} 是否相等呢？这是为什么呢？
>
> ```c
> struct test1 {
>     int a;
>     short b;
>     double c;
> };
> struct test2 {
>     short b;
>     int a;
>     double c;
> };
> int main(void) {
>     struct test1 t1;
>     struct test2 t2;
>     printf("sizeof(t1): %d\n", sizeof(t1));
>     printf("sizeof(t2): %d\n", sizeof(t2));
> }
> ```

解读：

```c
struct test1 {
    int a;          // 0 ~ 3
    short b;        // 4 ~ 5
    double c;       // 8 ~ 15
} t1;               // 0 ~ 15 -> 16
struct test2 {
    short b;        // 0 ~ 1
    int a;          // 4 ~ 7
    double c;       // 8 ~ 15
} t2;               // 0 ~ 15 -> 16
```

## 3. 哦，又是函数

> 想必在高数老师的教导下大家十分熟悉函数这个概念。那么你了解计算机程序设计中的函数吗？请编写一个 `func`{lang="c"} 函数，用来输出二维数组 `arr`{lang="c"} 中每个元素的值。
>
> ```c
> /*在这里补全func函数的定义*/
> int main(void) {
>     int arr[10][13];
>     for (int i = 0; i < 10; i++) {
>         for (int j = 0; j < 13; j++) {
>             arr[i][j] = rand();
>         }
>     }
>     func(arr);
> }
> ```

补全后：

```c
#include <stdio.h>
#include <stdlib.h>
void func(int a[10][13]) {
    for (int i = 0; i < 10; i++) {
        for (int j = 0; j < 13; j++)
            printf("%d ", a[i][j]);
        printf("\n");
    }
}
int main(void) {
    int arr[10][13];
    for (int i = 0; i < 10; i++) {
        for (int j = 0; j < 13; j++) {
            arr[i][j] = rand();
        }
    }
    func(arr);
}
```

## 4.就不能换个变量名吗？

> - 请结合下面的程序，简要谈谈 `传值` 和 `传址` 的区别。
> - 简要谈谈你对C语言中变量的生命周期的认识。
>
> ```c
> int ver = 123;
> void func1(int ver) {
>     ver++;
>     printf("ver = %d\n", ver);
> }
> void func2(int *pr) {
>     *pr = 1234;
>     printf("*pr = %d\n", *pr);
>     pr = 5678;
>     printf("ver = %d\n", ver);
> }
> int main() {
>     int a = 0;
>     int ver = 1025;
>     for (int a = 3; a < 4; a++) {
>         static int a = 5;
>         printf("a = %d\n", a);
>         a = ver;
>         func1(ver);
>         int ver = 7;
>         printf("ver = %d\n", ver);
>         func2(&ver);
>     }
>     printf("a = %d\tver = %d\n", a, ver);
> }
> ```

- `传值` 后，修改形参的值，实参的值不会改变。

- `传址` 后，修改形参的值，实参的值会改变。

解读：

```c
#include <stdio.h>
int ver = 123;
void func1(int ver) {\
    // ver@func1
    ver++;
    // ver@func1 = 1026
    printf("ver = %d\n", ver);
    // ver@func1 is discarded
}
void func2(int *pr) {
    *pr = 1234;
    // *pr@func2(as ver@loop in main) = 1234
    printf("*pr = %d\n", *pr);
    pr = 5678;
    printf("ver = %d\n", ver);
    // ver@global = 123
    // *pr@func2 is discarded, but ver@loop isn't
}
int main() {
    int a = 0;
    int ver = 1025;
    for (int a = 3; a < 4; a++) {
        static int a = 5;
        // a@loop = 5
        printf("a = %d\n", a);
        a = ver;
        // a@loop = 1025
        func1(ver);
        int ver = 7;
        // ver@loop = 7
        printf("ver = %d\n", ver);
        func2(&ver);
        // jump out of loop, and a@loop and ver@loop are discarded
    }
    // a@main = 0, ver@main = 1025
    printf("a = %d\tver = %d\n", a, ver);
}
```

## 5. 套娃真好玩！

> 请说明下面的程序是如何完成求和的？
>
> ```c
> unsigned sum(unsigned n) { return n ? sum(n - 1) + n : 0; }
> int main(void) { printf("%u\n", sum(100)); }
> ```

通过递归完成求和，每次递归返回的为其先前的数之和。相当于 `栈(Stack)`，只有其前的函数的表达式返回值（出栈），新的栈顶函数表达式才能返回值。

特别地，当栈顶元素为 `sum(0)`{lang="c"} 时，会返回 `0`{lang="c"} 以实现从 `0` 到 `n` 的求和。

## 6. 算不对的算术

> ```c
> void func(void) {
>     short a = -2;
>     unsigned int b = 1;
>     b += a;
>     int c = -1;
>     unsigned short d = c * 256;
>     c <<= 4;
>     int e = 2;
>     e = ~e | 6;
>     d = (d & 0xff) + 0x2022;
>     printf("a=0x%hx\tb=0x%x\td=0x%hx\te=0x%x\n", a, b, d, e);
>     printf("c=Ox%hhx\t\n", (signed char)c);
> }
> ```

```c
#include <stdio.h>
void func(void) {
    short a = -2;
    // a = 1111 1111 1111 1110
    unsigned int b = 1;
    b += a;
    // b = 1111 1111 1111 1111 1111 1111 1111 1111
    int c = -1;
    // c = 1111 1111 1111 1111 1111 1111 1111 1111
    unsigned short d = c * 256;
    // d = 1111 1111 0000 0000
    c <<= 4;
    // c = 1111 1111 1111 1111 1111 1111 1111 0000
    int e = 2;
    // e = 0000 0000 0000 0000 0000 0000 0000 0010
    e = ~e | 6;
    // e = 1111 1111 1111 1111 1111 1111 1111 1101 |
    //     0000 0000 0000 0000 0000 0000 0000 0110
    //   = 1111 1111 1111 1111 1111 1111 1111 1111
    d = (d & 0xff) + 0x2022;
    // d = 1111 1111 0000 0000 & 0000 0000 1111 1111 + 0x2022 = 0x2022
    printf("a=0x%hx\tb=0x%x\td=0x%hx\te=0x%x\n", a, b, d, e);
    // a = 0xfffe, b = 0xffffffff, d = 0x2022, e = 0xffffffff
    printf("c=Ox%hhx\t\n", (signed char)c);
    // (signed char)c = 1111 0000 = 0xf0
}
```

## 7. 指针和数组的恩怨情仇

> ```c
> int main(void) {
>     int a[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
>     int(*b)[3] = a;
>     ++b;
>     b[1][1] = 10;
>     int *ptr = (int *)(&a + 1);
>     printf("%d %d %d \n", a[2][1], **(a + 1), *(ptr - 1));
>
> }
> ```

```c
int main(void) {
    int a[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};
    int(*b)[3] = a;
    ++b;
    b[1][1] = 10;
    int *ptr = (int *)(&a + 1);
    // *ptr = *(&a + sizeof(a)) = b
    // **(a + 1) = **(*(&a[0] + sizeof(a[0]))) = a[1][0]
    // *(ptr - 1) = *(&a + sizeof(a) - sizeof(*ptr)) = a[3][3]
    printf("%d %d %d \n", a[2][1], **(a + 1), *(ptr - 1));

}
```

## 8. 移形换位之术

> 下面有 `a`{lang="c"}、`b`{lang="c"}、`c`{lang="c"} 三个变量和4个相似的函数。
> - 你能说出使用这三个变量的值或地址作为参数分别调用这5个函数，在语法上是否正确吗？
> - 请找出下面的代码中的错误。
> - `const int`{lang="c"} 和 `int const`{lang="c"} 是否有区别？如果有区别，请谈谈他们的区别。
> - `const int *`{lang="c"} 和 `int const *`{lang="c"} 是否有区别？如果有区别，请谈谈他们的区别。
>
> ```c
> int a = 1;
> int const b = 2;
> const int c = 3;
> void funco(int n) {
>     n += 1;
>     n = a;
> }
> void func1(int *n) {
>     *n += 1;
>     n = &a;
> }
> void func2(const int *n) {
>     *n += 1;
>     n = &a;
> }
> void func3(int *const n) {
>     *n += 1;
>     n = &a;
> }
> void func4(const int *const n) {
>     *n += 1;
>     n = &a;
> }
> ```

```c
int a = 1;
int const b = 2;
const int c = 3;
void func0(int n) {
    // a formal parameter n
    n += 1;
    n = a;
}
void func1(int *n) {
    // a pointer  n
    *n += 1;
    n = &a;
}
void func2(const int *n) {
    // a const int pointer to n
    // *n is a const, unchangeable
    *n += 1;
    n = &a;
}
void func3(int *const n) {
    // an int pointer to const n
    *n += 1;
    // n is a const, unchangeable
    n = &a;
}
void func4(const int *const n) {
    // a const int pointer to const n
    // *n is a const, unchangeable
    *n += 1;
    // n is a const, unchangeable
    n = &a;
}
```

## 9. 听说翻转字母大小写不影响英文的阅读？

> 请编写 `convert`{lang="c"} 函数用来将作为参数的字符串中的大写字母转换为小写字母，将小写字母转换为大写字母。返回转换完成得到的新字符串。
>
> ```c
> char *convert(const char *s);
> int main(void) {
>     char *str = "XiyouLinux Group 2022";
>     char *temp = convert(str);
>     puts(temp);
> }
> ```

```c
#include <stdio.h>
#include <string.h>
char *convert(const char *s) {
    int len = strlen(s);
    char *result = malloc(sizeof(char) * (len + 1));
    strcpy(result, s);
    for (int i = 0; i < len; i++) {
        if (result[i] >= 'A' && result[i] <= 'Z')
            result[i] += 32;
        else if (result[i] >= 'a' && result[i] <= 'z')
            result[i] -= 32;
    }
    return result;
}
int main(void) {
    char *str = "XiyouLinux Group 2022";
    char *temp = convert(str);
    puts(temp);
}
```

## 10. 交换礼物的方式

> - 请判断下面的三种 `Swap`{lang="c"} 的正误，分别分析他们的优缺点。
> - 你知道这里的 `do {...} while(0)`{lang="c"} 的作用吗？
> - 你还有其他的方式实现 `Swap`{lang="c"} 功能吗？
>
> ```c
> #define Swap1(a, b, t)   \
>     do {                 \
>         t = a;           \
>         a = b;           \
>         b = t;           \
>     } while (0)
> #define Swap2(a, b)      \
>     do {                 \
>         int t = a;       \
>         a = b;           \
>         b = t;           \
>     } while (0)
> void Swap3(int a, int b) {
>     int t = a;
>     a = b;
>     b = t;
> }
> ```

- `Swap1()`{lang="c"} 和 `Swap2()`{lang="c"} 通过宏定义实现两数交换，`do {...} while(0)`{lang="c"} 可以用代码块花括号 `{...}`{lang="c"} 替代，目的是防止宏替换后语句不在同一代码块内。

- `Swap3()`{lang="c"} 错误，交换形参的值并不能改变实参。

- `Swap4()`{lang="c"} 利用指针来实现。

```c
void Swap4(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
```

## 11. 据说有个东西叫参数

> 你知道 `argc`{lang="c"} 和 `argv`{lang="c"} 的含义吗？请解释下面的程序。你能在不使用 `argc`{lang="c"} 的前提下，完成对 `argv`{lang="c"} 的遍历吗？
>
> ```c
> int main(int argc, char *argv[]) {
>     printf("argc = %d\n", argc);
>     for (int i = 0; i < argc; i++)
>         printf("%s\n", argv[i]);
> }
> ```

`argc`{lang="c"} 指 argument count，即参数计数器，`argv`{lang="c"} 指 argument vector，即参数数组。程序在运行时传入的第一个参数就是程序的启动路径/文件名，因此 `argc`{lang="c"} 最小为 `1`{lang="c"}。在循环中，整型 `argc`{lang="c"} 会自增到溢出，然后打印 `argv[0]`{lang="c"} 即程序路径。

不使用 `argc`{lang="c"} 遍历 `argv`{lang="c"} 的方法：

```c
#include <stdio.h>
int main() {
    _CRTIMP extern int __argc;
    _CRTIMP extern char **__argv;
    printf("argc = %d\n", __argc);
    for (int i = 0; i < __argc; i++)
        printf("%s\n", __argv[i]);
}
```

## 12. 人去楼空

> 这段代码有是否存在错误？谈一谈静态变量与其他变量的异同。
>
> ```c
> int *func1(void) {
>     static int n = 0;
>     n = 1;
>     return &n;
> }
> int *func2(void) {
>     int *p = (int *)malloc(sizeof(int));
>     *p = 3;
>     return p;
> }
> int *func3(void) {
>     int n = 4;
>     return &n;
> }
> int main(void) {
>     *func1() = 4;
>     *func2() = 5;
>     *func3() = 6;
> }
> ```

`*func3()`{lang="c"} 返回的是局部变量，在外部赋值时此局部变量已被抛弃，成为了野指针。

## 13. 奇怪的输出

> ```c
> int main(void) {
>     int data[] = {0x636c6557, 0x20656d6f, 0x78206f74,
>                   0x756f7969, 0x6e694c20, 0x67207875,
>                   0x70756f72, 0x32303220, 0x00000a31};
>     puts((const char*)data);
> }
> ```

```c
#include <stdio.h>
int main(void) {
    //               c l e W       e m o     x   o t
    int data[] = {0x636c6557, 0x20656d6f, 0x78206f74,
                  // u o y i     n i L       g   x u
                  0x756f7969, 0x6e694c20, 0x67207875,
                  // p u o r     2 0 2          \0 1
                  0x70756f72, 0x32303220, 0x00000a31};
    // unsigned char data[34] = {
    //     0x57, 0x65, 0x6C, 0x63, 0x6F, 0x6D, 0x65, 0x20, 0x74, 0x6F, 0x20, 0x78,
    //     0x69, 0x79, 0x6F, 0x75, 0x20, 0x4C, 0x69, 0x6E, 0x75, 0x78, 0x20, 0x67,
    //     0x72, 0x6F, 0x75, 0x70, 0x20, 0x32, 0x30, 0x32, 0x31, 0x00};
    // }
    puts((const char *)data);
}
```

## 14. 请谈谈对从「C语言文件到可执行文件」的过程的理解

- 编辑：创建和修改C程序的源代码

- 编译：将源代码转换为机器语言

- 链接：链接器将源代码由编译器产生的各种模块组合起来，再从C语言提供的程序库中添加必要的代码模块，将它们组成一个可执行的文件

- 执行：运行程序

## 15. (选做) 堆和栈

> 你了解程序中的栈和堆吗？它们在使用上有什么区别呢？请简要说明。

## 16. (选做) 多文件

> 一个程序在不使用任何头文件的情况下，如何使用另一个文件中的函数。

## 17. (选做) `GNU/Linux` 与文件

> - 你知道如何在 `GNU/Linux` 下如何使用命令行创建文件与文件夹吗？
> - 你知道 `GNU/Linux` 下的命令 `ls`{lang="sh"} 的每一列的含义吗？
> - 你知道 `GNU/Linux` 下文件的访问时间、修改时间、创建时间如何查看吗？并简单说说他们的区别。

> 恭喜你做完了整套面试题，快来参加西邮 Linux 兴趣小组的面试吧！
>
> 西邮 Linux 兴趣小组面试时间：\
> 2021年10月25日至2021年10月31日晚8点。\
> 听说面试来的早一点更能获得学长学姐的好感哦。
>
> 我们在 FZ103 等你！
