<template>
    <ZSidebar />
    <div class="content">
        <ZHeader />
        <main>
            <NuxtPage />
        </main>
    </div>
    <ZAside />
</template>

<style lang="scss">
#z-root {
    display: flex;
    grid-template-columns: 1fr minmax(200px, 720px) 1fr;
    justify-content: center;
    gap: 1rem;

    >aside {
        position: sticky;
        top: 0;
        width: 240px;
        height: 100dvh;
    }

    >.content {
        flex-shrink: 3;
        width: 720px;
    }
}

@media (max-width: $breakpoint-widescreen) {
    #z-aside {
        display: none;
    }
}
</style>
