<template>
    <ZSidebar />
    <div id="content">
        <main>
            <ZHeader />
            <NuxtPage />
            <ZFooter />
        </main>
        <ZAside v-if="$route.meta.aside !== false" />
    </div>
</template>

<style lang="scss">
#z-root {
    display: flex;
    justify-content: center;
    gap: 1rem;

    aside {
        flex-shrink: 0;
        position: sticky;
        top: 0;
        width: 256px;
        height: 100dvh;

        @media (max-width: $breakpoint-widescreen) {
            flex-shrink: 1;

            &#z-aside {
                display: none;
            }
        }
    }

    >#content {
        display: flex;
        flex-shrink: 3;
        gap: inherit;
        width: $breakpoint-widescreen;

        >main {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: space-between;
            min-height: calc(100vh + 5rem);
        }
    }
}
</style>
