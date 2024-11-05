<template>
    <h3 class="widget-title">
        可访问性
    </h3>
    <div class="widget-card sp-bg">
        <!-- TODO: 优化技术架构展示 -->
        <p>域名启用 DNSSEC 和 HSTS，续费至2030年8月，托管于 Vercel；博客由 Nuxt Content 驱动，使用去图图床。</p>
        <p>
            获得省级、国家级认证如下：<br>
            江苏:<span class="sp-emoji">跳转反诈宣传</span><br>
            重庆:<span class="sp-emoji">DNS污染</span><br>
            移动:<span class="sp-emoji">多省阻断解析</span>
        </p>
    </div>
</template>

<style lang="scss" scoped>
.sp-bg {
    position: relative;
    overflow: hidden;
    z-index: 0;

    &::before {
        content: "";
        position: absolute;
        opacity: 0.2;
        inset: 0;
        background: center / cover;
        background-image: url("https://wsrv.nl/?url=i1.hdslb.com/bfs/archive/d275f7712860be44d5fa947971d86688eeddbeea.jpg@320w");
        z-index: -1;
    }
}

.sp-emoji::before, .sp-emoji::after {
    // 文明用语😋\1F595
    content: "😠";
}
</style>
