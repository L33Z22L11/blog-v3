---
title: 西邮Linux兴趣小组2022纳新面试题题解
description: ''
date: 2022-11-19 22:32:46
updated: 2023-07-30 11:45:33
image: https://7.isyangs.cn/24/65a8dcfb2a43b-24.jpg
categories: [代码]
tags: [实验室, Lab, C语言]
---

> - 本题目只作为 `Xiyou Linux 兴趣小组` 2022 纳新面试的有限参考。
> - 为节省版面，本试题的程序源码省去了 `#include`{lang="c"} 指令。
> - 本试题中的程序源码仅用于考察C语言基础，不应当作为C语言「代码风格」的范例。
> - 题目难度随机排列。
> 所有题目编译并运行于 `x86_64 GNU/Linux` 环境。
>
> 学长寄语：\
> 长期以来，西邮Linux兴趣小组的面试题以难度之高名扬西邮校内。我们作为出题人也清楚的知道这份试题略有难度。请别担心。**若有同学能完成一半的题目，就已经十分优秀。** 其次，相比于题目的答案，我们对你的思路和过程更感兴趣，或许你的答案略有瑕疵，但你正确的思路和对知识的理解足以为你赢得绝大多数的分数。最后，做题的过程也是学习和成长的过程，相信本试题对你更加熟悉的掌握C语言的一定有所帮助。祝你好运。我们FZ103见！
>
> Copyright © 2022 西邮Linux兴趣小组, All Rights Reserved.\
> 本试题使用采用 [知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议](http://creativecommons.org/licenses/by-nc-sa/4.0/) 进行许可。

## 0. 我的计算器坏了？！

> `2^10 = 1024` 对应于十进制的4位，那么 `2^10000` 对应于十进制的多少位呢?

对于十进制数 `d`，可以取其以10为底的对数，`[lg d] + 1` 即为所求的位数。

    [lg 2^10] + 1 = [10 lg 2] + 1 = 4
    [lg 2^10000] + 1 = 3011

当然，也可以使用Python，将 `2^10000` 转换为字符串并打印其长度解决。

```python
print(len(str(2 ** 10000))) # 3011
```

## 1. printf还能这么玩？

> 尝试着解释程序的输出。
>
> ```c
> int main(void) {
>     if ((3 + 2 < 2) > (3 + 2 > 2))
>         printf("Welcome to Xiyou Linux Group\n");
>     else
>         printf("%d\n", printf("Xiyou Linux Group - 2%d", printf("")));
> }
> ```

先看 `if`{lang="c"} 语句，`3 + 2 < 2`{lang="c"} 为假返回 `0`{lang="c"}，`3 + 2 > 2`{lang="c"} 为真返回`1`{lang="c"}，`0 > 1`{lang="c"} 为假，执行 `else`{lang="c"} 内的语句。

而 `else`{lang="c"} 语句中，`printf()`{lang="c"} 的返回值为打印字符串的长度，因此最内层的 `printf("")`{lang="c"} 打印 `""`{lang="c"} 并返回其长度 `0`{lang="c"}，中间层打印 `"Xiyou Linux Group - 20"`{lang="c"} 并返回其长度 `22`{lang="c"}，外层打印 `"22\n"`{lang="c"}，其结果为：

    Xiyou Linux Group - 2022

## 2. 你好你好你好呀！

> - 程序的输出有点奇怪，请尝试解释一下程序的输出吧。
> - 请谈谈对 `sizeof()`{lang="c"} 及 `strlen()`{lang="c"} 的理解吧。
>
> ```c
> int main(void) {
>     char p0[] = "Hello,Linux";
>     char *p1 = "Hello,Linux";
>     char p2[11] = "Hello,Linux";
>     printf("p0 == p1: %d, strcmp(p0, p2): %d\n", p0 == p1, strcmp(p0, p2));
>     printf("sizeof(p0): %zu, sizeof(p1): %zu, sizeof(*p2): %zu\n",
>            sizeof(p0), sizeof(p1), sizeof(*p2));
>     printf("strlen(p0): %zu, strlen(p1): %zu\n", strlen(p0), strlen(p1));
> }
> ```

`p0`{lang="c"} 是字符数组，以 `'\0'`{lang="c"} 结尾，`p1`{lang="c"} 是字符指针，指向常量区的一个字符串，`p2`{lang="c"} 也是字符数组，但由于长度限制，没有结尾的标识符 `\0`{lang="c"}。

直接引用数组变量名时，返回的是数组首位的地址，直接引用指针名时，返回的是指针指向的地址。由于 `p0`{lang="c"}、`p1`{lang="c"} 地址不同，因此 `p1 == p2`{lang="c"} 不为真，返回 `0`{lang="c"}。`strcmp()`{lang="c"} 为字符串比较函数，从传入的两个地址参数开始向后读取字符并比较，直到出现不同的字符或者 `\0`{lang="c"} 为止，返回正数、负数或 0（相应字符的 ASCII 码之差有关），分别表示前者大、后者大、两者相等。当读到 `p0`{lang="c"} 的 `\0`{lang="c"} 时，此时 `p2`{lang="c"} 的下一个字符为内存中的随机值。因此打印的第一行为：

    p0 == p1: 0, strcmp(p0, p2): -72

`sizeof(p0)`{lang="c"} 是字符数组(含 `'\0'`{lang="c"} 以及未初始化的内容)的大小，`sizeof(p1)`{lang="c"} 是指针所存地址的大小，`sizeof(*p2)`{lang="c"} 是字符 `'H'`{lang="c"} 的大小。因此打印的第二行为：

    sizeof(p0): 12, sizeof(p1): 8, sizeof(*p2): 1

`strlen()`{lang="c"} 返回字符串的长度，从传入的地址参数开始读取，直到内存中的下一个 `'\0'`{lang="c"} 之前，返回读取的字符个数，

    strlen(p0): 11, strlen(p1): 11

另外，由于 `p2`{lang="c"} 长度限制，数组内没有 `'\0'`{lang="c"} 作字符串结束的标识符，因此 `strlen(p2)`{lang="c"} 返回的是数组首位到内存随机内容的下一个 `'\0'`{lang="c"}，其返回值应该很大，具体结果视内存而定。

## 3. 换个变量名不行吗？

> 请结合本题，分别谈谈你对C语言中「全局变量」和「局部变量」的「生命周期」理解。
>
> ```c
> int a = 3;
> void test() {
>     int a = 1;
>     a += 1;
>     {
>         int a = a + 1;
>         printf("a = %d\n", a);
>     }
>     printf("a = %d\n", a);
> }
> int main(void) {
>     test();
>     printf("a= %d\n", a);
> }
> ```

打印第一个a的内容不符合预期，因为代码块作用域内的局部变量a在声明时遇到了 `Undefined behavior`，a的值视具体的编译器、系统、平台而定。

> [浅谈 C++ Undefined Behavior](https://zhuanlan.zhihu.com/p/391088391)

## 4. 内存对不齐

> `union`{lang="c"} 与 `struct`{lang="c"} 各有什么特点呢，你了解他们的内存分配模式吗。
>
> ```c
> typedef union {
>     long l;
>     int i[5];
>     char c;
> } UNION;
> typedef struct {
>     int like;
>     UNION coin;
>     double collect;
> } STRUCT;
> int main(void) {
>     printf("sizeof (UNION) = %zu\n", sizeof(UNION));
>     printf("sizeof (STRUCT) = %zu\n", sizeof(STRUCT));
> }
> ```

    sizeof (long) = 4
    sizeof (int[5]) = 20
    sizeof (char) = 1

`union`{lang="c"} 中的所有数据成员共享同一个存储空间，其在内存中的大小为最大成员的大小，因此 `UNION`{lang="c"} 的大小应该为 `20`{lang="c"}。

    sizeof (int) = 4
    sizeof (UNION) = 20
    sizeof (double) = 8

`struct`{lang="c"} 中的每个数据成员享有独立的存储空间，其在内存中的大小为所有成员的大小之和。因此 `STRUCT`{lang="c"} 的大小应该为 `32`{lang="c"}。

真的是这样吗？

在计算机中，为了方便读取数据，内存中各数据的起始地址通常都是4或8的倍数。因此结果很可能如下：

    sizeof (UNION) = 24
    sizeof (STRUCT) = 40

> [C/C++内存对齐详解 - 知乎专栏](https://zhuanlan.zhihu.com/p/30007037)
>
> [Data alignment: Straighten up and fly right - IBM Developer](https://developer.ibm.com/articles/pa-dalign/)

- 若是4字节对齐：
  ```c
  typedef union {
      long l;         // 0 ~ 3
      int i[5];       // 0 ~ 19
      char c;         // 0 ~ 7
  } UNION;            // 0 ~ 19 -> 20
  typedef struct {
      int like;       // 0 ~ 3
      UNION coin;     // 4 ~ 23
      double collect; // 23 ~ 30
  } STRUCT;           // 0 ~ 31 -> 32
  ```
- 若是8字节对齐：
  ```c
  typedef union {
      long l;         // 0 ~ 3
      int i[5];       // 0 ~ 19
      char c;         // 0 ~ 7
  } UNION;            // 0 ~ 23 -> 24
  typedef struct {
      int like;       // 0 ~ 3
      UNION coin;     // 8 ~ 27
      double collect; // 32 ~ 39
  } STRUCT;           // 0 ~ 39 -> 40
  ```

## 5. Bitwise

> - 请使用纸笔推导出程序的输出结果。
> - 请谈谈你对位运算的理解。
>
> ```c
> int main(void) {
>     unsigned char a = 4 | 7;
>     a <<= 3;
>     unsigned char b = 5 & 7;
>     b >>= 3;
>     unsigned char c = 6 ^ 7;
>     c = ~c;
>     unsigned short d = (a ^ c) << 3;
>     signed char e = -63;
>     e <<= 2;
>     printf("a: %d, b: %d, c: %d, d: %d\n", a, b, c, (char)d);
>     printf("e: %#x\n", e);
> }
> ```

按步骤执行：

```c
#include <stdio.h>
int main(void) {
    unsigned char a = 4 | 7;
    // a = 0000 0010 | 0000 0111 = 0000 0111 -> 7
    a <<= 3;
    // a = 0011 1000 = 28
    unsigned char b = 5 & 7;
    // b = 0000 0101 & 0000 0111 = 0000 0111 -> 7
    b >>= 3;
    // b = 0000 0000 = 0
    unsigned char c = 6 ^ 7;
    // c = 0000 0110 ^ 0000 0111 = 0000 0001 -> 1
    c = ~c;
    // c = 1111 1110 -> (unsigned) 254
    unsigned short d = (a ^ c) << 3;
    // d = (0011 1000 ^ 1111 1110) << 3
    //   = 1100 0110 << 3
    //   = 0000 0110 0011 0000 -> 1584
    signed char e = -63;
    // e = 1100 0001
    e <<= 2;
    // e = 0000 0100

    // 作为char类型打印d，只保留低八位
    // (char)d = 0011 0000 -> 48
    printf("a: %d, b: %d, c: %d, d: %d\n", a, b, c, (char)d);
    // 56, 0, 254, 48
    printf("e: %#x\n", e);
    // 0x4
    return 0;
}
```

## 6. 英译汉

> 请说说下面数据类型的含义，谈谈 `const`{lang="c"} 的作用。
> 1. `char *const p`{lang="c"}。
> 2. `char const *p`{lang="c"}。
> 3. `const char *p`{lang="c"}。

1. `char *const p`{lang="c"} 指 `*p`{lang="c"} 是个常量型字符指针，其中所存的地址不能改变。
2. `char const *p`{lang="c"} 指字符指针 `*p`{lang="c"} 指向的字符是个常量，所指字符的内容不能改变，但可以改变 `*p`{lang="c"} 指向的地址。
3. `const char *p`{lang="c"} 指字符指针 `*p`{lang="c"} 指向的字符是个常量，所指字符的内容不能改变，但可以改变 `*p`{lang="c"} 指向的地址。

## 7. 汉译英

> 请用变量 `p`{lang="c"} 给出下面的定义:
> 1. 含有10个指向 `int`{lang="c"} 的指针的数组。
> 2. 指向含有10个 `int`{lang="c"} 数组的指针。
> 3. 含有3个「指向函数的指针」的数组，被指向的函数有1个 `int`{lang="c"} 参数并返回 `int`{lang="c"}。

1. 含有10个指向 `int`{lang="c"} 的指针的数组。
   ```c
   int *p[10];
   ```
2. 指向含有10个 `int`{lang="c"} 数组的指针。
   ```c
   int arr[10];
   int *p = (int*)arr;
   ```
3. 含有3个「指向函数的指针」的数组，被指向的函数有1个 `int`{lang="c"} 参数并返回 `int`{lang="c"}。
   ```c
   int (*p[3])(int arg);
   ```

## 8. 混乱中建立秩序

> 你对排序算法了解多少呢?
> 请谈谈你所了解的排序算法的思想、稳定性、时间复杂度、空间复杂度。
>
> 提示：动动你的小手敲出来更好哦~

- 冒泡排序
  ```c
  void bubbleSort(int arr[], int len)
  {
      int i, j, tmp;
      for (i = 0; i < len - 1; i++)
          for (j = 0; j < len - 1 - i; j++)
              if (arr[j] > arr[j + 1])
              {
                  tmp = arr[j];
                  arr[j] = arr[j + 1];
                  arr[j + 1] = tmp;
              }
  }
  ```
- 选择排序
  ```c
  void selectionSort(int arr[], int len)
  {
      int i, j;
      for (i = 0; i < len - 1; i++)
      {
          int min = i;
          for (j = i + 1; j < len; j++)
              if (arr[j] < arr[min])
                  min = j;
          int tmp = arr[min];
          arr[min] = &arr[i];
          &arr[i] = tmp;
      }
  }
  ```

> https://github.com/hustcc/JS-Sorting-Algorithm

## 9. 手脑并用

> 请实现ConvertAndMerge函数：
> 拼接输入的两个字符串，并翻转拼接后得到的新字符串中所有字母的大小写。
>
> 提示：你需要为新字符串分配空间。
>
> ```c
> char* convertAndMerge(/*补全签名*/);
> int main(void) {
>     char words[2][20] = {"Welcome to Xiyou ", "Linux Group 2022"};
>     printf("%s\n", words[0]);
>     printf("%s\n", words[1]);
>     char *str = convertAndMerge(words);
>     printf("str = %s\n", str);
>     free(str);
> }
> ```

```c
#include <stdio.h>
#include <string.h>
char *convertAndMerge(char strs[2][20])
{
    char *result = (char *)malloc(sizeof(char) * 40);
    strcpy(result, strs[0]);
    strcat(result, strs[1]);
    int len = strlen(strs[0]) + strlen(strs[1]);
    for (int i = 0; i < len; i++)
    {
        if (result[i] >= 'A' && result[i] <= 'Z')
            result[i] += 32;
        else if (result[i] >= 'a' && result[i] <= 'z')
            result[i] -= 32;
    }
    return result;
}
int main(void)
{
    char words[2][20] = {"Welcome to Xiyou ", "Linux Group 2022"};
    printf("%s\n", words[0]);
    printf("%s\n", words[1]);
    char *str = convertAndMerge(words);
    printf("str = %s\n", str);
    free(str);
}
```

## 10. 给你我的指针，访问我的心声

> 程序的输出有点奇怪，请尝试解释一下程序的输出吧。
>
> ```c
> int main(int argc, char **argv) {
>     int arr[5][5];
>     int a = 0;
>     for (int i = 0; i < 5; i++) {
>         int *temp = *(arr + i);
>         for (; temp < arr[5]; temp++) *temp = a++;
>     }
>     for (int i = 0; i < 5; i++) {
>         for (int j = 0; j < 5; j++) {
>             printf("%d\t", arr[i][j]);
>         }
>     }
> }
> ```

运行后，程序的输出为：

    0       1       2       3       4
    25      26      27      28      29
    45      46      47      48      49
    60      61      62      63      64
    70      71      72      73      74

程序在运行时，`a`{lang="c"} 是稳定自增的值，输出为此结果的原因是程序在每次循环时，将 `a`{lang="c"} 的值从 `arr[i]`{lang="c"} 的起始（`*temp = *(arr + i)`{lang="c"}）赋值到数组的结尾。比如在第二次循环时，`a`{lang="c"} 从 `25`{lang="c"} 自增到 `44`{lang="c"} 的序列会从 `arr[1][0]`{lang="c"} 赋值到 `arr[4][4]`{lang="c"}，覆盖了第一次循环后原先位置的 `5`{lang="c"} 到 `24`{lang="c"}。

如果将循环条件中的 `temp < arr[5]`{lang="c"}，改为 `temp < arr[i+1]`{lang="c"}，程序在每次循环时就会只对 `arr[i]`{lang="c"} 内的元素进行操作，如下。

```c
#include <stdio.h>
int main(int argc, char **argv) {
    int arr[5][5];
    int a = 0;
    for (int i = 0; i < 5; i++) {
        int *temp = *(arr + i);
        for (; temp < arr[i+1]; temp++) *temp = a++;
    }
    for (int i = 0; i < 5; i++) {
        for (int j = 0; j < 5; j++) {
            printf("%d\t", arr[i][j]);
        }
    }
}
```

    0       1       2       3       4
    5       6       7       8       9
    10      11      12      13      14
    15      16      17      18      19
    20      21      22      23      24

## 11. 奇怪的参数

> 你了解argc和argv吗？
> 直接运行程序argc的值为什么是1？
> 程序会出现死循环吗？
>
> ```c
> #include <stdio.h>
> int main(int argc, char **argv) {
>     printf("argc = %d\n", argc);
>     while (1) {
>         argc++;
>         if (argc < 0) {
>             printf("%s\n", (char *)argv[0]);
>             break;
>         }
>     }
> }
> ```

`argc`{lang="c"} 指argument count，即参数计数器，`argv`{lang="c"} 指argument vector，即参数数组。程序在运行时传入的第一个参数就是程序的启动路径/文件名，因此 `argc`{lang="c"} 最小为`1`{lang="c"}。在循环中，`int argc`{lang="c"} 会自增到溢出，然后打印 `argv[0]`{lang="c"} 即程序路径。

## 12. 奇怪的字符

> 程序的输出有点奇怪，请尝试解释一下程序的输出吧。
>
> ```c
> int main(int argc, char **argv) {
>     int data1[2][3] = {{0x636c6557, 0x20656d6f, 0x58206f74},
>                        {0x756f7969, 0x6e694c20, 0x00000000}};
>     int data2[] = {0x47207875, 0x70756f72, 0x32303220, 0x00000a32};
>     char *a = (char *)data1;
>     char *b = (char *)data2;
>     char buf[1024];
>     strcpy(buf, a);
>     strcat(buf, b);
>     printf("%s \n", buf);
> }
> ```

程序的输出为：

    Welcome to Xiyou Linux Group 2022

文本在变量中的存储对应关系如下：

```c
//                     c l e W       e m o     X   o t
int data1[2][3] = {{0x636c6557, 0x20656d6f, 0x58206f74},
                   //  u o y i     n i L            \0
                   {0x756f7969, 0x6e694c20, 0x00000000}};
//                G   x u     p u o r     2 0 2             2
int data2[] = {0x47207875, 0x70756f72, 0x32303220, 0x00000a32};
// unsigned char buf[33] = {
//     0x57, 0x65, 0x6C, 0x63, 0x6F, 0x6D, 0x65, 0x20, 0x74, 0x6F, 0x20, 0x58,
//     0x69, 0x79, 0x6F, 0x75, 0x20, 0x4C, 0x69, 0x6E, 0x75, 0x78, 0x20, 0x47,
//     0x72, 0x6F, 0x75, 0x70, 0x20, 0x32, 0x30, 0x32, 0x32};
```

程序运行时，会把 `data[1]`{lang="c"} 和 `data[2]`{lang="c"} 中的字符串拼接起来，然后输出。

字符之所以“反向存储”，是因为在计算机中，为了方便某些设备的读取，采用了“小端序”(Little-endian)的存储方式：低位字节排放在内存的低地址端即该值的起始地址，高位字节排放在内存的高地址端。

与此相对的自然是“大端序”(Big-endian)，常见于文件存储、网络传输中。

## 13. 小试宏刀

> - 请谈谈你对 `#define`{lang="c"} 的理解。
> - 请尝试着解释程序的输出。
>
> ```c
> #define SWAP(a, b, t) t = a; a = b; b = t
> #define SQUARE(a) a *a
> #define SWAPWHEN(a, b, t, cond) if (cond) SWAP(a, b, t)
> int main() {
>     int tmp;
>     int x = 1;
>     int y = 2;
>     int z = 3;
>     int w = 3;
>     SWAP(x, y, tmp);
>     printf("x = %d, y = %d, tmp = %d\n", x, y, tmp);
>     if (x > y) SWAP(x, y, tmp);
>     printf("x = %d, y = %d, tmp = %d\n", x, y, tmp);
>     SWAPWHEN(x, y, tmp, SQUARE(1 + 2 + z++ + ++w) == 100);
>     printf("x = %d, y = %d\n", x, y, tmp);
>     printf("z = %d, w = %d, tmp = %d\n", z, w, tmp);
> }
> ```

    x = 2, y = 1, tmp = 1
    x = 1, y = 2, tmp = 2
    x = 2, y = 2
    z = 5, w = 5, tmp = 2

宏定义只是实现了**简单的文本替换**，不会自动为表达式补充圆括号或者为代码块补充花括号。因此，宏定义替换后等效于如下代码：

```c
#include <stdio.h>
int main()
{
    int tmp;
    int x = 1;
    int y = 2;
    int z = 3;
    int w = 3;
    // SWAP(x, y, tmp);
    tmp = x;
    x = y;
    y = tmp;
    printf("x = %d, y = %d, tmp = %d\n", x, y, tmp);
    // x = 2, y = 1, tmp = 1
    // if (x > y) SWAP(x, y, tmp);
    if (x < y)
        tmp = x;
    // 无论如何以下两行都执行
    x = y;
    y = tmp;
    printf("x = %d, y = %d, tmp = %d\n", x, y, tmp);
    // x = 1, y = 2, tmp = 2
    // SWAPWHEN(x, y, tmp, SQUARE(1 + 2 + z++ + ++w) == 100);
    // 宏替换并不会为SQUARE()函数的参数加括号
    if (1 + 2 + z++ + ++w * 1 + 2 + z++ + ++w == 100)
        tmp = x;
    x = y;
    y = tmp;
    printf("x = %d, y = %d", x, y, tmp);
    // x = 2, y = 2
    printf("z = %d, w = %d, tmp = %d\n", z, w, tmp);
    // z = 5, w = 5 ,tmp = 2
}
```

如此修改，便可令程序按预期执行。

```c
#include <stdio.h>
#include <math.h>
#define SWAP(a, b, t) { t = a; a = b; b = t; }
#define SQUARE(a) pow(a, 2)
#define SWAPWHEN(a, b, t, cond) if (cond) { SWAP(a, b, t) }
int main() {
    int tmp;
    int x = 1;
    int y = 2;
    int z = 3;
    int w = 3;
    SWAP(x, y, tmp);
    printf("x = %d, y = %d, tmp = %d\n", x, y, tmp);
    if (x > y) SWAP(x, y, tmp);
    SWAPWHEN(x, y, tmp, SQUARE(1 + 2 + z++ + ++w) == 100);
    printf("x = %d, y = %d\n", x, y, tmp);
    printf("z = %d, w = %d ,tmp = %d\n", z, w, tmp);
}
```

## 14. GNU/Linux命令 (选做)

> 你知道以下命令的含义和用法吗：
>
> 注：
> > 嘿！你或许对Linux命令不是很熟悉，甚至你没听说过Linux。\
> > 但别担心，这是选做题，不会对你的面试产生很大的影响！\
> > 了解Linux是加分项，但不了解也不扣分哦！
> - `ls`{lang="sh"}
> - `rm`{lang="sh"}
> - `whoami`{lang="sh"}
>
> 请问你还了解哪些GNU/Linux的命令呢。

- `ls`{lang="sh"} 即 `list directory contents` ，列出目前工作目录所含之文件及子目录（显示指定工作目录下之内容）。

- `rm`{lang="sh"} 即 `remove`，用于删除一个文件或者目录，慎用。

- `whoami`{lang="sh"} 用来打印当前执行操作的用户名，与此相似的 `who am i`{lang="sh"} 则用来打印登陆当前 Linux 系统的用户名。

- 实用的文件工具有 `mv`{lang="sh"}、`touch`{lang="sh"}、`mkdir`{lang="sh"}、`cp`{lang="sh"}、`chmod`{lang="sh"} 等。

- 实用的网络工具有 `nc`{lang="sh"}、`netstat`{lang="sh"}、`ping`{lang="sh"} 等。

> 恭喜你做到这里！你的坚持战胜了绝大多数看到这份试题的同学。\
> 或许你自己对答题的表现不满意，但别担心，请自信一点呐。\
> 坚持到达这里已经证明了你的优秀。\
> 还在等什么，快带上你的笔记本电脑，来FZ103面试吧!
