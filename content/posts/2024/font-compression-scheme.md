---
title: 前端字体压缩方案
image: https://xlenco-img.s3.bitiful.net/i/2024/10/e308bb926c6e3323783e6c536edc136f.webp
date: 2024-03-09 00:00:00
updated: 2024-03-09 00:00:00
description: 这篇文章介绍了Fontmin，一个纯JS实现的字体子集化工具，它能够从TTF字体文件中提取所需的字符并生成新的TTF文件，以此达到压缩效果
---
## Fontmin
Fontmin 是一个纯 JS 字体子集化方案。利用 Fontmin 可以提取 TTF 字体文件中需要用到的字符，然后转换为 TTF 文件输出，从而实现“压缩”的效果
官网地址：[ecomfe.github.io/fontmin/](https://ecomfe.github.io/fontmin)
## 安装Fontmin
```shell
npm install --save fontmin
```
创建个font.js文件
> 名字可以随意，主要是等会运行用

```
var Fontmin = require("fontmin")

var fontmin = new Fontmin()
  .src("./src/assets/font/example.ttf")
  .dest("./src/assets/fontmin/")
  .use(
    Fontmin.glyph({
      text: "这里写你要压缩的文字"
    })
  )

fontmin.run(function(err, files) {
  if (err) {
    throw err
  }
})

```
这是 fontmin 文档上的用法，还有其他用法可以去看看 GitHub 上的文档：[fontmin](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fecomfe%2Ffontmin)
然后用 node 执行一下命令：
```
shell
复制代码node .\font.js
```
## 进阶
上述方案如果遇到大量的文字压缩的需求是很麻烦的，实际项目中我们也不可能手动把所有文字都写出来放到 ${text} 中去。接下来搞一下读取文件的功能，读取其中包含的所有字符。
```
const fs = require("fs")

fs.readFile("./idenx.html", (err, data) => {
  if (err) {
    console.log(err)
  }
  const mySet = new Set(data.toString()) // 去重的目的
  console.log(Array.from(mySet).join(""))
})

```
## 完整代码
以下源码来自：[zhuanlan.zhihu.com/p/48318293](https://link.juejin.cn/?target=https%3A%2F%2Fzhuanlan.zhihu.com%2Fp%2F48318293)
```
const fs = require("fs")
const Fontmin = require("fontmin") // 需要借助 fontmin 插件
let set = new Set()

//get all possible characters
const scanFolder = (dir, done) => {
  let results = []
  fs.readdir(dir, (err, list) => {
    if (err) {
      return done(err)
    }
    let i = 0
    ;(function iter() {
      // 这里的立即函数触发了闭包，使results的值一直保存
      let file = list[i++]
      if (!file) {
        // iterator遍历，file不存在即为执行完成状态
        return done(null, results)
      }
      file = dir + "/" + file
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          scanFolder(file, (err, res) => {
            // 重新调用方法，获取子目录下的目录结构
            results = results.concat(res)
            iter()
          })
        } else {
          results.push(file)
          iter() // 执行下一步
        }
      })
    })()
  })
}

//get all possible characters
const generateFinalHTML = finalString => {
  const fontmin = new Fontmin()
    .src("./src/assets/font/SourceHanSansCN-Regular.ttf") // 源字体文件路径
    .dest("./src/assets/font/fontmin/") // 压缩后文件存放路径，最终使用的是这个压缩后的文件
    .use(
      Fontmin.glyph({
        text: finalString, // 也可以直接指定需要生成的字符集
        hinting: false
      })
    )

  fontmin.run(err => {
    if (err) {
      throw err
    }
  })
}

//get all possible characters
// 指定扫描路径，注意路径不同，会导致最终扫描到的字符数不同
scanFolder("src/views", (n, results) => {
  results.forEach(file => {
    const result = fs.readFileSync(file, "utf8")
    const currentSet = new Set(result)
    // 获取到每个文件中的字符，并存储到set集中
    set = new Set([...set, ...currentSet])
  })
  generateFinalHTML(Array.from(set).join(""))
  console.log("共生成：" + Array.from(set).length + "个字符")
})

```
## 后言
如果你的需求量不大也可以用客户端
![20240620210351](https://cdn-ak.f.st-hatena.com/images/fotolife/x/xlenco/20240620/20240620210351.png)
客户端下载：
网盘：[https://www.123pan.com/s/IlX7jv-GSJk3.html](https://www.123pan.com/s/IlX7jv-GSJk3.html)
官网（Github）: [https://github.com/ecomfe/fontmin-app/releases/download/v0.2.0/Fontmin-v0.2.0-win64.zip](https://github.com/ecomfe/fontmin-app/releases/download/v0.2.0/Fontmin-v0.2.0-win64.zip)
