---
title: Artalk 评论邮件模板美化
date: 2023-1-5 11:15:00
updated: 2023-1-5 11:15:00
image: https://xlenco.onmicrosoft.cn/img/995c-826fc514f2aa.webp
description: 这篇文章介绍了作者对Artalk默认邮箱通知模板进行美化的过程。
---
## 前言

不知道大家有没有发现。感觉 Artalk 默认的邮箱通知模版感觉不够好看。刚好之前在糖果屋 🍬 群文件中发现了店长的 twikoo 信笺样式通知邮件模板，于是我就把它移植过来了。

## Dome

![](https://xlenco.onmicrosoft.cn/i/Screenshot_2023-01-05-09-48-19-65_imq0L5IdX.webp?updatedAt=1700639105635#id=opKFi&originHeight=1260&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 正文

### 1.

在 `data/mail_tpl`中新建 `MAIL_TEMPLATE.html` 文件为，为以下内容

> 其中 `mail_tpl` 文件夹默认不存在，需自行新建


```html
<head>
    <base target="_blank" />
    <style id="scrollbar" type="text/css">
        ::-webkit-scrollbar{width:0!important}pre{white-space:pre-wrap!important;word-wrap:break-word!important;*white-space:normal!important}pre{white-space:pre-wrap!important;word-wrap:break-word!important;*white-space:normal!important}#letter img{max-width:300px}
    </style>
    <style id="from-wrapstyle" type="text/css">
        #form-wrap{overflow:hidden;height:447px;position:relative;top:0px;transition:all 1s ease-in-out.3s;z-index:0}
    </style>
    <style id="from-wraphoverstyle" type="text/css">
        #form-wrap:hover{height:1300px;top:-200px}
    </style>
</head>

<body>
    <div style="width: 530px;margin: 20px auto 0;height: 1000px;">
        <div id="form-wrap"><img src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/before.png" alt="before" style="position: absolute;bottom: 126px;left: 0px;background-repeat: no-repeat;width: 530px;height: 317px;z-index:-100">
            <div style="position: relative;overflow: visible;height: 1500px;width: 500px;margin: 0px auto;transition: all 1s ease-in-out .3s;padding-top:200px;" <form>
                <div style="background: white;width: 95%;max-width: 800px;margin: auto auto;border-radius: 5px;border: 1px solid;overflow: hidden;-webkit-box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.12);box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.18);"><img style="width:100%;overflow: hidden;" src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/violet.jpg" />
                    <div style="padding: 5px 20px;"><br>
                        <div>
                            <h3 style="text-decoration: none; color: rgb(246, 214, 175);">[{{site_name}}]，见信安：</h3>
                        </div><br>
                        <div id="letter" style="overflow:auto;height:300px;width:100%;display:block;word-break: break-all;word-wrap: break-word;">
                            <p style="display: inline-block;">您在<a style="text-decoration: none;color: rgb(246, 214, 175)" target="_blank" href="{{page_title}} display: inline-block;">{{site_name}}</a>上发表的评论:</p>
                            <div style="border-bottom: #ddd 1px solid;border-left: #ddd 1px solid;padding-bottom: 20px;background-color: #eee;margin: 15px 0px;padding-left: 20px;padding-right: 20px;border-top: #ddd 1px solid;border-right: #ddd 1px solid;padding-top: 20px;font-family: " Arial", "Microsoft YaHei" , "黑体" , "宋体" , sans-serif;">{{content}}</div>
                            <p>收到了来自@{{reply_nick}}的回复：</p>
                            <div style="border-bottom: #ddd 1px solid;border-left: #ddd 1px solid;padding-bottom: 20px;background-color: #eee;margin: 15px 0px;padding-left: 20px;padding-right: 20px;border-top: #ddd 1px solid;border-right: #ddd 1px solid;padding-top: 20px;font-family: " Arial", "Microsoft YaHei" , "黑体" , "宋体" , sans-serif;">{{reply_content}}</div>
                        </div><br>
                        <div style="text-align: center;margin-top: 40px;"><img src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/line.png" alt="hr" style="width:100%; margin:5px auto 5px auto; display: block;" /><a style="text-transform: uppercase;text-decoration: none;font-size: 14px;border: 2px solid #6c7575;color: #2f3333;padding: 10px;display: inline-block;margin: 10px auto 0;background-color: rgb(246, 214, 175);" target="_blank" href="{{page_url}}">{{site_name}}｜请您签收~</a></div>
                        <p style="font-size: 12px;text-align: center;color: #999;">自动书记人偶竭诚为您服务！<br>©2020<a style="text-decoration:none; color:rgb(246, 214, 175)" href="{{site_url}}">{{site_name}}</a></p>
                    </div>
                </div>
                </form>
            </div><img src="https://npm.elemecdn.com/hexo-butterfly-envelope/lib/after.png" alt="after" style="      position: absolute;bottom: -2px;left: 0;background-repeat: no-repeat;width: 530px;height: 259px;z-index:100">
        </div>
    </div>
</body>
```

## 2.

将 Artalk 后端邮件通知页面中的邮件模板文件的 `default`改为`./data/mail_tpl/MAIL_TEMPLATE.html`，保存即可
![](https://xlenco.onmicrosoft.cn/i/872981219_iXeUwwsxs.webp?updatedAt=1700639162774#id=nFLRh&originHeight=437&originWidth=1080&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 后言

### 参考

- [邮件通知｜ Artalk](https://artalk.js.org/guide/backend/email.html)
- [Twikoo 评论回复邮件模板：Acrylic Mail 粉](https://blog.zhheo.com/p/169a1abb.html)

如果你有需要补充的或有好的建议的可以在评论区发送评论
