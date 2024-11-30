---
title: 西邮Linux兴趣小组2020纳新面试题题解
description: ''
date: 2022-11-20 13:57:19
updated: 2023-11-10 21:08:28
image: https://7.isyangs.cn/24/65a8dcfb73493-24.jpg
categories: [代码]
tags: [实验室, Lab, C语言]
---

> 注：
> 1. 本题仅作为面试有限参考
> 2. 为节省版面，省去所有 `#include`{lang="c"} 指令
> 3. 题目难度与序号无关
> 4. 若无特殊声明，均假设在 `Linux x86_64 GCC` 编译器环境下

相比于2022年和2021年的小组面试题，此题难度较低，故只做代码层次的解读。相关知识点请移步 [西邮Linux兴趣小组2022纳新面试题题解](/2022/linux-interview-2022) 和 [西邮Linux兴趣小组2021纳新面试题题解](/2022/linux-interview-2021)。

## 1. 请试着解释其输出。

> ```c
> int main(int argc, char *argv[]) {
>     unsigned char a = 255;
>     char ch = 128;
>     a -= ch;
>     printf("a = %d ch = %d\n", a, ch);
> }
> ```

解读：

```c
#include <stdio.h>
int main(int argc, char *argv[]) {
    unsigned char a = 255;
    char ch = 128;
    // char overflows to -128
    a -= ch;
    printf("a = %d ch = %d\n", a, ch);
    // a = 127, ch = -128
}
```

## 2. 下面代码的运行输出结果是什么，并说说你的理解。

> ```c
> int main(int argc, char *argv[]) {
>     char *str = "Xi You Linux Group 20";
>     printf("%d\n", printf(str));
>     return 0;
> }
> ```

解读：

```c
#include <stdio.h>
int main(int argc, char *argv[]) {
    char *str = "Xi You Linux Group 20";
    printf("%d\n", printf(str));
    // printf(str) returns the length of the string, 21
    // So the result is "Xi You Linux Group 2021"
    return 0;
}
```

## 3. 这段代码的输出结果是什么？为什么会出现这样的结果？

> ```c
> int i = 2;
> void func() {
>     if(i != 0) {
>     static int m = 0;
>     int n = 0;
>     n++;
>     m++;
>     printf("m = %d, n = %d\n", m, n);
>     i--;
>     func();
>     } else {
>     return;
>     }
> }
> int main(int argc, char *argv[]) {
>     func();
>     return 0;
> }
> ```

解读：

```c
#include <stdio.h>
int i = 2;
void func() {
    if(i != 0) {
    static int m = 0;
    int n = 0;
    n++;
    m++;
    // m = 1, n = 1
    printf("m = %d, n = %d\n", m, n);
    i--;
    func();
    // loop once, then m = 2, n = 1, i = 0 and exit loop
    } else {
    return;
    }
}
int main(int argc, char *argv[]) {
    func();
    return 0;
}
```

## 4. 下面程序会出现什么结果？为什么会出现这样的结果？

> ```c
> int main(int argc, char * argv[]) {
>     char ch = 'A';
>     int i = 65;
>     unsigned int f = 33554433;
>     *(int *)&f >>= 24;
>     *(int *)&f = *(int *)&f + '?';
>     printf("ch = %c i = %c f = %c\n", ch, i, *(int *)&f);
>     return 0;
> }
> ```

解读：

```c
#include <stdio.h>
int main(int argc, char * argv[]) {
    char ch = 'A';
    int i = 65;
    unsigned int f = 33554433;
    // f = 0000 0010 0000 0000 0000 0000 0000 0001
    *(int *)&f >>= 24;
    // f = 0000 0000 0000 0000 0000 0000 0000 0010
    *(int *)&f = *(int *)&f + '?';
    // *(int *)&f = 2 + 63 = 65
    // ch = 'A', i = 'A', f = 'A'
    printf("ch = %c i = %c f = %c\n", ch, i, *(int *)&f);
    return 0;
}
```

## 5. 下面代码的运行输出结果是什么，并说说你的理解。

> ```c
> int main(int argc, char *argv[]) {
>     int a[2][2];
>     printf("&a   = %p \t &a[0]   = %p \t &a[0][0]   = %p \n",
>            &a, &a[0], &a[0][0]);
>     printf("&a+1 = %p \t &a[0]+1 = %p \t &a[0][0]+1 = %p \n",
>            &a+1, &a[0] + 1, &a[0][0] + 1);
>     return 0;
> }
> ```

解读：

```c
#include <stdio.h>
int main(int argc, char *argv[]) {
    int a[2][2];
    // &a, &a[0] and &a[0][0] all refer to the address of a[0][0]
    printf("&a   = %p \t &a[0]   = %p \t &a[0][0]   = %p \n",
           &a, &a[0], &a[0][0]);
    // &a + 1 actually returns &a + sizeof(a)
    // &a[0] + 1 actually returns &a + sizeof(a[0])
    // &a[0][0] + 1 actually returns &a + sizeof(a[0][0])
    printf("&a+1 = %p \t &a[0]+1 = %p \t &a[0][0]+1 = %p \n",
           &a+1, &a[0] + 1, &a[0][0] + 1);
    return 0;
}
```

## 6. 下列程序的功能是什么？有什么问题，你能找出问题并解决它吗？

> ```c
> int* get_array() {
>     int array[1121];
>     for (int i = 0; i < sizeof(array) / sizeof(int); i++) {
>         array[i] = i;
>     }
>     return array;
> }
> int main(int argc, char *argv[]) {
>     int *p = get_array();
> }
> ```

解读：

```c
#include <stdio.h>
int* get_array() {
    int array[1121];
    for (int i = 0; i < sizeof(array) / sizeof(int); i++) {
        array[i] = i;
    }
    // How dare you return this!?
    return array;
}
int main(int argc, char *argv[]) {
    // get_array() returns the unusable address of a local variable,
    // the content of whom was discarded, but you can declare
    // a static variable in get_array() and return it to avoid so
    int *p = get_array();
}
```

## 7. 下面代码的运行输出结果是什么，并说说你的理解。

> ```c
> int main(int argc, char *argv[]) {
>     char str[] = "XiyouLinuxGroup";
>     char *p = str;
>     char x[] = "XiyouLinuxGroup\t\106F\bamily";
>     printf("%zu %zu %zu %zu\n", sizeof(str), sizeof(p),
>                                 sizeof(x), strlen(x));
>     return 0;
> }
> ```

解读：

```c
#include <stdio.h>
int main(int argc, char *argv[]) {
    char str[] = "XiyouLinuxGroup";
    char *p = str;
    char x[] = "XiyouLinuxGroup\t\106F\bamily";
    // XiyouLinuxGroup Family
    // sizeof(str) = 16, containing '\0' at the end
    // sizeof(p) = 8, 'cuz p is a char pointer,
    // only storing the address of variable str
    // sizeof(x) = 24, containing '\0' at the end
    // strlen(x) = 24, 'cuz of '\b', 'F' is covered by 'a'
    printf("%zu %zu %zu %zu\n", sizeof(str), sizeof(p),
                                sizeof(x), strlen(x));
    return 0;
}
```

## 8. 如下程序，根据打印结果，你有什么思考？

> ```c
> int add(int *x, int y) {
>     return *x = (*x^y) + ((*x&y)<<1);
> }
> int a;
> int main(int argc, char *argv[]) {
>     int b = 2020;
>     if(add(&b, 1) || add(&a, 1)) {
>         printf("XiyouLinuxGroup%d\n", b);
>         printf("Waiting for y%du!\n", a);
>     }
>     if(add(&b, 1) && a++) {
>     printf("XiyouLinuxGroup%d\n", b);
>     printf("Waiting for y%du!\n", a);
> }
>   return 0;
> }
> ```

解读：

```c
#include <stdio.h>
int add(int *x, int y) {
    return *x = (*x^y) + ((*x&y)<<1);
}
int a;
int main(int argc, char *argv[]) {
    int b = 2020;
    // add(&b, 1) returns true, so add(&a, 1) is not executed
    if(add(&b, 1) || add(&a, 1)) {
        printf("XiyouLinuxGroup%d\n", b);
        printf("Waiting for y%du!\n", a);
    }
    // add(&b, 1) returns true, while a++ executed with ruturning 0,
    // so this conditional statement will not be executed
    if(add(&b, 1) && a++) {
    printf("XiyouLinuxGroup%d\n", b);
    printf("Waiting for y%du!\n", a);
}
  return 0;
}
```

## 9. 在下段程序中，我们可以通过第一步打印出 `a`{lang="c"} 的地址，假如在你的机器上面打印结果是`0x7ffd737c6db4`{lang="c"} ；我们在第二步用 `scanf`{lang="c"} 函数将这个地址值输入变量 `c`{lang="c"} 中；第三步，随机输入一个数字，请问最终输出了什么结果，你知道其中的原理吗？

> ```c
> void func() {
>     int a = 2020;
>     unsigned long c;
>     printf("%p\n", &a);
>     printf("我们想要修改的地址：");
>     scanf("%lx", &c);
>     printf("请随便输入一个数字：");
>     scanf("%d", (int *)c);
>     printf("a = %d\n", a);
> }
> ```

解读：

```c
// It's totally about the basic concept of pointers
#include <stdio.h>
void func() {
    int a = 2020;
    unsigned long c;
    // We get the address of variable a
    printf("%p\n", &a);
    printf("我们想要修改的地址：");
    // We want to modify the value on address entered
    scanf("%lx", &c);
    printf("请随便输入一个数字：");
    // And then we modified it. All done.
    scanf("%d", (int *)c);
    printf("a = %d\n", a);
}
```
## 10. 请问一个C语言程序从源代码到可执行文件中间会进行哪些过程，你能简单描述一下每个环节都做了什么事情吗？

- 编辑：创建和修改C程序的源代码
- 编译：将源代码转换为机器语言
- 链接：链接器将源代码由编译器产生的各种模块组合起来，再从C语言提供的程序库中添加必要的代码模块，将它们组成一个可执行的文件
- 执行：运行程序

## 11. 请解释一下这行代码做了什么？

> ```c
> puts((char*)(int const[]){
>     0X6F796958,0X6E694C75,0X72477875,
>     0X3270756F,0X313230,0X00000A
> });
> ```

解读：

```c
#include <stdio.h>
int main() {
    // It outputs a anoymous int array as a char array
    // using little-endian storing methods
    puts((char *)(int const[]){
        // o y i X     n i L u     r G x u
        0X6F796958, 0X6E694C75, 0X72477875,
        // 2 p u o (\0)2 1 0
        0X3270756F, 0X313230, 0X00000A});
}
```

## 12. 请随机输入一串字符串，你能解释一下输出结果吗？

> ```c
> int main(int argc, char *argv[]) {
>     char str[1121];
>     int key;
>     char t;
>     fgets(str, 1121, stdin);
>     for(int i = 0; i < strlen(str) - 1; i++) {
>         key = i;
>         for(int j = i + 1; j < strlen(str); j++) {
>             if(str[key] > str[j]) {
>                 key = j;
>             }
>         }
>         t = str[key];
>         str[key] = str[i];
>         str[i] = t;
>     }
>     puts(str);
>     return 0;
> }
> ```

这个程序使用选择排序对字符串进行了排序。

## 13. 用循环和递归求 `Fibonacci` 数列，你觉得这两种方式那种更好？说说你的看法。如果让你求 `Fibonacci` 数列的第100项，你觉得还可以用常规的方法求解吗？请试着求出前100项的值（tip大数运算）。

```c
#include <stdio.h>
long long fibo(int n) {
    if (n == 1 || n == 2) return 1;
    return fibo(n - 1) + fibo(n - 2);
}
int main() {
    int n;
    scanf("%d", &n);
    printf("%lld\n", fibo(n));
}
```

## 14. Linux 实操题

> 请通过命令创建一个目录，在该目录中创建几个后缀为 `.Linux` 的文件，然后通过命令查询这几个文件的基本属性信息（如文件大小，文件创建时间等），之后使用命令查看该目录下文件名含有“`.Linux`”的文件的数量（不包括子目录下的文件），把得到的数字写入到一个文件中，最后删除此目录。

- 创建目录
  :copy{code="mkdir my_directory"}
- 进入目录
  :copy{code="cd my_directory"}
- 创建后缀为.Linux的文件
  :copy{code="touch file{1,2,3}.Linux"}
- 查询文件的基本属性信息
  :copy{code="ls -l file*.Linux"}
- 查看包含".Linux"的文件数量
  :copy{code="ls -l file*.Linux | wc -l > file_count.txt"}
- 查看文件数量
  :copy{code="cat file_count.txt"}
- 删除目录及其内容
  :copy{code="cd .. && rm -r my_directory"}
