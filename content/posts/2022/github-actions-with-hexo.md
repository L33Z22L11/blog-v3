---
title: 利用Github Actions自动化部署你Hexo博客
date: 2022-08-25 22:01:13
updated: 2022-12-9 14:15
image: https://xlenco.onmicrosoft.cn/img/7bf185e5.webp
description: 这篇文章介绍了GitHub Actions的概念和使用方式。如何使用Github Actions自动化部署Hexo博客
---
### Github Actions概念

GitHub Actions 是一个持续集成和持续交付 (CI/CD) 平台，可用于自动执行构建、测试和部署管道。 您可以创建工作流程来构建和测试存储库的每个拉取请求，或将合并的拉取请求部署到生产环境。

GitHub Actions 不仅仅是 DevOps，还允许您在存储库中发生其他事件时运行工作流程。 例如，您可以运行工作流程，以便在有人在您的存储库中创建新问题时自动添加相应的标签。

GitHub 提供 Linux、Windows 和 macOS 虚拟机来运行工作流程，或者您可以在自己的数据中心或云基础架构中托管自己的自托管运行器。

Git推送到Github库的常用连接方案是HTTPS和SSH这两种连接方式。

所以Actions自动化也大致分为两种。

# HTTPS连接部署方式

### 获取 Github token

1. 获取Github access tokens
打开https://github.com/settings/tokens
点击Generate new token新建个token
![](https://cdn-ak.f.st-hatena.com/images/fotolife/x/xlenco/20240621/20240621085318.jpg)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/x/xlenco/20240621/20240621085431.jpg)

## 创建存放Hexo源码的私有仓库

创建完成后，需要把博客的源码`push`到这里。首先获取远程仓库地址，同样`SSH`和`HTTPS`均可。`SSH`在绑定过`ssh key`的设备上无需再输入密码，`HTTPS`则需要输入密码，但是`SSH`偶尔会遇到端口占用的情况。

完成上述操作后新建`[Blogroot].github/workflows/autodeploy.yml`

```
# 当有改动推送到master分支时，启动Action
name: 自动部署

on:
  push:
    branches:
      - main 

  release:
    types:
      - published

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: 检查分支
      uses: actions/checkout@v2
      with:
        ref: main

    - name: 安装 Node
      uses: actions/setup-node@v1
      with:
        node-version: "16.x"

    - name: 安装 Hexo
      run: |
        export TZ='Asia/Shanghai'
        npm install hexo-cli -g

    - name: 缓存 Hexo
      uses: actions/cache@v1
      id: cache
      with:
        path: node_modules
        key: ${{runner.OS}}-${{hashFiles('**/package-lock.json')}}

    - name: 安装依赖
      if: steps.cache.outputs.cache-hit != 'true'
      run: |
        npm install --save

    - name: 生成静态文件
      run: |
        hexo clean
        hexo generate

    - name: 部署 #此处master:master 指从本地的master分支提交到远程仓库的master分支(不是博客的分支写master即可)，若远程仓库没有对应分支则新建一个。如有其他需要，可以根据自己的需求更改。
      run: |
        cd ./public
        git init
        git config --global user.name '${{ secrets.GITHUBUSERNAME }}'
        git config --global user.email '${{ secrets.GITHUBEMAIL }}'
        git add .
        git commit -m "${{ github.event.head_commit.message }} $(date +"%Z %Y-%m-%d %A %H:%M:%S") Updated By Github Actions"
        git push --force --quiet "https://${{ secrets.GITHUBUSERNAME }}:${{ secrets.GITHUBTOKEN }}@github.com/${{ secrets.GITHUBUSERNAME }}/${{ secrets.GITHUBUSERNAME }}.github.io.git" master:master
```

## 添加环境变量

### 变量声明
| 变量名 | 常量释义 |
| --- | --- |
| [Blogroot] | 本地存放博客源码的文件夹路径 |
| GITHUBUSERNAME | Github用户名 |
| GITHUBTOKEN | Github用户邮箱地址 |
| TOKENUSER | 你部署服务的Secrets/例如GITHUBTOKEN |
| GITHUBTOKEN | Github 密钥 |


在你仓库的`Settings->Secrets->actions`

![](https://cdn-ak.f.st-hatena.com/images/fotolife/x/xlenco/20240621/20240621085424.jpg)

## 查看部署情况

此时，打开GIthub存放源码的私有仓库，找到action。

![](https://cdn-ak.f.st-hatena.com/images/fotolife/x/xlenco/20240621/20240621085418.jpg)

![](https://cdn-ak.f.st-hatena.com/images/fotolife/x/xlenco/20240621/20240621085428.jpg)

根据刚刚的Commit记录找到相应的任务,点击Deploy查看部署情况 , 若全部打钩，恭喜你，你现在可以享受自动部署的快感了。

# SS H 连接部署方式

### 生成公私秘钥

终端中执行：

```
ssh-keygen -t rsa -C "Github 的邮箱地址"
```

之前生成过可以忽略此步骤

### 在 Github 新建 action 流

在 Github 库根目录新建`workflows` 文件夹，并在workflows 文件夹中创建 `Hexo Deploy.yml`
内容如下：

```
# 自动化名称
name:  Hexo Deploy

# 触发条件
on:
  push:
    branches:
      - main

# 设置环境
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      # check it to your workflow can access it
      # from: https://github.com/actions/checkout
      - name: Checkout Repository master branch
        uses: actions/checkout@master

      # from: https://github.com/actions/setup-node
      - name: Setup Node.js 16.x
        uses: actions/setup-node@master
        with:
          node-version: "16.x"

      - name: 安装Hexo
        run: |
          npm install hexo-cli -g
          npm install

      - name: 设置密钥
        env:
          HEXO_DEPLOY_PRIVATE_KEY: ${{ secrets.HEXO_DEPLOY_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh/
          echo "$HEXO_DEPLOY_PRIVATE_KEY" > ~/.ssh/id_rsa 
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts  

      - name: 设置Git信息
        run: |
          git config --global user.name '你GitHub的用户名' 
          git config --global user.email '你GitHub的邮箱'      

      - name: Hexo三连
        run: |
          hexo clean
          hexo generate 
          hexo deploy
```

配置公钥： 在 Github 网站–>Settings–>SSH and GPG keys里，名称为HEXO_DEPLOY_PRIVATE_KEY，内容为.ssh/id_rsa.pub里的

配置私钥： 在私有仓库的 Settings->Secrets 里，名称为HEXO_DEPLOY_PRIVATE_KEY，内容为.ssh/id_rsa里的，注意复制的时候可能会多一个空格，注意要把它删掉。
然后就大功告成了！
