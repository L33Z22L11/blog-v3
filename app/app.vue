<template>
    <ZSidebar />
    <div id="content">
        <main>
            <NuxtPage />
            <ZFooter />
        </main>
        <ZAside v-if="$route.meta.aside !== false" />
    </div>
    <ZPanel />
</template>

<style lang="scss">
// Nuxt 根元素 id
#z-root {
    display: flex;
    justify-content: center;
}

// 合并处理 #z-sidebar, #z-aside
aside {
    flex-shrink: 0;
    position: sticky;
    top: 0;
    width: 280px;
    height: 100vh;
    height: 100dvh;

    @media (max-width: $breakpoint-widescreen) {
        flex-shrink: 0.5;
    }
}

#content {
    display: flex;

    // 若设置的是 max-width，则内部 main 宽度为 fit-content，可能无法撑满
    width: $breakpoint-widescreen;

    // 若内部元素横向撑开，可设置 width: 0;
    > main {
        flex-grow: 1;
        min-height: calc(100vh + 5rem);
    }
}
</style>
