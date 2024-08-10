<template>
    <ZSidebar />
    <main class="main">
        <NuxtPage />
        <ZFooter />
    </main>
    <ZAside v-if="$route.meta.aside !== false" />
    <ZPanel />
</template>

<style lang="scss">
#z-root {
    display: flex;
    gap: 0.5rem;
    max-width: $breakpoint-widescreen + 280px;
    margin-inline: auto;
}

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

.main {
    container: main / inline-size;
    flex: 1;
    width: $breakpoint-widescreen;
    min-height: calc(100vh + 5rem);
}
</style>
