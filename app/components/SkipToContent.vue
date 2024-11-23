<template>
    <!-- 若使用 NuxtLink 则键盘焦点不会切换 -->
    <a href="#main-content" class="skip-link gradient-card active">
        跳转到主要内容 / Skip to content
    </a>
</template>

<style lang="scss" scoped>
.skip-link {
    position: fixed;
    width: 80%;
    margin: 1rem;
    padding: 0.5rem;
    text-align: center;
    z-index: 1;
    clip: rect(0, 0, 0, 0);
}

.skip-link:focus {
    clip: auto;
}
</style>
