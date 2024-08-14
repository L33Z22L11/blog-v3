<template>
    <h3 class="widget-title">
        可访问性
    </h3>
    <div class="widget-card">
        <p>域名启用 DNSSEC 和 HSTS，博客由 Netlify 托管，使用去图图床。</p>
        <p>
            获得省级、国家级认证如下：<br>
            江苏:<span class="middle-finger">跳转反诈宣传</span><br>
            重庆:<span class="middle-finger">DNS污染</span><br>
            移动:<span class="middle-finger">多省阻断解析</span>
        </p>
    </div>
</template>

<style scoped lang="scss">
.widget-card {
    position: relative;
    overflow: hidden;
    line-height: 1.5;
    z-index: 0;

    &::before {
        content: "";
        position: absolute;
        opacity: 0.2;
        inset: 0;
        background: url("https://image.baidu.com/search/down?url=https://i0.hdslb.com/bfs/archive/abf1bb4412360550a18e5f2e71b1227e7d949735.png@320w") center / cover;
        z-index: -1;
    }
}

p {
    margin: 0.5em 0;
}

.middle-finger::before, .middle-finger::after {
    content: "🖕";
}
</style>
