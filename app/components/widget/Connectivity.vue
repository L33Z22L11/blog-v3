<template>
    <h3 class="widget-title">
        可访问性
    </h3>
    <div class="widget-card gbc-bg">
        <!-- TODO: 优化技术架构展示 -->
        <p>博客由 Vercel 托管，由 Nuxt Content 驱动。</p>

    </div>
</template>

<style scoped lang="scss">
.gbc-bg {
    position: relative;
    overflow: hidden;
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
    // 文明用语😋
    content: "\1F595";
}
</style>
