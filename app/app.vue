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
}

aside {
    flex-shrink: 0;
    position: sticky;
    top: 0;
    width: 256px;
    height: 100dvh;

    @media (max-width: $breakpoint-widescreen) {
        flex-shrink: 0.2;

        &#z-aside {
            display: none;
        }
    }
}

#content {
    display: flex;
    gap: inherit;
    width: $breakpoint-widescreen;

    >main {
        flex-grow: 1;
        min-height: calc(100vh + 5rem);
    }
}
</style>
