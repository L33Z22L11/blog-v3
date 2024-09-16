<template>
    <NuxtLoadingIndicator />
    <ZSkipToContent />
    <ZSidebar />
    <div id="content">
        <main id="main-content">
            <NuxtPage />
            <ZFooter />
        </main>
        <ZAside />
    </div>
    <ZPanel />
</template>

<style lang="scss">
// Nuxt 根元素 id
#z-root {
    display: flex;
    justify-content: center;
    gap: 1rem;
    min-width: 0;
}

// 合并处理 #z-sidebar, #z-aside
aside {
    flex-shrink: 0;
    position: sticky;
    top: 0;
    width: 280px;
    height: 100vh;
    height: 100dvh;
    scrollbar-width: thin;

    @media (max-width: $breakpoint-widescreen) {
        flex-shrink: 0.2;
    }
}

#content {
    display: flex;
    gap: 1rem;

    // 若设置的是 max-width，则内部 main 宽度为 fit-content，可能无法撑满
    // 此时即使设置 flex-grow，也会影响 #sidebar 无法正确 shrink
    width: $breakpoint-widescreen;

    // 解决父级 flexbox 设置 justify-content: center 时溢出左侧消失的问题
    min-width: 0;

    // 为了使内容正确计算宽度而不横向溢出，方法有三：
    // 1. 设置 min-width: 0
    // 2. 使内容失去宽度，由 flex 全权 grow
    // 3. 设置 contain: inline-size 也可，但兼容性不佳
    > main {
        flex-grow: 1;
        min-width: 0;
        min-height: calc(100vh + 5rem);
    }
}
</style>
