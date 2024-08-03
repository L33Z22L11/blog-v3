<template>
    <ZSidebar />
    <div class="content">
        <ZHeader />
        <main>
            <NuxtPage />
        </main>
    </div>
</template>

<style lang="scss">
#z-root {
    display: flex;
    justify-content: center;
    height: 100vh;
    height: 100dvh;

    >.content {
        flex-grow: 1;
        overflow: auto;

        main {
            padding: 1rem 5vw;
        }
    }
}
</style>
