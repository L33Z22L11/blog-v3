<template>
    <h3 class="widget-title">
        可访问性
    </h3>
    <div class="widget-card gbc-bg">
        <p>域名启用 DNSSEC 和 HSTS，博客由 Netlify 托管，使用去图图床。</p>
        <p>
            获得省级、国家级认证如下：<br>
            江苏:<span class="m-finger">跳转反诈宣传</span><br>
            重庆:<span class="m-finger">DNS污染</span><br>
            移动:<span class="m-finger">多省阻断解析</span>
        </p>
    </div>
</template>

<style scoped lang="scss">
.gbc-bg {
    position: relative;
    overflow: hidden;
    line-height: 1.5;
    z-index: 0;

    &::before {
        content: "";
        position: absolute;
        opacity: 0.2;
        inset: 0;
        background: center / cover;
        background-image: url("https://image.baidu.com/search/down?url=https://i0.hdslb.com/bfs/archive/abf1bb4412360550a18e5f2e71b1227e7d949735.png@320w");
        z-index: -1;
    }
}

.m-finger::before, .m-finger::after {
    content: "\1F595";
}
</style>
